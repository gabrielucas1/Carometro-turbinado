"use client"

import { useRouter } from "next/navigation";
import Router from "next/router";

export default function MenuPrincipal() {
    const router = useRouter()
    return (
        <div className="w-screen flex flex-col items-center">
            <h1 className="text-3xl mt-6">Menu Principal</h1>
            <div className="mt-32 w-4/5 flex gap-6 justify-center">
                <button onClick={() => router.push("/outrasPaginas/addEscola")} className="flex-1 py-10 bg-slate-300">Escolas</button>
                <button className="flex-1 py-10 bg-slate-300">Funcionarios</button>
            </div>
            <div className="mt-32 w-4/5 flex gap-6 justify-center">
                <button className="flex-1 py-10 bg-slate-300">Ofertas</button>
                <button className="flex-1 py-10 bg-slate-300">Alunos</button>
            </div>
        </div>
    )
}