"use client"

import FBAutentication from "@/DAOs/FBAutentication";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListaFuncionarios() {
    const router = useRouter()
    const [listUsuarios, setListUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        usuarioDAO.getAll().then((usuario) => {
            setListUsuarios(usuario)
        })
    }, [])

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-4 text-2xl">Funcionários</h1>
            {listUsuarios.map((usuario, index) => {
                console.log(`Nome: ${usuario.nome}`)
                console.log(`escola: ${usuario.escola.id}`)
                console.log(`EscolaLogado: ${FBAutentication.usuarioLogado.escola.id}`)

                return (
                    usuario.id != FBAutentication.usuarioLogado.id && usuario.tipoUsuario != TipoUsuario.ADMESCOLA && usuario.tipoUsuario != TipoUsuario.ADMGERAL && usuario.escola.id == FBAutentication.usuarioLogado.escola.id ? (
                        <div key={index}>
                            <button className="bg-blue-400 w-96 h-20 mt-8 p-4 flex flex-col">
                                <p>{`Nome: ${usuario.nome}`}</p>
                                <p>{`Celular: ${usuario.celular}`}</p>
                            </button>
                        </div>
                    ) : null)
            })}

            {/*LEMBRETE: ADICIONAR FUNCIONALIDADE*/}
            <button onClick={() => router.push("./addFuncionario")} className="absolute bottom-4 right-4 p-4 bg-blue-400">Adicionar</button>
        </div>
    )
}