"use client"

import LogarGoogle from "@/components/LogarGoogle";
import Link from "next/link";
import { useState } from "react";
import useCadastro from "./useCadastro";

export default function Cadastro() {
    const [form, setForm] = useState(1)

    const cadastro = useCadastro()
    return (
        <main className="flex flex-col w-screen h-screen justify-center items-center bg-[#5992FF]">
            <form onSubmit={cadastro.submitCadastro} className="text-lg bg-white w-[420px] p-8 px-10 rounded-3xl flex flex-col justify-center items-center">
                <h1 className="text-3xl mb-5 font-bold">Cadastre-se</h1>

                {form === 1 && (
                    <>
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Nome" autoComplete="name" onChange={cadastro.handleNome} value={cadastro.nome} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Email" autoComplete="email" onChange={cadastro.handleEmail} value={cadastro.email} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="password" placeholder="Senha" autoComplete="current-password" onChange={cadastro.handleSenha} value={cadastro.senha} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="password" placeholder="Confirmar a senha" autoComplete="current-password" onChange={cadastro.handleConfirmarSenha} value={cadastro.confirmarSenha} />

                        <button onClick={() => { setForm(2) }} className="text-lg mt-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Próximo</button>
                    </>
                )}

                {form === 2 && (
                    <>
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="date" placeholder="Data Nascimento" onChange={cadastro.handleDataNascimento} value={cadastro.dataNascimento} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Celular" onChange={cadastro.handleCelular} value={cadastro.celular} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Estado" onChange={cadastro.handleEstado} value={cadastro.estado} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Cidade" onChange={cadastro.handleCidade} value={cadastro.cidade} />
                        <button onClick={() => { setForm(3) }} className="text-lg mt-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Próximo</button>
                    </>
                )}


                {form === 3 && (
                    <>
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="CEP" onChange={cadastro.handleCEP} value={cadastro.cep} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Rua" onChange={cadastro.handleRua} value={cadastro.rua} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Bairro" onChange={cadastro.handleBairro} value={cadastro.bairro} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Numero da casa" onChange={cadastro.handleNumeroCasa} value={cadastro.numeroCasa} />
                        <input className="pb-1 mt-6 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="text" placeholder="Complemento" onChange={cadastro.handleComplemento} value={cadastro.complemento} />
                        <button type="submit" className="text-lg mt-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Cadastar</button>
                    </>
                )}

                <LogarGoogle></LogarGoogle>

                <p className="mt-5 text-base">Já possui conta? <Link className="font-semibold" href="/login">Clique aqui</Link></p>
            </form>
        </main>
    );
}