"use client"

import { useContext, useEffect, useState } from "react";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO"; // Implemente o método getAll()
import ConselhoCard from "@/components/ConselhoCard";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

export default function ConselhoPage() {
  const [conselhos, setConselhos] = useState<any[]>([]);
  const [nomesTurmas, setNomesTurmas] = useState<{ [id: string]: string }>({});
  const [horasConselhos, setHorasConselhos] = useState<{ [id: string]: string }>({});
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  const usuarioLogado = useContext(UserContext).usuarioLogado;

  useEffect(() => {
    async function fetchConselhos() {
      try {
        const lista = await conselhoClasseDAO.getAll();
        console.log('[DEBUG] lista de conselhos:', lista);
        setConselhos(lista);
        // Buscar nome das turmas
        const nomes: { [id: string]: string } = {};
        const horas: { [id: string]: string } = {};
        for (const conselho of lista) {
          console.log('[DEBUG] Processando conselho:', conselho);
          let turmaId = "";
          if (typeof conselho.turma === "object" && conselho.turma && "nome" in conselho.turma && conselho.turma.nome) {
            console.log('[DEBUG] Nome da turma já presente no objeto:', conselho.turma.nome);
            nomes[conselho.id] = conselho.turma.nome;
            continue;
          }
          if (typeof conselho.turma === "string") {
            turmaId = (conselho.turma as string).split("/").pop() || "";
            console.log('[DEBUG] turmaId extraído de string:', turmaId);
          } else if (conselho.turma && typeof conselho.turma === "object" && "id" in conselho.turma) {
            turmaId = (conselho.turma as { id: string }).id;
            console.log('[DEBUG] turmaId extraído de objeto:', turmaId);
          }
          if (turmaId) {
            try {
              const turmaDAO = (await import("@/DAOs/TurmaDAO")).default;
              const turmaObj = await turmaDAO.getOne(turmaId);
              console.log('[DEBUG] turmaObj retornado:', turmaObj);
              nomes[conselho.id] = turmaObj.nome;
            } catch (err) {
              console.log('[DEBUG] Erro ao buscar turma pelo id:', turmaId, err);
              nomes[conselho.id] = "-";
            }
          } else {
            console.log('[DEBUG] Não foi possível extrair turmaId para o conselho:', conselho.id);
            nomes[conselho.id] = "-";
          }
          // Derivar hora do conselho
          let horaStr = "-";
          try {
            if (conselho?.hora) {
              // Caso exista um campo específico de hora
              if (typeof conselho.hora === 'string') {
                horaStr = conselho.hora;
              } else if (typeof conselho.hora === 'object' && 'seconds' in conselho.hora) {
                const d = new Date((conselho.hora as any).seconds * 1000);
                horaStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              }
            } else if (conselho?.dataCriacao) {
              // Atualizando a lógica para derivar a data de `dataCriacao` com segurança
              let date: Date | null = null;
              if (typeof conselho.dataCriacao === 'object' && 'seconds' in conselho.dataCriacao) {
                date = new Date((conselho.dataCriacao as { seconds: number }).seconds * 1000);
              } else if (typeof conselho.dataCriacao === 'number') {
                date = new Date(conselho.dataCriacao);
              } else if (typeof conselho.dataCriacao === 'string') {
                date = new Date(conselho.dataCriacao);
              } else if (conselho.dataCriacao instanceof Date) {
                date = conselho.dataCriacao as Date;
              }
              if (date && !isNaN(date.getTime())) {
                horaStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              }
            }
          } catch (e) {
            console.log('[DEBUG] Falha ao derivar hora do conselho', conselho?.id, e);
          }
          horas[conselho.id] = horaStr;
        }
        console.log('[DEBUG] nomesTurmas final:', nomes);
        console.log('[DEBUG] horasConselhos final:', horas);
        setNomesTurmas(nomes);
        setHorasConselhos(horas);
      } catch (e) {
        console.log('[DEBUG] Erro ao buscar conselhos:', e);
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
      console.log('[DEBUG] Dados do conselho:', conselho);
      
      let turmaId = "";
      if (typeof conselho.turma === "string") {
        turmaId = (conselho.turma as string).split("/").pop() || "";
        console.log('[DEBUG] TurmaId extraído de string:', turmaId);
      } else if (conselho.turma && typeof conselho.turma === "object") {
        if ("id" in conselho.turma) {
          turmaId = conselho.turma.id;
          console.log('[DEBUG] TurmaId extraído do campo id:', turmaId);
        } else if ("idTurma" in conselho.turma) {
          turmaId = conselho.turma.idTurma;
          console.log('[DEBUG] TurmaId extraído do campo idTurma:', turmaId);
        }
      }
      
      if (!turmaId) {
        console.error('[ERRO] Não foi possível extrair o ID da turma do conselho:', conselho);
        return;
      }
      // Buscar alunos da turma (sem filtro por escola)
      const turmaAlunoDAO = (await import("@/DAOs/TurmaAlunoDAO")).default;
      console.log('[DEBUG] Buscando alunos da turma:', turmaId);
      const alunos = await turmaAlunoDAO.getAlunos(turmaId);
      console.log('[DEBUG] Alunos encontrados:', alunos);

      // Buscar comentários do conselho para cada aluno
      const registroProfessorDescricaoDAO = (await import("@/DAOs/RegistroProfessorDescricaoDAO")).default;
      // Buscar todos comentários do aluno (igual ao perfilAluno)
      const comentariosPorAluno: { [id: string]: any[] } = {};
      console.log('[DEBUG] gerarRelatorio - idConselho:', idConselho);
      
      // Verificar se há alunos antes de continuar
      if (!alunos || alunos.length === 0) {
        console.log('[DEBUG] Nenhum aluno encontrado para a turma:', turmaId);
        return;
      }
      for (const aluno of alunos) {
        try {
          console.log(`[DEBUG] Buscando comentários para aluno:`, aluno);
          const comentarios = await registroProfessorDescricaoDAO.getByAluno(aluno.id);
          console.log(`[DEBUG] Comentários encontrados para aluno ${aluno.nome}:`, comentarios);
          
          if (comentarios && comentarios.length > 0) {
            comentariosPorAluno[aluno.id] = comentarios;
            // Verificar a estrutura de cada comentário
            comentarios.forEach((comentario: any, index: number) => {
              console.log(`[DEBUG] Estrutura do comentário ${index + 1} para ${aluno.nome}:`, {
                id: comentario.id,
                conselhoClasse: comentario.conselhoClasse,
                observacao: comentario.observacao
              });
            });
          } else {
            console.log(`[DEBUG] Nenhum comentário encontrado para o aluno ${aluno.nome}`);
            comentariosPorAluno[aluno.id] = [];
          }
        } catch (err) {
          console.error(`[ERRO] ao buscar comentários para ${aluno.nome}:`, err);
          comentariosPorAluno[aluno.id] = [];
        }
      }
      console.log(`[DEBUG] Comentários por aluno antes do filtro:`, comentariosPorAluno);
      console.log(`[DEBUG] Alunos carregados:`, alunos);
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
          console.log(`[DEBUG] Analisando comentário para ${aluno.nome}:`, c);
          
          // Verificar se o comentário tem um conselho associado
          const conselhoRef = c.conselhoClasse;
          if (!conselhoRef) {
            console.log(`[DEBUG] Comentário sem conselho associado:`, c);
            return false;
          }
          
          // Extrair o ID do conselho
          let conselhoId;
          if (typeof conselhoRef === 'object') {
            conselhoId = conselhoRef.id;
            console.log(`[DEBUG] ID do conselho encontrado (objeto):`, conselhoId);
          } else if (typeof conselhoRef === 'string') {
            conselhoId = conselhoRef.split('/').pop();
            console.log(`[DEBUG] ID do conselho encontrado (string):`, conselhoId);
          }

          if (!conselhoId) {
            console.log(`[DEBUG] Não foi possível extrair o ID do conselho:`, conselhoRef);
            return false;
          }

          const match = String(conselhoId).trim() === String(idConselho).trim();
          console.log(`[DEBUG] Comparando IDs - Comentário: ${conselhoId}, Conselho: ${idConselho}, Match: ${match}`);
          return match;
        });

        // Adicionar log detalhado para verificar estrutura dos comentários
        console.log(`[DEBUG] Estrutura dos comentários para ${aluno.nome}:`, comentariosPorAluno[aluno.id]);
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
        {usuarioLogado?.tipoUsuario === "admEscola" && (
          <button
            className="mb-6 bg-blue-600 text-white py-2 px-8 rounded-full font-semibold shadow hover:bg-blue-700"
            onClick={criarConselho}
          >Criar novo conselho</button>
        )}
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
                hora={horasConselhos[conselho.id] || "-"}
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

