"use client"

import RegistroVidaAluno from "@/model/RegistroVidaAluno";
import TipoRegistro from "@/model/Enums/TipoRegistro"; // Importe o enum TipoRegistro
import { ChangeEvent, useContext, useState } from "react";
import registroVidaAlunoDAO from "@/DAOs/RegistroVidaAlunoDAO";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

export default function AddRegistroVidaAluno() {
    const { usuarioLogado } = useContext(UserContext)

    // PEGANDO ID DO ALUNO QUE VEIO DA TELA LISTA ALUNOS
    const searchParams = useSearchParams()
    const idAluno = searchParams.get('id')

    // ESTADO PARA GUARDAR VALORES DOS INPUTS
    const [valorInput, setValorInput] = useState({
        tipoRegistro: "",
        descricao: ""
    });

    function getInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    async function submitForm(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault(); // Previne o comportamento padrão de envio do formulário

        const registroVidaAluno = new RegistroVidaAluno();

        // Mapeia o valor selecionado no comboBox para o enum correspondente
        switch (valorInput.tipoRegistro) {
            case TipoRegistro.MERITO:
                registroVidaAluno.tipoRegistro = TipoRegistro.MERITO;
                break;
            case TipoRegistro.AVISO:
                registroVidaAluno.tipoRegistro = TipoRegistro.AVISO;
                break;
            case TipoRegistro.DETALHE:
                registroVidaAluno.tipoRegistro = TipoRegistro.DETALHE;
                break;
            default:
                throw new Error("Tipo de registro inválido");
        }

        registroVidaAluno.descricao = valorInput.descricao;
        registroVidaAluno.idAluno = idAluno!;
        registroVidaAluno.nomeProfessor = usuarioLogado.nome
        await registroVidaAlunoDAO.inserir(registroVidaAluno)
    }

    return (
        <>
            <h1>Adicionar Registro Vida Alunos</h1>

            <form onSubmit={submitForm} className="flex flex-col space-y-4">
                <label htmlFor="tipoRegistro" className="text-lg font-medium">Tipo de Registro</label>
                <select
                    id="tipoRegistro"
                    className="border p-2 rounded-md"
                    value={valorInput.tipoRegistro}
                    onChange={getInput}
                >
                    <option value="" disabled>Selecione o tipo de registro</option>
                    <option value={TipoRegistro.MERITO}>Méritos</option>
                    <option value={TipoRegistro.AVISO}>Avisos</option>
                    <option value={TipoRegistro.DETALHE}>Detalhes</option>
                </select>

                <label htmlFor="descricao" className="text-lg font-medium">Descrição</label>
                <textarea
                    id="descricao"
                    className="border p-2 rounded-md"
                    value={valorInput.descricao}
                    onChange={getInput}
                    placeholder="Digite a descrição"
                    rows={4}
                />

                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                    Salvar Registro
                </button>
            </form>
        </>
    )
}
