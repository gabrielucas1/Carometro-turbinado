"use client"

import alunoDAO from "@/DAOs/AlunoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import Aluno from "@/model/Aluno";
import TurmaAluno from "@/model/TurmaAluno";
import { ChangeEvent, FormEvent, useState } from "react";
import Turma from "@/model/Turma";

export default function AddAluno() {
    const [valorInput, setValorInput] = useState({
        nome: '',
        dataNascimento: '',
        telefone: '',
        cep: '',
        rua: '',
        bairro: '',
        numeroEndereco: '',
        estado: '',
        cidade: '',
        complemento: '',
        idTurma: ''
    })

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    async function adicionarAluno(e: FormEvent) {
        e.preventDefault()
        const aluno = new Aluno()
        aluno.nome = valorInput.nome
        aluno.dataNascimento = valorInput.dataNascimento
        aluno.telefone = valorInput.telefone
        aluno.cep = valorInput.cep
        aluno.rua = valorInput.rua
        aluno.bairro = valorInput.bairro
        aluno.numeroEndereco = valorInput.numeroEndereco
        aluno.estado = valorInput.estado
        aluno.cidade = valorInput.cidade
        aluno.complemento = valorInput.complemento

        const turma: Turma = await turmaDAO.getOne(valorInput.idTurma)

        try {
            const idAluno = await alunoDAO.inserir(aluno)

            const turmaAluno = new TurmaAluno()
            turmaAluno.aluno = await alunoDAO.getOne(idAluno)
            turmaAluno.turma = turma

            console.log(`ALUNO ID: ${turmaAluno.aluno.id}`)
            console.log(`TURMA ID: ${turmaAluno.turma.id}`)

            await turmaAlunoDAO.inserir(turmaAluno)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    return (
        <>
            <h1>Adicionar Aluno</h1>

            <form onSubmit={adicionarAluno} className="flex flex-col px-96 w-full items-center">
                <label className="mt-6 self-start" htmlFor="nome">Nome</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="nome" type="text" />

                <label className="mt-4 self-start" htmlFor="dataNascimento">Data de Nascimento</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="dataNascimento" type="text" />

                <label className="mt-4 self-start" htmlFor="telefone">Telefone</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="telefone" type="text" />

                <label className="mt-4 self-start" htmlFor="cep">CEP</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="cep" type="text" />

                <label className="mt-4 self-start" htmlFor="rua">Rua</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="rua" type="text" />

                <label className="mt-4 self-start" htmlFor="bairro">Bairro</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="bairro" type="text" />

                <label className="mt-4 self-start" htmlFor="numeroEndereco">Número do Endereço</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="numeroEndereco" type="text" />

                <label className="mt-4 self-start" htmlFor="estado">Estado</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="estado" type="text" />

                <label className="mt-4 self-start" htmlFor="cidade">Cidade</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="cidade" type="text" />

                <label className="mt-4 self-start" htmlFor="complemento">Complemento</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="complemento" type="text" />

                <label className="mt-4 self-start" htmlFor="idTurma">ID da Turma</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="idTurma" type="text" />

                <button type="submit" className="w-40 text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:w-44 transition-all duration-200">Adicionar</button>
            </form>
        </>
    )
}
