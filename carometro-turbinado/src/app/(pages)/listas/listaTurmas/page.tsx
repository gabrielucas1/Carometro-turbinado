"use client"

import TurmaCard from "@/components/TurmaCard"
import cursoDAO from "@/DAOs/CursoDAO"
import turmaDAO from "@/DAOs/TurmaDAO"
import Curso from "@/model/Curso"
import Turma from "@/model/Turma"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListaTurmas() {
    const [listaTurmas, setListaTurmas] = useState<Turma[]>([])
    const router = useRouter()

    //PEGANDO ID DO CURSO QUE VEIO DA TELA LISTA DE CURSOS
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        
        turmaDAO.getByCursoId(id!).then((turmas) => {
            setListaTurmas(turmas)
            console.log(turmas)
        }).catch((e) => {
            console.log(e.message)
        })
    }, [id])

    function navegarPerfil(idTurma: string) {
        router.push(`/perfil/perfilTurma?id=${idTurma}`)
    }

    return (
        <>
            <h1 className="text-2xl mt-6">Lista de Turmas</h1>

            <div className="flex flex-col py-6 gap-4">
                {
                    listaTurmas.map((turma) => (
                        <TurmaCard turma={turma} key={turma.id} />
                    ))
                }
            </div>
            <Link href={"/adicionar/addTurma"}>
                <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
            </Link>
        </>
    )
}