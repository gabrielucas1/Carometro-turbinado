"use client"

import EscolaCard from "@/components/EscolaCard";
import { UserContext } from "@/contexts/UserContext";
import EscolaDAO from "@/DAOs/EscolaDAO"
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Escola from "@/model/Escola"
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ListaEscola() {
    const router = useRouter()

    //PEGAR O ID DO FUNCIONARIO QUE VEIO DA TELA PERFIL FUNCIONARIO
    const searchParams = useSearchParams()
    const idFuncionario = searchParams.get("id")
    const [listEscolas, setListEscolas] = useState<Escola[]>([]);
    const { usuarioLogado, carregando } = useContext(UserContext);

    useEffect(() => {
        EscolaDAO.getAll().then((escolas) => {
            setListEscolas(escolas)
        })

        console.log(`aaaaa ${usuarioLogado.nome}`)
    }, [])

    function navegarPerfil(idEscola: string) {
        router.push(`/outrasPaginas/perfil/perfilEscola?id=${idEscola}`)
    }

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-6 text-2xl">Escolas</h1>

            {/*RENDERIZA A LISTA DE ESCOLAS*/}
            <div className="flex flex-col gap-4 py-6">
                {listEscolas.map((escola) => (
                   <EscolaCard escola={escola} idFuncionario={idFuncionario} />
                ))}
            </div>

            {/*NÃO TEM OPÇAO DE ADICIONAR QUANDO A TELA É APENAS PARA ESCOLHER UMA ESCOLA*/}
            {idFuncionario == null &&
                <Link href={"/outrasPaginas/adicionar/addEscola"}>
                    <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
                </Link>
            }


        </div>
    )
}