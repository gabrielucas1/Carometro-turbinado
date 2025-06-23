"use client"

import { UserContext } from "@/contexts/UserContext";
import cursoDAO from "@/DAOs/CursoDAO";
import escolaDAO from "@/DAOs/EscolaDAO";
import Curso from "@/model/Curso";
import Turno from "@/model/Enums/Turno";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useRouter } from "next/navigation";

interface ValorInput {
    nome: string
    turno: string[]
}

export default function AddCurso() {
    const { usuarioLogado } = useContext(UserContext);
    const router = useRouter();
    const [valorInput, setValorInput] = useState<ValorInput>({
        nome: '',
        turno: [],
    })

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }


    function getCheckBox(event: ChangeEvent<HTMLInputElement>) {
        const { value, checked } = event.target;

        var turnoSelecionado: string = "";

        switch (value) {
            case "Matutino": {
                turnoSelecionado = Turno.MATUTINO
                break;
            }
            case "Vespertino": {
                turnoSelecionado = Turno.VESPERTINO
                break
            }
            case "Noturno": {
                turnoSelecionado = Turno.NOTURNO
                break
            }
        }


        console.log(`TURNO: ${turnoSelecionado}`)
        // Verifica se o checkbox foi marcado ou desmarcado
        if (checked && !valorInput.turno.includes(turnoSelecionado)) {
            // Se foi marcado, adiciona o turno ao array
            setValorInput((prevState) => ({
                ...prevState,
                turno: [...prevState.turno, turnoSelecionado] // Adiciona o novo turno ao array
            }));
            console.log(valorInput.turno)
        } else {
            // Se foi desmarcado, remove o turno do array
            setValorInput((prevState) => ({
                ...prevState,
                turno: prevState.turno.filter(turno => turno !== turnoSelecionado) // Remove o turno do array
            }));
        }
    }

    async function adicionarCurso(e: FormEvent) {
        e.preventDefault();

        if (!usuarioLogado.escola || !usuarioLogado.escola.id) {
            alert("Escola não encontrada. Verifique se o usuário está associado a uma escola.");
            return;
        }

        const curso = new Curso();
        curso.nome = valorInput.nome;
        curso.turno = valorInput.turno;
        curso.escola = { id: usuarioLogado.escola.id }; // Atribui apenas o ID da escola

        try {
            console.log(`nome: ${curso.nome}`);
            console.log(`turno: ${curso.turno}`);
            console.log(`idEscola: ${curso.escola.id}`); // Log simplificado
            await cursoDAO.inserir(curso);
            alert("Curso adicionado com sucesso!");
            router.push("/listas/listaCursos"); // Redireciona para a lista de cursos após adicionar
        } catch (e: any) {
            console.error("Erro ao adicionar curso:", e.message);
        }
    }

    return (
        <>
            <h1>Adicionar Curso</h1>

            <form onSubmit={adicionarCurso}>
                <label className="mt-10 self-start" htmlFor="nome">Nome</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="nome" type="text" />


                <div className="flex flex-row items-center">
                    <input onChange={getCheckBox} className="border-2 rounded h-10" value="Matutino" type="checkbox" />
                    <label className="" htmlFor="nome">Matutino</label>
                </div>

                <div className="flex flex-row items-center">
                    <input onChange={getCheckBox} className="border-2 rounded h-10" value="Vespertino" type="checkbox" />
                    <label className="" htmlFor="nome">Vespertino</label>
                </div>

                <div className="flex flex-row items-center">
                    <input onChange={getCheckBox} className="border-2 rounded h-10" value="Noturno" type="checkbox" />
                    <label className="" htmlFor="nome">Noturno</label>
                </div>
                <button type="submit" className="text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Adicionar</button>
            </form>
        </>
    )
}