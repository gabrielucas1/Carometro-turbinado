"use client"

import { useContext, useEffect, useState } from "react";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO"; // Implemente o método getAll()
import ConselhoCard from "@/components/ConselhoCard";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

export default function ConselhoPage() {
  const [conselhos, setConselhos] = useState<any[]>([]);
  const [nomesTurmas, setNomesTurmas] = useState<{ [id: string]: string }>({});
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  const usuarioLogado = useContext(UserContext).usuarioLogado;

  useEffect(() => {
    async function fetchConselhos() {
      try {
        const lista = await conselhoClasseDAO.getAll();
        setConselhos(lista);
        // Buscar nome das turmas
        const nomes: { [id: string]: string } = {};
        for (const conselho of lista) {
          let turmaId = "";
          if (typeof conselho.turma === "string") {
            turmaId = (conselho.turma as string).split("/").pop() || "";
          } else if (conselho.turma && typeof conselho.turma === "object" && "id" in conselho.turma) {
            turmaId = conselho.turma.id;
          }
          console.log("[DEBUG] listaConselho - turmaId:", turmaId);
          if (turmaId) {
            try {
              const turmaDAO = (await import("@/DAOs/TurmaDAO")).default;
              const turmaObj = await turmaDAO.getOne(turmaId);
              console.log("[DEBUG] listaConselho - turmaObj:", turmaObj);
              nomes[conselho.id] = turmaObj.nome;
            } catch (err) {
              console.log("[DEBUG] listaConselho - erro ao buscar turma:", err);
              nomes[conselho.id] = "-";
            }
          } else {
            nomes[conselho.id] = "-";
          }
        }
        setNomesTurmas(nomes);
      } catch (e) {
        setConselhos([]);
      }
      setCarregando(false);
    }
    fetchConselhos();
  }, []);

  function criarConselho() {
    router.push("/adicionar/addConselho");
  }


  function verDetalhes(idConselho: string) {
    router.push(`/perfil/perfilConselho?id=${idConselho}`);
  }

  function gerarRelatorio(idConselho: string) {
    // Função para gerar relatório do conselho de classe em PDF
    import('jspdf').then(async (jsPDFModule) => {
      const jsPDF = jsPDFModule.default;
      // Buscar dados do conselho
      const conselho = conselhos.find(c => c.id === idConselho);
      let turmaId = "";
      if (typeof conselho.turma === "string") {
        turmaId = (conselho.turma as string).split("/").pop() || "";
      } else if (conselho.turma && typeof conselho.turma === "object" && "id" in conselho.turma) {
        turmaId = conselho.turma.id;
      }
      // Buscar alunos da turma (sem filtro por escola)
      const turmaAlunoDAO = (await import("@/DAOs/TurmaAlunoDAO")).default;
      const alunos = await turmaAlunoDAO.getAlunos(turmaId);
      // Buscar comentários do conselho para cada aluno
      const registroProfessorDescricaoDAO = (await import("@/DAOs/RegistroProfessorDescricaoDAO")).default;
      // Buscar todos comentários do aluno (igual ao perfilAluno)
      const comentariosPorAluno: { [id: string]: any[] } = {};
      console.log('[DEBUG] gerarRelatorio - idConselho:', idConselho);
      for (const aluno of alunos) {
        try {
          const comentarios = await registroProfessorDescricaoDAO.getByAluno(aluno.id);
          console.log(`[DEBUG] Comentários brutos para aluno ${aluno.nome} (${aluno.id}):`, comentarios);
          comentariosPorAluno[aluno.id] = comentarios;
        } catch (err) {
          console.error(`[ERRO] ao buscar aluno ou comentários:`, err, aluno);
          comentariosPorAluno[aluno.id] = [];
        }
      }
      // Gerar PDF
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text(`Relatório Conselho de Classe`, 15, 20);
      doc.setFontSize(16);
      doc.text(`Turma: ${nomesTurmas[idConselho] || turmaId}`, 15, 30);
      let y = 40;
      // Ao gerar o PDF, filtrar por conselho de classe
      for (const aluno of alunos) {
        doc.setFontSize(14);
        doc.setTextColor(40, 40, 120);
        doc.text(aluno.nome, 15, y);
        y += 7;
        // Filtro robusto: aceita comentários com conselhoClasse.id OU registroProfessor.conselhoClasse.id igual ao idConselho
        let comentarios = comentariosPorAluno[aluno.id].filter((c: any) => {
          const idComentarioDireto = c.conselhoClasse?.id;
          const idComentarioRegistro = c.registroProfessor?.conselhoClasse?.id;
          const idComentario = String(idComentarioDireto || idComentarioRegistro).trim();
          const idConselhoStr = String(idConselho).trim();
          if (!idComentarioDireto && !idComentarioRegistro) {
            console.log(`[DEBUG] Comentário ignorado (conselhoClasse/id nulo em ambos) para aluno ${aluno.nome}:`, c);
            return false;
          }
          const match = idComentario === idConselhoStr;
          if (!match) {
            console.log(`[DEBUG] Comentário ignorado para aluno ${aluno.nome}:`, c, `idComentario: ${idComentario}, idConselho: ${idConselhoStr}`);
          }
          return match;
        });
        // Loga os IDs dos comentários brutos antes do filtro de duplicados
        console.log(`[DEBUG] Comentários brutos para aluno ${aluno.nome}:`, comentarios.map(c => c.id));
        // Remove duplicados pelo id do comentário
        const vistos = new Set();
        comentarios = comentarios.filter((c: any) => {
          if (vistos.has(c.id)) return false;
          vistos.add(c.id);
          return true;
        });
        // Loga os IDs dos comentários finais após o filtro
        console.log(`[DEBUG] Comentários finais para aluno ${aluno.nome}:`, comentarios.map(c => c.id));
        if (!comentarios || comentarios.length === 0) {
          doc.setFontSize(12);
          doc.setTextColor(120, 120, 120);
          doc.text("Nenhum comentário.", 20, y);
          y += 7;
        } else {
          for (const comentario of comentarios) {
            const nomeProf = comentario.registroProfessor?.usuario?.nome || "Professor";
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Prof. ${nomeProf}: ${comentario.observacao}`, 20, y);
            y += 7;
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
          }
        }
        y += 3;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      }
      doc.save(`relatorio-conselho-classe.pdf`);
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-white">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Conselhos de Classe</h1>
        <button
          className="mb-6 bg-blue-600 text-white py-2 px-8 rounded-full font-semibold shadow hover:bg-blue-700"
          onClick={criarConselho}
        >Criar novo conselho</button>
        {carregando ? (
          <p>Carregando conselhos...</p>
        ) : conselhos.length === 0 ? (
          <p className="text-gray-500">Nenhum conselho cadastrado.</p>
        ) : (
          <div className="space-y-6">
            {conselhos.map((conselho) => (
              <ConselhoCard
                key={conselho.id}
                nome={conselho.nome}
                turma={nomesTurmas[conselho.id] || "-"}
                data={conselho.dataCriacao ? new Date(conselho.dataCriacao.seconds ? conselho.dataCriacao.seconds * 1000 : conselho.dataCriacao).toLocaleDateString() : "-"}
                onVerDetalhes={() => verDetalhes(conselho.id)}
                onGerarRelatorio={() => gerarRelatorio(conselho.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
