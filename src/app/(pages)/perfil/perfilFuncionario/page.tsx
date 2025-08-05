"use client"

import usuarioDAO from "@/DAOs/UsuarioDAO"
import Usuario from "@/model/Usuario"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PerfilFuncionario() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const usuarioVazio: Usuario = new Usuario();
    const [usuario, setUsuario] = useState(usuarioVazio);

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300">
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-blue-100 animate-fade-in flex flex-col items-center">
                {/* Foto do funcionário */}
                <div className="w-28 h-28 rounded-full bg-blue-200 flex items-center justify-center mb-4 shadow-lg border-4 border-blue-300 overflow-hidden">
                    {usuario.fotoUrl ? (
                        <img
                            src={usuario.fotoUrl}
                            alt={"Foto do funcionário"}
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
    );
}