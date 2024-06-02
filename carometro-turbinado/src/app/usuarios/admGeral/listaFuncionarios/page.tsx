"use client"

import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useState } from "react";

export default function ListaFuncionarios() {
    const [listUsuarios, setListUsuarios] = useState<Usuario[]>([]);

    usuarioDAO.getAll().then((usuario) => {
        setListUsuarios(usuario)
    })

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-4 text-2xl">Funcionarios</h1>
            {listUsuarios.map((usuario, index) => (
                <div key={index}>
                    <button onClick={() => { usuarioDAO.updateTipoUsuario(usuario.idAuth, TipoUsuario.ADMGERAL) }} className="bg-blue-400 w-96 h-20 mt-8 p-4 flex flex-col">
                        <p>{`Nome: ${usuario.nome}`}</p>
                        <p>{`Celular: ${usuario.celular}`}</p>
                    </button>
                </div>
            ))}

            {/*LEMBRETE: ADICIONAR FUNCIONALIDADE*/}
            <button className="absolute bottom-4 right-4 p-4 bg-blue-400">Adicionar</button>
        </div>
    )
}