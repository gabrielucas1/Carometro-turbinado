"use client";

import AlunoCard from "@/components/AlunoCard";
import alunoDAO from "@/DAOs/AlunoDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import Aluno from "@/model/Aluno";
import TurmaAluno from "@/model/TurmaAluno";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ListaAlunos() {
    const [listaAlunos, setListaAlunos] = useState<Aluno[]>([]);
    const [carregando, setCarregando] = useState(true); // Estado para indicar carregamento
    const router = useRouter();

    // PEGAR O ID TURMA, CASO VENHA DA TELA PERFIL TURMA, PARA ADICIONAR ALUNOS A TURMA
    const searchParams = useSearchParams();
    const idTurmaAddAluno = searchParams.get("idTurmaAddAluno");
    const idTurma = searchParams.get("idTurma");

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
                const alunosComTurma = await Promise.all(alunos.map(async (aluno) => {
                    let nomeTurma = "";
                    if (aluno.idTurma) {
                        const turma = await turmaDAO.getOne(aluno.idTurma);
                        nomeTurma = turma?.nome || "";
                    }
                    return { ...aluno, nomeTurma };
                }));
                setListaAlunos(alunosComTurma);
            } catch (e: any) {
                console.log("Erro ao buscar alunos:", e.message);
            } finally {
                setCarregando(false);
            }
        }
        buscarAlunosComTurma();
    }, [idTurma]);

    // Removido: navegarPerfil não é utilizado

    async function adicionarAlunoTurma(aluno: Aluno) {
        const turmaAluno = new TurmaAluno();
        turmaAluno.aluno = aluno;

        try {
            turmaAluno.turma = await turmaDAO.getOne(idTurma!);
            await turmaAlunoDAO.inserir(turmaAluno);
            router.push(`/perfil/perfilTurma?id=${idTurma}`);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return (
        <>
            <h1 className="text-2xl mt-6">Lista de Alunos</h1>

            {carregando ? (
                <p>Carregando alunos...</p>
            ) : (
                <>
                    {idTurmaAddAluno == null && (
                        <div className="flex flex-col py-6 gap-4">
                            {listaAlunos.length === 0 ? (
                                <p className="text-lg text-gray-500">Nenhum aluno encontrado para esta turma.</p>
                            ) : (
                                listaAlunos.map((aluno) => (
                                    <AlunoCard aluno={aluno} key={aluno.id} />
                                ))
                            )}
                        </div>
                    )}

                    {idTurmaAddAluno == null && (
                        <Link href={`/adicionar/addAluno?idTurma=${idTurma}`}>
                            <button
                                className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 border-2 border-blue-200"
                            >
                                <span className="text-2xl">➕</span>
                                <span className="text-lg">Adicionar Aluno</span>
                            </button>
                        </Link>
                    )}

                    {idTurmaAddAluno != null && (
                        <div className="flex flex-col py-6 gap-4">
                            {listaAlunos.map((aluno) => (
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
                                        <p className="text-xl">{aluno.nome}</p>
                                        <div className="">
                                            <p>{aluno.dataNascimento}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    )
};