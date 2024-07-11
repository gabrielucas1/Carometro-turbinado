"use client"

import alunoDAO from "@/DAOs/AlunoDAO"
import Aluno from "@/model/Aluno"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListaAlunos() {
    const [listaAlunos, setListaAlunos] = useState<Aluno[]>([])
    const router = useRouter()

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

    return (
        <>
            <h1 className="text-2xl mt-4">Lista de Alunos</h1>

            {
                listaAlunos.map((aluno) => (
                    <button onClick={() => navegarPerfil(aluno.id)} key={aluno.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                        <p>{`Nome: ${aluno.nome}`}</p>
                        <p>{`Data de Nascimento: ${aluno.dataNascimento}`}</p>
                    </button>
                ))
            }
            <Link href={"/outrasPaginas/adicionar/addAluno"}>
                <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
            </Link>
        </>
    )
}
