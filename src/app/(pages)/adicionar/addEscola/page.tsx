"use client"

import escolaDAO from "@/DAOs/EscolaDAO"
import Escola from "@/model/Escola"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"

export default function AddEscola() {
    //ESTADO PARA GUARDAR VALORES DOS INPUTS
    const [valorInput, setValorInput] = useState({
        nome: '',
        cep: "",
        rua: "",
        bairro: "",
        numeroCasa: "",
        estado: "",
        cidade: "",
        complemento: "",
        telefone: "",
        rede: "",
        tipoEnsino: "",
    })

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;
        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    async function btAdicionar() {
        setIsLoading(true)
        
        try{
            const escola = new Escola()
            escola.nome = valorInput.nome
            escola.cep = valorInput.cep
            escola.rua = valorInput.rua
            escola.bairro = valorInput.bairro
            escola.numeroCasa = valorInput.numeroCasa
            escola.estado = valorInput.estado
            escola.cidade = valorInput.cidade
            escola.complemento = valorInput.complemento
            escola.telefone = valorInput.telefone
            escola.rede = valorInput.rede
            escola.tipoEnsino = valorInput.tipoEnsino

            await escolaDAO.inserir(escola)

            alert("Escola adicionada com sucesso!");
            router.push("/listas/listaEscolas")

        }
        catch (error) {
            console.error("Erro ao adicionar escola:", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white py-8">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-blue-100 animate-fade-in">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🏫</span>
                    Adicionar Escola
                </h1>
                <form className="flex flex-col gap-7" onSubmit={e => { e.preventDefault(); btAdicionar(); }}>
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700" htmlFor="nome">Nome da Escola</label>
                        <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" id="nome" type="text" required placeholder="Digite o nome da escola" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="cep">CEP</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="cep" type="text" placeholder="CEP" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="rua">Rua</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="rua" type="text" placeholder="Rua" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="bairro">Bairro</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="bairro" type="text" placeholder="Bairro" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="numeroCasa">Número</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="numeroCasa" type="text" placeholder="Número da casa" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="complemento">Complemento</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="complemento" type="text" placeholder="Complemento" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="telefone">Telefone</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="telefone" type="text" placeholder="Telefone" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="estado">Estado</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="estado" type="text" placeholder="Estado" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="cidade">Cidade</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="cidade" type="text" placeholder="Cidade" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="rede">Rede da escola</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="rede" type="text" placeholder="Rede" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="tipoEnsino">Tipo de ensino</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="tipoEnsino" type="text" placeholder="Tipo de Ensino" />
                        </div>
                    </div>
                    <button type="submit" className="text-lg mt-8 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200 self-end" disabled={isLoading}>
                        {isLoading ? "Carregando..." : "Adicionar"}
                    </button>
                </form>
            </div>
        </div>
    )
}