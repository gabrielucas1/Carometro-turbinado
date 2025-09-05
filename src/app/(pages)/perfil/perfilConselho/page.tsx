"use client"

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO";
import alunoDAO from "@/DAOs/AlunoDAO";
import registroProfessorDescricaoDAO from "@/DAOs/RegistroProfessorDescricaoDAO";
import AlunoCard from "@/components/AlunoCard";

export default function PerfilConselho() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idConselho = searchParams.get("id");
  const [conselho, setConselho] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

function handleComments(alunoId: string, conselhoId: string) {
  router.push(`/adicionar/addComentario?alunoId=${alunoId}&conselhoId=${conselhoId}`);
}

  useEffect(() => {
    async function fetchData() {
      if (!idConselho) return;
      setCarregando(true);
      const conselhoBuscado = await conselhoClasseDAO.getOne(idConselho);
      console.log("[DEBUG] perfilConselho - conselhoBuscado:", conselhoBuscado);
      setConselho(conselhoBuscado);
      // Buscar nome da turma se vier como referência
      let turmaId = "";
      if (typeof conselhoBuscado.turma === "string") {
        turmaId = (conselhoBuscado.turma as string).split("/").pop() || "";
      } else if (
        conselhoBuscado.turma &&
        typeof conselhoBuscado.turma === "object" &&
        "id" in conselhoBuscado.turma
      ) {
        turmaId = (conselhoBuscado.turma as { id: string }).id;
      }
      let turmaObj = null;
      if (turmaId) {
        try {
          const turmaDAO = (await import("@/DAOs/TurmaDAO")).default;
          turmaObj = await turmaDAO.getOne(turmaId);
          console.log("[DEBUG] perfilConselho - turmaObj:", turmaObj);
        } catch (err) {
          console.log("[DEBUG] perfilConselho - erro ao buscar turma:", err);
        }
      }
      // Buscar alunos da turma
      let alunosTurma: any[] = [];
      if (turmaId) {
        alunosTurma = await alunoDAO.getByTurmaId(turmaId);
        console.log("[DEBUG] perfilConselho - alunosTurma:", alunosTurma);
      }
      setAlunos(alunosTurma);
      // Buscar comentários para cada aluno, filtrando apenas os do conselho atual
      const comentariosTodos: any[] = [];
      for (const aluno of alunosTurma) {
        const comentariosAluno = await registroProfessorDescricaoDAO.getByAluno(aluno.id);
        // Filtrar apenas comentários do conselho atual
        const comentariosFiltrados = comentariosAluno.filter((coment: any) => {
          // Pode ser string ou referência, então comparar id ou path
          if (!coment.conselhoClasse) return false;
          if (typeof coment.conselhoClasse === "string") {
            return coment.conselhoClasse.split("/").pop() === idConselho;
          }
          if (typeof coment.conselhoClasse === "object" && "id" in coment.conselhoClasse) {
            return coment.conselhoClasse.id === idConselho;
          }
          return false;
        });
        comentariosTodos.push({ aluno, comentarios: comentariosFiltrados });
      }
      console.log("[DEBUG] perfilConselho - comentariosTodos:", comentariosTodos);
      setComentarios(comentariosTodos);
      // Atualizar conselho com nome da turma
      setConselho({ ...conselhoBuscado, turma: turmaObj });
      setCarregando(false);
    }
    fetchData();
  }, [idConselho]);

  const handleAdicionarComentario = (alunoId: string, conselhoId: string) => {
    router.push(`/conselho/adicionarComentario?alunoId=${alunoId}&conselhoId=${conselhoId}`);
  };

  if (carregando) return <div className="p-8">Carregando...</div>;
  if (!conselho) return <div className="p-8">Conselho não encontrado.</div>;

  console.log("[DEBUG] Render conselho.turma:", conselho.turma);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-white">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Detalhes do Conselho de Classe</h1>
        <div className="bg-blue-100 rounded-xl p-6 shadow mb-8 text-center">
            <p className="font-bold text-2xl">{conselho.nome}</p>
            <p className="text-lg">Turma: {conselho.turma?.nome || conselho.turma?.id || "-"}</p>
            <p className="text-lg">Data: {conselho.dataCriacao ? new Date(conselho.dataCriacao).toLocaleDateString() : "-"}</p>
        </div>
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Alunos</h2>
        {comentarios.length === 0 ? (
          <p className="text-gray-500">Nenhum aluno/comentário encontrado.</p>
        ) : (
          <div className="space-y-6">
            {comentarios.map(({ aluno, comentarios }) => (
                <div key={aluno.id} className="mb-4 flex flex-col items-center">
                <AlunoCard aluno={aluno} onClick={() => idConselho && handleComments(aluno.id, idConselho)} />
                <div className="ml-4 w-full max-w-lg">
                  {comentarios.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">Nenhum comentário registrado.</p>
                  ) : (
                  <ul className="list-disc ml-6">
                    {comentarios.map((coment: any, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700">
                      <span className="font-semibold">Prof. {coment.registroProfessor?.usuario?.nome || "-"}:</span> {coment.observacao}
                    </li>
                    ))}
                  </ul>
                  )}
                </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
