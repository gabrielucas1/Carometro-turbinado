"use client"

import FuncionarioCard from "@/components/FuncionarioCard";
import { UserContext } from "@/contexts/UserContext";
import FBAutentication from "@/DAOs/FBAutentication";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ListaFuncionarios() {
    const router = useRouter()
    const [listUsuarios, setListUsuarios] = useState<Usuario[]>([]);

    const { usuarioLogado } = useContext(UserContext)

    useEffect(() => {
        usuarioDAO.getAll().then((usuario) => {
            setListUsuarios(usuario)
        })
    }, [])

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-6 text-2xl">Funcionários</h1>
            <div className="flex flex-col py-6 gap-4">
                {listUsuarios.map((usuario, index) => {
                    return (
                        usuario.id != usuarioLogado.id && usuario.tipoUsuario != TipoUsuario.ADMESCOLA && usuario.tipoUsuario != TipoUsuario.ADMGERAL && usuario.escola.id == usuarioLogado.escola.id ? (
                            <FuncionarioCard funcionario={usuario} key={index} />
                        ) : null)
                })}
            </div>

            {/*LEMBRETE: ADICIONAR FUNCIONALIDADE*/}
            <button onClick={() => router.push("/adicionar/addFuncionario")} className="absolute bottom-4 right-4 p-4 bg-blue-400">Adicionar</button>
        </div>
    )
}