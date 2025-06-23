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
        if (carregando) return; // Aguarde o carregamento do contexto do usuário

        console.log("Usuário logado:", usuarioLogado); // Log para verificar o usuário logado

        if (usuarioLogado.tipoUsuario === TipoUsuario.FUNCIONARIO || usuarioLogado.tipoUsuario === TipoUsuario.ADMESCOLA) {
            // Carregar apenas a escola associada ao usuário logado
            EscolaDAO.getOne(usuarioLogado.escola.id)
                .then((escola) => {
                    console.log("Escola carregada para o usuário logado:", escola); // Log para verificar a escola
                    setListEscolas([escola]); // Define a lista com apenas a escola associada
                })
                .catch((e) => {
                    console.error("Erro ao carregar a escola do usuário logado:", e.message);
                });
        } else {
            // Carregar todas as escolas para outros tipos de usuários
            EscolaDAO.getAll()
                .then((escolas) => {
                    console.log("Lista de escolas carregada:", escolas); // Log para verificar as escolas
                    setListEscolas(escolas);
                })
                .catch((e) => {
                    console.error("Erro ao carregar todas as escolas:", e.message);
                });
        }
    }, [usuarioLogado, carregando]);

    function navegarPerfil(idEscola: string) {
        router.push(`/outrasPaginas/perfil/perfilEscola?id=${idEscola}`)
    }

    if (!listEscolas || listEscolas.length === 0) {
        console.error("Nenhuma escola encontrada ou lista de escolas está vazia!");
        return <p>Nenhuma escola disponível.</p>;
    }

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-6 text-2xl">Escolas</h1>

            {/*RENDERIZA A LISTA DE ESCOLAS*/}
            <div className="flex flex-col gap-4 py-6">
                {listEscolas.map((escola) => {
                    console.log("Escola carregada para o card:", escola); // Log para verificar o objeto escola
                    return <EscolaCard key={escola.id} escola={escola} idFuncionario={idFuncionario} />;
                })}
            </div>

            {/*NÃO TEM OPÇAO DE ADICIONAR QUANDO A TELA É APENAS PARA ESCOLHER UMA ESCOLA*/}
            {idFuncionario == null &&
                <Link href={"/adicionar/addEscola"}>
                    <button className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">Adicionar</button>
                </Link>
            }


        </div>
    )
}