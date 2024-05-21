"use client"

import escolaDAO from "@/DAOs/EscolaDAO"
import Escola from "@/model/Escola"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"

export default function AddEscola() {
    //ROUTER PARA NAVEGAR
    const router = useRouter()

    //ESTADO PARA GUARDAR VALORES DOS INPUTS
    const [valorInput, setValorInput] = useState({
        nome: '',
        endereco: "",
        cidade: "",
        rede: "",
        tipoEnsino: "",
    })

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    function btAdicionar() {
        const escola = new Escola()
        escola.nome = valorInput.nome
        escola.endereco = valorInput.endereco
        escola.cidade = valorInput.cidade
        escola.rede = valorInput.rede
        escola.tipoEnsino = valorInput.tipoEnsino

        escolaDAO.inserir(escola)
    }

    return (
        <div className="flex flex-col items-center w-2/4">
            <h1 className="text-3xl mt-6">Menu Principal</h1>

            <label className="mt-20 self-start" htmlFor="nome">Nome</label>
            <input onChange={getInput} className="border-2 w-full rounded h-10" id="nome" type="text" />

            <div className="w-full flex flex-row gap-5">
                <div className="flex flex-col flex-1">
                    <label className="mt-10 self-start" htmlFor="endereco">Endereço</label>
                    <input onChange={getInput} className="border-2 w-full rounded h-10" id="endereco" type="text" />
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

            <button onClick={btAdicionar} type="submit" className="text-lg mt-20 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Adicionar</button>
        </div>
    )
}