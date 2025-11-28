"use client";

import AlunoCard from "@/components/AlunoCard";
import alunoDAO from "@/DAOs/AlunoDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import Aluno from "@/model/Aluno";
import TurmaAluno from "@/model/TurmaAluno";
import Turma from "@/model/Turma";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";

export default function ListaAlunos() {
  const [listaAlunos, setListaAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true); // Estado para indicar carregamento
  const [atualizandoLista, setAtualizandoLista] = useState(false); // Estado para recarregar lista após transferência
  const router = useRouter();

  // PEGAR O ID TURMA, CASO VENHA DA TELA PERFIL TURMA, PARA ADICIONAR ALUNOS A TURMA
  const searchParams = useSearchParams();
  const idTurmaAddAluno = searchParams.get("idTurmaAddAluno");
  const idTurma = searchParams.get("idTurma");
  const [idCurso, setIdCurso] = useState<string | null>(
    searchParams.get("idCurso")
  );
  const [listaTurmas, setListaTurmas] = useState<Turma[]>([]); // Adiciona listaTurmas

  useEffect(() => {
    setCarregando(true);
    async function buscarAlunosComTurma() {
      try {
        const alunos = await alunoDAO.getByTurmaId(idTurma!);
        console.log("Alunos encontrados:", alunos);
        if (!alunos || alunos.length === 0) {
          console.log("Nenhum aluno encontrado para a turma:", idTurma);
        }
        // Para cada aluno, buscar a turma e adicionar o nome da turma
        const alunosComTurma = await Promise.all(
          alunos.map(async (aluno) => {
            let nomeTurma = "";
            if (aluno.idTurma) {
              const turma = await turmaDAO.getOne(aluno.idTurma);
              nomeTurma = turma?.nome || "";
            }
            return { ...aluno, nomeTurma };
          })
        );
        setListaAlunos(alunosComTurma);
      } catch (e: any) {
        console.log("Erro ao buscar alunos:", e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscarAlunosComTurma();

    // Buscar idCurso diretamente da turma se não vier na URL
    async function buscarIdCursoDaTurma() {
      if (!idCurso && idTurma) {
        try {
          const turma = await turmaDAO.getOne(idTurma);
          if (turma && turma.curso && turma.curso.id) {
            setIdCurso(turma.curso.id);
          }
        } catch (e: any) {
          console.log("Erro ao buscar turma para idCurso:", e.message);
        }
      }
    }
    buscarIdCursoDaTurma();
  }, [idTurma]);

  // Adicionar listener para recarregar dados quando a página volta ao foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !carregando) {
        // Página voltou ao foco, recarregar dados
        recarregarLista();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [idTurma, carregando]);

  // Removido: navegarPerfil não é utilizado

  async function adicionarAlunoTurma(aluno: Aluno) {
    const turmaAluno = new TurmaAluno();
    turmaAluno.aluno = aluno;

    try {
      // Buscar turma pelo idTurma
      turmaAluno.turma = await turmaDAO.getOne(idTurma!);
      await turmaAlunoDAO.inserir(turmaAluno);
      router.push(`/perfil/perfilTurma?idTurma=${idTurma}`);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  // Função para recarregar a lista após transferência ou exclusão
  async function recarregarLista() {
    setAtualizandoLista(true);
    try {
      const alunos = await alunoDAO.getByTurmaId(idTurma!);
      console.log("Lista recarregada - Alunos encontrados:", alunos);

      // Para cada aluno, buscar a turma e adicionar o nome da turma
      const alunosComTurma = await Promise.all(
        alunos.map(async (aluno) => {
          let nomeTurma = "";
          if (aluno.idTurma) {
            const turma = await turmaDAO.getOne(aluno.idTurma);
            nomeTurma = turma?.nome || "";
          }
          return { ...aluno, nomeTurma };
        })
      );
      setListaAlunos(alunosComTurma);
    } catch (e: any) {
      console.error("Erro ao recarregar lista:", e.message);
    } finally {
      setAtualizandoLista(false);
    }
  }

  // Breadcrumb sempre com link se idCurso for resolvido
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Cursos", href: "/listas/listaCursos" },
    {
      label: "Turmas",
      href: idCurso ? `/listas/listaTurmas?idCurso=${idCurso}` : undefined,
    },
    { label: " Alunos", isActive: true },
  ];

  // Ordenar a lista de alunos em ordem alfabética e adicionar identificadores únicos
  const alunosOrdenados = listaAlunos.sort((a, b) =>
    a.nome.localeCompare(b.nome)
  );

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-4 py-10 bg-white">
      <div className="w-full max-w-3xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-extrabold text-blue-700 mb-10 text-center tracking-tight">
          Lista de Alunos
        </h1>

        {/* Indicador de atualização */}
        {atualizandoLista && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700 font-medium">
                Atualizando lista...
              </span>
            </div>
          </div>
        )}

        {carregando ? (
          <p>Carregando alunos...</p>
        ) : (
          <>
            {idTurmaAddAluno == null && (
              <div className="flex flex-col py-6 gap-4 items-center max-h-[80vh] overflow-y-auto">
                {alunosOrdenados.length === 0 ? (
                  <p className="text-lg text-gray-500 text-center">
                    Nenhum aluno encontrado para esta turma.
                  </p>
                ) : (
                  alunosOrdenados.map((aluno, index) => (
                    <div
                      key={aluno.id}
                      className="flex items-center justify-between w-full max-w-lg"
                    >
                      <span className="font-bold mr-2">{index + 1}-</span>
                      <AlunoCard
                        aluno={aluno}
                        showTransferButton={true}
                        turmaAtualId={idTurma || undefined}
                        onTransfer={recarregarLista}
                        onDelete={recarregarLista}
                        profileUrl={`/perfil/perfilAluno?id=${aluno.id}${
                          idTurma ? `&idTurma=${idTurma}` : ""
                        }${idCurso ? `&idCurso=${idCurso}` : ""}`}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {idTurmaAddAluno == null && idTurma && (
              <Link href={`/adicionar/addAluno?idTurma=${idTurma}`}>
                <button className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 border-2 border-blue-200">
                  <span className="text-2xl">➕</span>
                  <span className="text-lg">Adicionar Aluno</span>
                </button>
              </Link>
            )}

            {idTurmaAddAluno != null && (
              <div className="flex flex-col py-6 gap-4 items-center ">
                {alunosOrdenados.map((aluno, index) => (
                  <button
                    onClick={() => adicionarAlunoTurma(aluno)}
                    key={aluno.id}
                    className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer"
                  >
                    <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                      <Image
                        src={aluno.fotoUrl}
                        width={100}
                        alt={`Foto do aluno ${aluno.nome}`}
                      />
                    </div>
                    <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                      <span className="font-bold mr2"> {index + 1}</span>
                      <AlunoCard aluno={aluno} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
