"use client"

import usuarioDAO from "@/DAOs/UsuarioDAO"
import Usuario from "@/model/Usuario"
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import { UserContext } from "@/contexts/UserContext";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useContext } from "react"

export default function PerfilFuncionario() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const usuarioVazio: Usuario = new Usuario();
    const [usuario, setUsuario] = useState(usuarioVazio);
    const userContext = useContext(UserContext);

    const usuarioLogado = userContext.usuarioLogado

    useEffect(() => {
        if (id) {
            usuarioDAO.getOne(id)
                .then((usuarioRetornado) => {
                    setUsuario(usuarioRetornado);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }
    }, [id]);

    // Breadcrumbs dinâmico
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Equipe", href: "/listas/listaFuncionarios" },
        { label: usuario.nome || "Funcionário", isActive: true }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white w-full items-center">
            <div className="w-full max-w-3xl mt-8 mb-8 flex justify-center">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="flex w-full justify-center items-start mt-4">
                <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-blue-100 animate-fade-in flex flex-col items-center">
                    {/* Foto do funcionário */}
                    <div className="w-28 h-28 rounded-full bg-blue-200 flex items-center justify-center mb-4 shadow-lg border-4 border-blue-300 overflow-hidden">
                        {usuario.fotoUrl ? (
                            <Image
                                src={usuario.fotoUrl}
                                alt={"Foto do funcionário"}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-6xl text-blue-600">🧑‍💼</span>
                        )}
                    </div>
                    <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">Perfil do Funcionário</h1>
                    <div className="w-16 h-1 bg-blue-200 rounded-full mb-6" />
                    <div className="flex flex-col gap-6 w-full px-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700 w-24">Nome:</span>
                            <span className="text-lg text-blue-800 break-words">{usuario.nome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700 w-24">Celular:</span>
                            <span className="text-lg text-blue-800 break-words">{usuario.celular}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700 w-24">Cargo:</span>
                            <span className="text-lg text-blue-800 break-words">{usuario.tipoUsuario === "admEscola" ? "Administrador da Escola" : usuario.tipoUsuario === "funcionario" ? "Funcionário" : usuario.tipoUsuario}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}