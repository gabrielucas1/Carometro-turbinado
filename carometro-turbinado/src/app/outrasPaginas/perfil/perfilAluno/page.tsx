"use client"

import alunoDAO from "@/DAOs/AlunoDAO"
import Aluno from "@/model/Aluno"
import { useSearchParams } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"

interface ValorInput {
    nome: string
    cep: string
    rua: string
    bairro: string
    numeroEndereco: string
    estado: string
    cidade: string
    complemento: string
    telefone: string
    dataNascimento: string
}

export default function PerfilAluno() {
    const [aluno, setAluno] = useState<Aluno>(new Aluno)
    const [valorInput, setValorInput] = useState<ValorInput>({
        nome: "",
        cep: "",
        rua: "",
        bairro: "",
        numeroEndereco: "",
        estado: "",
        cidade: "",
        complemento: "",
        telefone: "",
        dataNascimento: "",
    })

    // PEGANDO ID DO ALUNO QUE VEIO DA TELA LISTA ALUNOS
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            alunoDAO.getOne(id).then((alunoBuscado) => {
                setAluno(alunoBuscado)
                setValorInput({
                    nome: alunoBuscado.nome,
                    cep: alunoBuscado.cep,
                    rua: alunoBuscado.rua,
                    bairro: alunoBuscado.bairro,
                    numeroEndereco: alunoBuscado.numeroEndereco,
                    estado: alunoBuscado.estado,
                    cidade: alunoBuscado.cidade,
                    complemento: alunoBuscado.complemento,
                    telefone: alunoBuscado.telefone,
                    dataNascimento: alunoBuscado.dataNascimento,
                })
            }).catch((e) => {
                console.log(e.message)
            })
        }
    }, [id])

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }))
    }

    async function salvar(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const alunoAtualizado = new Aluno()
            alunoAtualizado.id = aluno.id
            alunoAtualizado.nome = valorInput.nome
            alunoAtualizado.cep = valorInput.cep
            alunoAtualizado.rua = valorInput.rua
            alunoAtualizado.bairro = valorInput.bairro
            alunoAtualizado.numeroEndereco = valorInput.numeroEndereco
            alunoAtualizado.estado = valorInput.estado
            alunoAtualizado.cidade = valorInput.cidade
            alunoAtualizado.complemento = valorInput.complemento
            alunoAtualizado.telefone = valorInput.telefone
            alunoAtualizado.dataNascimento = valorInput.dataNascimento

            await alunoDAO.update(alunoAtualizado)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async function excluir() {
        try {
            await alunoDAO.deletar(aluno.id)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    return (
        <>
            <section className="w-full flex flex-col justify-center items-center">
                <button onClick={excluir} className="fixed right-6 top-6 text-lg mt-14 mb-10 bg-red-500 py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Excluir</button>
                <h1 className="mt-4 text-2xl">Perfil do Aluno</h1>

                <form onSubmit={salvar} className="flex flex-col items-center h-full w-full px-96">
                    <label htmlFor="nome" className="mt-6 mb-1 self-start">Nome</label>
                    <input onChange={getInput} id="nome" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.nome} />

                    <label htmlFor="cep" className="mt-6 mb-1 self-start">CEP</label>
                    <input onChange={getInput} id="cep" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.cep} />

                    <label htmlFor="rua" className="mt-6 mb-1 self-start">Rua</label>
                    <input onChange={getInput} id="rua" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.rua} />

                    <label htmlFor="bairro" className="mt-6 mb-1 self-start">Bairro</label>
                    <input onChange={getInput} id="bairro" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.bairro} />

                    <label htmlFor="numeroEndereco" className="mt-6 mb-1 self-start">Número</label>
                    <input onChange={getInput} id="numeroEndereco" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.numeroEndereco} />

                    <label htmlFor="estado" className="mt-6 mb-1 self-start">Estado</label>
                    <input onChange={getInput} id="estado" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.estado} />

                    <label htmlFor="cidade" className="mt-6 mb-1 self-start">Cidade</label>
                    <input onChange={getInput} id="cidade" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.cidade} />

                    <label htmlFor="complemento" className="mt-6 mb-1 self-start">Complemento</label>
                    <input onChange={getInput} id="complemento" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.complemento} />

                    <label htmlFor="telefone" className="mt-6 mb-1 self-start">Telefone</label>
                    <input onChange={getInput} id="telefone" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.telefone} />

                    <label htmlFor="dataNascimento" className="mt-6 mb-1 self-start">Data de Nascimento</label>
                    <input onChange={getInput} id="dataNascimento" className="border-gray-400 mb-6 p-1 border-2 rounded w-full h-9" value={valorInput.dataNascimento} />

                    <button type="submit" className="fixed right-6 top-[81vh] text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Salvar</button>
                </form>

            </section>

            <section className="border-t-2 border-black w-full ">
                <h2>Observações</h2>
            </section>
        </>
    )
}
