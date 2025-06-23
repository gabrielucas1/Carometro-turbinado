"use client"

import CursoCard from "@/components/CursoCard"
import cursoDAO from "@/DAOs/CursoDAO"
import Curso from "@/model/Curso"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListaCursos() {
    const [listaCursos, setListaCursos] = useState<Curso[]>([])

    useEffect(() => {
        cursoDAO.getAll().then((cursos) => {
                            console.log("Cursos recebidos do DAO:", cursos); // Log dos cursos recebidos

            setListaCursos(cursos)
        }).catch((e) => {
            console.log(e.message)
                            console.error("Erro ao buscar cursos:", e.message); // Log do erro

        })
    }, [])

    return (
        <>
            <h1 className="text-3xl mt-6">Cursos</h1>
                <div className="flex flex-col gap-4 py-6">
                    {
                        listaCursos.map((curso) => (
                            <CursoCard curso={curso} key={curso.id} />
                        ))  
                    }
                </div>
            
            <Link href={"/adicionar/addCurso"}>
                <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
            </Link>
        </>
    )
}