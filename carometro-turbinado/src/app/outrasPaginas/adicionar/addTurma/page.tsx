"use client"

import cursoDAO from "@/DAOs/CursoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import Turma from "@/model/Turma";
import { ChangeEvent, FormEvent, useState } from "react";


export default function addCurso() {
    const [valorInput, setValorInput] = useState({
        nome: '',
        idCurso: ""
    })

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }


    async function adicionarCurso(e: FormEvent) {
        e.preventDefault()
        const turma = new Turma()
        turma.nome = valorInput.nome
        turma.curso = await cursoDAO.getOne(valorInput.idCurso)

        try {
            await turmaDAO.inserir(turma)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    return (
        <>
            <h1>Adicionar Turma</h1>

            <form onSubmit={adicionarCurso}>
                <label className="mt-10 self-start" htmlFor="nome">Nome</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="nome" type="text" />

                <label className="mt-10 self-start" htmlFor="nome">idCurso</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="idCurso" type="text" />


                <button type="submit" className="text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Adicionar</button>
            </form>
        </>
    )
}