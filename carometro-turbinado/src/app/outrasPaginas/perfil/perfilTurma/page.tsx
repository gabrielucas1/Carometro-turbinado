"use client"

import cursoDAO from "@/DAOs/CursoDAO"
import turmaDAO from "@/DAOs/TurmaDAO"
import Curso from "@/model/Curso"
import Turno from "@/model/Enums/Turno"
import Turma from "@/model/Turma"
import { useSearchParams } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"

export default function PerfilTurma() {
    const [turma, setTurma] = useState<Turma>(new Turma)
    const [nome, setNome] = useState("")

    //PEGANDO ID DA ESCOLA QUE VEIO DA TELA LISTA ALUNOS
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            turmaDAO.getOne(id).then((turmaBuscada) => {
                setTurma(turmaBuscada)

                setNome(turmaBuscada.nome)

            }).catch((e) => {
                console.log(e.message)
            })
        }

    }, [])

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        setNome(event.target.value)
    }

    async function salvar(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const turmaAtualizada = new Turma
            turmaAtualizada.nome = nome
            turmaAtualizada.curso = turma.curso
            turmaAtualizada.id = turma.id

            await turmaDAO.update(turmaAtualizada)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async function excluir() {
        try {
            await turmaDAO.deletar(turma.id)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    return (
        <>
            <button onClick={excluir} className="fixed right-6 top-6 text-lg mt-14 mb-10 bg-red-500 py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Excluir</button>
            <h1 className="mt-4 text-2xl">Perfil da turma</h1>

            <form onSubmit={salvar} className="flex flex-col items-center h-full">
                
                <label htmlFor="nome" className="mt-6 mb-1 self-start">Nome</label>
                <input onChange={getInput} id="nome" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={nome} />

                <button type="submit" className="fixed right-6 top-[81vh] text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Salvar</button>
            </form>
        </>
    )
}