"use client"

import FuncionarioCard from "@/components/FuncionarioCard";
import CardAdm from "@/components/CardAdm";
import { UserContext } from "@/contexts/UserContext";
import FBAutentication from "@/DAOs/FBAutentication";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ListaADMEscola() {
    const router = useRouter()
    const [listUsuarios, setListUsuarios] = useState<Usuario[]>([]);

    const { usuarioLogado} = useContext(UserContext)

    useEffect(() => {
        usuarioDAO.getAll().then((usuario) => {
            setListUsuarios(usuario)
        })
    }, [])

    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-10 relative">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🏫</span>
                Administradores de Escola
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-8 max-w-7xl">
                {listUsuarios.filter(usuario => usuario.id !== usuarioLogado.id && usuario.tipoUsuario === TipoUsuario.ADMESCOLA).length === 0 ? (
                    <p className="text-lg text-gray-500 col-span-2">Nenhum administrador de escola encontrado.</p>
                ) : (
                    listUsuarios
                        .filter(usuario => usuario.id !== usuarioLogado.id && usuario.tipoUsuario === TipoUsuario.ADMESCOLA)
                        .map((usuario, index) => (
                            <CardAdm key={index} usuario={usuario} />
                        ))
                )}
            </div>
            <button
                onClick={() => router.push("/adicionar/addADMEscola")}
                className="fixed bottom-6 right-6 p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg text-2xl flex items-center gap-2 transition-all"
                title="Adicionar administrador"
            >
                <span>➕</span>
            </button>
        </div>
    )
}