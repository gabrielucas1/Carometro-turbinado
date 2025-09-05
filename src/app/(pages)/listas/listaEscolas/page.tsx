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
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs"

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

    // Definir breadcrumbs
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Escolas", isActive: true }
    ];

    return (
        <div className="flex flex-col items-center min-h-screen w-full px-4 py-10 bg-white">
            <div className="w-full max-w-3xl mx-auto">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-3xl font-extrabold text-blue-700 mb-10 text-center tracking-tight">Escolas</h1>
                {/*RENDERIZA A LISTA DE ESCOLAS*/}
                <div className="flex flex-col gap-4 py-6 items-center">
                    {listEscolas.map((escola) => {
                        return <EscolaCard key={escola.id} escola={escola} idFuncionario={idFuncionario} />;
                    })}
                </div>
                {/* Somente ADMGERAL pode adicionar escola */}
                {idFuncionario == null &&
                    usuarioLogado?.tipoUsuario === "admGeral" && (
                        <Link href={"/adicionar/addEscola"}>
                            <button className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 border-2 border-blue-200">Adicionar Escola</button>
                        </Link>
                    )
                }
            </div>
        </div>
    )
}