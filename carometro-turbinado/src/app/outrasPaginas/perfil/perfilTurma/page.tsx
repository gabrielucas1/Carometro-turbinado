"use client"

import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO"
import turmaDAO from "@/DAOs/TurmaDAO"
import Aluno from "@/model/Aluno"
import Turma from "@/model/Turma"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"

export default function PerfilTurma() {
    const [turma, setTurma] = useState<Turma>(new Turma)
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const router = useRouter()
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

            turmaAlunoDAO.getAlunos(id).then((alunos) => {
                setAlunos(alunos)
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

    function navegarPerfil(idAluno: string) {
        router.push(`/outrasPaginas/perfil/perfilAluno?id=${idAluno}`)
    }

    function navegarListaAlunos() {
        router.push(`/outrasPaginas/listas/listaAlunos?id=${id}`)
    }

    return (
        <>
            <button onClick={excluir} className="fixed right-6 top-6 text-lg mt-14 mb-10 bg-red-500 py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Excluir</button>
            <h1 className="mt-4 text-2xl">Perfil da turma</h1>

            <form onSubmit={salvar} className="flex flex-col items-center">
                
                <label htmlFor="nome" className="mt-6 mb-1 self-start">Nome</label>
                <input onChange={getInput} id="nome" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={nome} />

                <button type="submit" className="fixed right-6 top-24 text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Salvar</button>
            </form>

            <div className="border-t-2 border-black mt-10 w-full flex items-center flex-col">
                <button onClick={navegarListaAlunos} className="absolute right-2 mt-4 text-lg bg-[#3579FF] py-2 px-4 text-white rounded-full hover:px-6 transition-all duration-200">Adicionar aluno</button>
                <h2 className="text-2xl mt-4 ">Lista de Alunos</h2>

                {alunos.length > 0 && (
                    alunos.map((aluno) => (
                        <button onClick={() => navegarPerfil(aluno.id)} key={aluno.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                            <p>{`Nome: ${aluno.nome}`}</p>
                            <p>{`Data de Nascimento: ${aluno.dataNascimento}`}</p>
                        </button>
                    ))
                )}
            </div>
        </>
    )
}