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
        <div className="flex flex-col items-center px-96 w-full h-full overflow-y-auto">
            <h1 className="text-xl mt-6">Adicionar escola</h1>

            <label className="mt-10 self-start" htmlFor="nome">Nome</label>
            <input onChange={getInput} className="border-2 w-full rounded h-10" id="nome" type="text" />

            <div className="w-full flex flex-row gap-5">
                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="cep">CEP</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="cep" type="text" />
                </div>

                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="rua">Rua</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="rua" type="text" />
                </div>
            </div>

            <div className="w-full flex flex-row gap-5">
                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="bairro">Bairro</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="bairro" type="text" />
                </div>

                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="numeroCasa">Numero da casa</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="numeroCasa" type="text" />
                </div>
            </div>

            <div className="w-full flex flex-row gap-5">
                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="complemento">Complemento</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="complemento" type="text" />
                </div>

                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="telefone">Telefone</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="telefone" type="text" />
                </div>
            </div>

            <div className="w-full flex flex-row gap-5">
                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="estado">Estado</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="estado" type="text" />
                </div>

                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="cidade">Cidade</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="cidade" type="text" />
                </div>
            </div>

            <div className="w-full flex flex-row gap-5">
                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="rede">Rede da escola</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="rede" type="text" />
                </div>

                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="tipoEnsino">Tipo de ensino</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="tipoEnsino" type="text" />
                </div>
            </div>

            <button onClick={btAdicionar} type="submit" className="text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200" disabled={isLoading}>  {isLoading ? "Carregando..." : "Adicionar"}</button>
        </div>
    )
}