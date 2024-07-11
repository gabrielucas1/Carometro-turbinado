"use client"

import cursoDAO from "@/DAOs/CursoDAO"
import Curso from "@/model/Curso"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListaCursos() {
    const [listaCursos, setListaCursos] = useState<Curso[]>([])
    const router = useRouter()

    useEffect(() => {
        cursoDAO.getAll().then((cursos) => {
            setListaCursos(cursos)
        }).catch((e) => {
            console.log(e.message)
        })
    }, [])

    function navegarPerfil(idCurso: string) {
        router.push(`/outrasPaginas/perfil/perfilCurso?id=${idCurso}`)
    }

    return (
        <>
            <h1 className="text-2xl mt-4">Lista de Cursos</h1>

            {
                listaCursos.map((curso) => (
                    <button onClick={() => navegarPerfil(curso.id)} key={curso.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                        <p>{`Nome: ${curso.nome}`}</p>
                    </button>
                ))
            }
            <Link href={"/outrasPaginas/adicionar/addCurso"}>
                <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
            </Link>
        </>
    )
}