"use client"

import cursoDAO from "@/DAOs/CursoDAO"
import Curso from "@/model/Curso"
import { useEffect, useState } from "react"

export default function listaCursos() {
    const [listaCursos, setListaCursos] = useState<Curso[]>([])

    useEffect(() => {
        cursoDAO.getAll().then((cursos) => {
            setListaCursos(cursos)
            console.log(`CURSOS ${cursos[0].nome}`)
        }).catch((e) => {
            console.log(e.message)
        })
    }, [])

    return (
        <>
            <h1 className="text-2xl mt-4">Lista de Cursos</h1>

            {
                listaCursos.map((curso) => (
                    <div key={curso.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                        <p>{`Nome: ${curso.nome}`}</p>
                    </div>
                ))
            }
        </>
    )
}