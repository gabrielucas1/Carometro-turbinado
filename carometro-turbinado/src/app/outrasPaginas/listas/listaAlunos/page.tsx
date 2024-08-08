"use client"

import alunoDAO from "@/DAOs/AlunoDAO"
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO"
import turmaDAO from "@/DAOs/TurmaDAO"
import Aluno from "@/model/Aluno"
import TurmaAluno from "@/model/TurmaAluno"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListaAlunos() {
    const [listaAlunos, setListaAlunos] = useState<Aluno[]>([])
    const router = useRouter()

    //PEGAR O ID TURMA, CASO VENHA DA TELA PERFIL TURMA, PARA ADICIONAR ALUNOS A TURMA
    const searchParams = useSearchParams()
    const idTurma = searchParams.get("id")

    useEffect(() => {
        alunoDAO.getAll().then((alunos) => {
            setListaAlunos(alunos)
            console.log(alunos)
        }).catch((e) => {
            console.log(e.message)
        })
    }, [])

    function navegarPerfil(idAluno: string) {
        router.push(`/outrasPaginas/perfil/perfilAluno?id=${idAluno}`)
    }

    async function adicionarAlunoTurma(aluno: Aluno) {
        const turmaAluno = new TurmaAluno
        turmaAluno.aluno = aluno

        try {
            turmaAluno.turma = await turmaDAO.getOne(idTurma!)
            await turmaAlunoDAO.inserir(turmaAluno)
            router.push(`/outrasPaginas/perfil/perfilTurma?id=${idTurma}`)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    return (
        <>
            <h1 className="text-2xl mt-4">Lista de Alunos</h1>

            {idTurma == null &&
                listaAlunos.map((aluno) => (
                    <button onClick={() => navegarPerfil(aluno.id)} key={aluno.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                        <p>{`Nome: ${aluno.nome}`}</p>
                        <p>{`Data de Nascimento: ${aluno.dataNascimento}`}</p>
                    </button>
                ))
            }

            {idTurma == null &&
                <Link href={"/outrasPaginas/adicionar/addAluno"}>
                    <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
                </Link>
            }


            {idTurma != null &&
                listaAlunos.map((aluno) => (
                    <button onClick={() => adicionarAlunoTurma(aluno)} key={aluno.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                        <p>{`Nome: ${aluno.nome}`}</p>
                        <p>{`Data de Nascimento: ${aluno.dataNascimento}`}</p>
                    </button>
                ))
            }

        </>
    )
}
