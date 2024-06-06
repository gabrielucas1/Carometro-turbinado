"use client"

import FBAutentication from "@/DAOs/FBAutentication";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddADMEscola() {
    const router = useRouter()
    const [listUsuarios, setListUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        usuarioDAO.getAll().then((usuario) => {
            setListUsuarios(usuario)
        })
    }, [])

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-4 text-2xl">Usuários</h1>
            {listUsuarios.map((usuario, index) => {
                console.log(`usuario: ${usuario.id}`)
                console.log(`IDLogado: ${FBAutentication.usuarioLogado.id}`)

                return (
                    usuario.id != FBAutentication.usuarioLogado.id && usuario.tipoUsuario != TipoUsuario.ADMGERAL ? (
                        <div key={index}>
                            <button onClick={() => { router.push(`./perfilFuncionario?id=${usuario.id}`) }} className="bg-blue-400 w-96 h-20 mt-8 p-4 flex flex-col">
                                <p>{`Nome: ${usuario.nome}`}</p>
                                <p>{`Celular: ${usuario.celular}`}</p>
                            </button>
                        </div>
                    ) : null)
            })}
        </div>
    )
}