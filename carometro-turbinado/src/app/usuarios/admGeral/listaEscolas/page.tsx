"use client"

import EscolaDAO from "@/DAOs/EscolaDAO"
import Escola from "@/model/Escola"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListaEscola() {
    const router = useRouter()
    const [listEscolas, setListEscolas] = useState<Escola[]>([]);

    EscolaDAO.getAll().then((escolas) => {
        setListEscolas(escolas)
    })

    function navegarPerfil(idEscola: string) {
        router.push(`./perfilEscola?id=${idEscola}`)
    }

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-4 text-2xl">Escolas</h1>

            {/*RENDERIZA A LISTA DE ESCOLAS*/}
            {listEscolas.map((escola) => (
                <div key={escola.id} onClick={() => navegarPerfil(escola.id)} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">

                    <p>{`Nome: ${escola.nome}`}</p>

                </div>
            ))}

            <Link href={"./addEscola"}>
                <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
            </Link>

        </div>
    )
}