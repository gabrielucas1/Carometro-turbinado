"use client"

import RegistroVidaAluno from "@/model/RegistroVidaAluno";
import TipoRegistro from "@/model/Enums/TipoRegistro"; // Importe o enum TipoRegistro
import { ChangeEvent, useContext, useState } from "react";
import registroVidaAlunoDAO from "@/DAOs/RegistroVidaAlunoDAO";
import { useSearchParams, useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

export default function AddRegistroVidaAluno() {
    const { usuarioLogado } = useContext(UserContext)
    const router = useRouter();

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
        router.push(`/perfil/perfilAluno?id=${idAluno}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center justify-center py-10">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-blue-100 animate-fade-in flex flex-col items-center">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">📝</span>
                    Adicionar Registro Vida do Aluno
                </h1>
                <form onSubmit={submitForm} className="flex flex-col gap-7 w-full">
                    <div>
                        <label htmlFor="tipoRegistro" className="block mb-2 text-lg font-semibold text-gray-700">Tipo de Registro</label>
                        <select
                            id="tipoRegistro"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.tipoRegistro}
                            onChange={getInput}
                            required
                        >
                            <option value="" disabled>Selecione o tipo de registro</option>
                            <option value={TipoRegistro.MERITO}>Méritos</option>
                            <option value={TipoRegistro.AVISO}>Avisos</option>
                            <option value={TipoRegistro.DETALHE}>Detalhes</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="descricao" className="block mb-2 text-lg font-semibold text-gray-700">Descrição</label>
                        <textarea
                            id="descricao"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.descricao}
                            onChange={getInput}
                            placeholder="Digite a descrição"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="flex gap-4 justify-end mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-full font-semibold shadow transition-all flex items-center gap-2"
                        >
                            <span className="mr-2">↩️</span> Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-semibold shadow transition-all flex items-center gap-2"
                        >
                            <span>💾</span> Salvar Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
