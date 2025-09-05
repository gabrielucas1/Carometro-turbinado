"use client"

import { useEffect, useState } from "react";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO"; // Implemente o método getAll()
import ConselhoCard from "@/components/ConselhoCard";
import { useRouter } from "next/navigation";

export default function ConselhoPage() {
  const [conselhos, setConselhos] = useState<any[]>([]);
  const [nomesTurmas, setNomesTurmas] = useState<{ [id: string]: string }>({});
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

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

  function adicionarComentario(idConselho: string, idAluno: string) {
    router.push(`/adicionar/addConselho?idConselho=${idConselho}&idAluno=${idAluno}`);
  }

  function verDetalhes(idConselho: string) {
    router.push(`/perfil/perfilConselho?id=${idConselho}`);
  }

  function gerarRelatorio(idConselho: string) {
    router.push(`/conselho/relatorio?id=${idConselho}`);
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
