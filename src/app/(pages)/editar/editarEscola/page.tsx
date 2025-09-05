"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import escolaDAO from "@/DAOs/EscolaDAO";
import Escola from "@/model/Escola";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditarEscola() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [carregando, setCarregando] = useState(true);
    const [valorInput, setValorInput] = useState({
        nome: "",
        bairro: "",
        cep: "",
        cidade: "",
        complemento: "",
        estado: "",
        numeroCasa: "",
        rede: "",
        rua: "",
        telefone: "",
        tipoEnsino: ""
    });

    useEffect(() => {
        if (id) {
            escolaDAO.getOne(id)
                .then((escola: Escola) => {
                    setValorInput({
                        nome: escola.nome || "",
                        bairro: escola.bairro || "",
                        cep: escola.cep || "",
                        cidade: escola.cidade || "",
                        complemento: escola.complemento || "",
                        estado: escola.estado || "",
                        numeroCasa: escola.numeroCasa || "",
                        rede: escola.rede || "",
                        rua: escola.rua || "",
                        telefone: escola.telefone || "",
                        tipoEnsino: escola.tipoEnsino || ""
                    });
                })
                .catch((e) => {
                    console.error("Erro ao buscar escola:", e.message);
                    alert("Erro ao carregar dados da escola");
                })
                .finally(() => setCarregando(false));
        }
    }, [id]);

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;
        setValorInput((prevState) => ({ ...prevState, [id]: value }));
    }

    async function editarEscola(e: FormEvent) {
        e.preventDefault();
        setCarregando(true);
        if (!id) {
            alert("ID da escola não encontrado!");
            setCarregando(false);
            return;
        }
        try {
            const escola = new Escola();
            escola.id = id;
            escola.nome = valorInput.nome;
            escola.bairro = valorInput.bairro;
            escola.cep = valorInput.cep;
            escola.cidade = valorInput.cidade;
            escola.complemento = valorInput.complemento;
            escola.estado = valorInput.estado;
            escola.numeroCasa = valorInput.numeroCasa;
            escola.rede = valorInput.rede;
            escola.rua = valorInput.rua;
            escola.telefone = valorInput.telefone;
            escola.tipoEnsino = valorInput.tipoEnsino;
            await escolaDAO.update(id, escola);
            alert("Escola atualizada com sucesso!");
            router.back();
        } catch (e: any) {
            console.error("Erro ao atualizar escola:", e.message);
            alert("Erro ao atualizar escola!");
        } finally {
            setCarregando(false);
        }
    }

    if (carregando) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-blue-100 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🏫</span>
                    Editar Escola
                </h1>
                <form onSubmit={editarEscola} className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome da Escola</label>
                        <input
                            onChange={getInput}
                            id="nome"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.nome}
                            required
                            placeholder="Digite o nome da escola"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="bairro" className="block mb-2 text-gray-700">Bairro</label>
                            <input onChange={getInput} id="bairro" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.bairro} placeholder="Bairro" />
                        </div>
                        <div>
                            <label htmlFor="cep" className="block mb-2 text-gray-700">CEP</label>
                            <input onChange={getInput} id="cep" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.cep} placeholder="CEP" />
                        </div>
                        <div>
                            <label htmlFor="cidade" className="block mb-2 text-gray-700">Cidade</label>
                            <input onChange={getInput} id="cidade" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.cidade} placeholder="Cidade" />
                        </div>
                        <div>
                            <label htmlFor="complemento" className="block mb-2 text-gray-700">Complemento</label>
                            <input onChange={getInput} id="complemento" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.complemento} placeholder="Complemento" />
                        </div>
                        <div>
                            <label htmlFor="estado" className="block mb-2 text-gray-700">Estado</label>
                            <input onChange={getInput} id="estado" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.estado} placeholder="Estado" />
                        </div>
                        <div>
                            <label htmlFor="numeroCasa" className="block mb-2 text-gray-700">Número</label>
                            <input onChange={getInput} id="numeroCasa" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.numeroCasa} placeholder="Número da casa" />
                        </div>
                        <div>
                            <label htmlFor="rede" className="block mb-2 text-gray-700">Rede</label>
                            <input onChange={getInput} id="rede" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.rede} placeholder="Rede" />
                        </div>
                        <div>
                            <label htmlFor="rua" className="block mb-2 text-gray-700">Rua</label>
                            <input onChange={getInput} id="rua" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.rua} placeholder="Rua" />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block mb-2 text-gray-700">Telefone</label>
                            <input onChange={getInput} id="telefone" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.telefone} placeholder="Telefone" />
                        </div>
                        <div>
                            <label htmlFor="tipoEnsino" className="block mb-2 text-gray-700">Tipo de Ensino</label>
                            <input onChange={getInput} id="tipoEnsino" className="border border-blue-200 p-3 rounded-xl w-full" value={valorInput.tipoEnsino} placeholder="Tipo de Ensino" />
                        </div>
                    </div>
                    <div className="flex gap-4 justify-end mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-full font-semibold shadow transition-all"
                        >
                            <span className="mr-2">↩️</span> Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-semibold shadow transition-all"
                            disabled={carregando}
                        >
                            {carregando ? <span className="animate-pulse">Salvando...</span> : <span>💾 Salvar Alterações</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}