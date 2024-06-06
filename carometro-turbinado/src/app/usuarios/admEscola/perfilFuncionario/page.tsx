"use client"

import usuarioDAO from "@/DAOs/UsuarioDAO"
import Usuario from "@/model/Usuario"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PerfilFuncionario() {
    const router = useRouter()

    //PEGAR O ID DO FUNCIONARIO QUE VEIO DA TELA ANTERIOR
    const searchParams = useSearchParams()
    const id = searchParams.get("id")

    const usuarioVazio: Usuario = new Usuario()

    const [usuario, setUsuario] = useState(usuarioVazio)

    useEffect(() => {
        if (id) {
            usuarioDAO.getOne(id).then((usuarioRetornado) => {
                setUsuario(usuarioRetornado)
            }).catch((e) => {
                console.log(e.message)
            })
        }
    }, [id])

    return (
        <div>
            <h1>Perfil do Funcionário</h1>

            <p>{usuario.nome}</p>
            <p>{usuario.celular}</p>

            <button onClick={() => router.push(`./listaEscolas?id=${id}`)} className="fixed right-6 top-[81vh] text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Vincular</button>
        </div>
    )
}