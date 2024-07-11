"use client"

import cursoDAO from "@/DAOs/CursoDAO"
import turmaDAO from "@/DAOs/TurmaDAO"
import Curso from "@/model/Curso"
import Turma from "@/model/Turma"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListaTurmas() {
    const [listaTurmas, setListaTurmas] = useState<Turma[]>([])
    const router = useRouter()

    useEffect(() => {
        turmaDAO.getAll().then((turmas) => {
            setListaTurmas(turmas)
            console.log(turmas)
        }).catch((e) => {
            console.log(e.message)
        })
    }, [])

    function navegarPerfil(idTurma: string) {
        router.push(`/outrasPaginas/perfil/perfilTurma?id=${idTurma}`)
    }

    return (
        <>
            <h1 className="text-2xl mt-4">Lista de Turmas</h1>

            {
                listaTurmas.map((turma) => (
                    <button onClick={() => navegarPerfil(turma.id)} key={turma.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                        <p>{`Nome: ${turma.nome}`}</p>
                    </button>
                ))
            }
            <Link href={"/outrasPaginas/adicionar/addTurma"}>
                <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
            </Link>
        </>
    )
}