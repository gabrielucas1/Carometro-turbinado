"use client"

import LogarGoogle from '@/components/LogarGoogle';
import { UserContext } from '@/contexts/UserContext';
import usuarioDAO from '@/DAOs/UsuarioDAO';
import { auth } from '@/firebase/firebase';
import TipoUsuario from '@/model/Enums/TipoUsuario';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useContext, useState } from 'react';

export default function Login() {
    //ROUTER PARA NAVEGAR ENTRE TELAS
    const router = useRouter()

    const { usuarioLogado, atualizarUsuarioLogado } = useContext(UserContext)

    //ESTADOS PARA SALVAR OS INPUTS
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    //FUNÇÕES PARA SALVAR O VALOR DO INPUT
    function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)
    }

    function handleSenha(e: React.ChangeEvent<HTMLInputElement>) {
        setSenha(e.target.value)
    }

    async function submitLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha)

            atualizarUsuarioLogado(await usuarioDAO.getOne(userCredential.user.uid))

            if (usuarioLogado != null) {
                switch (usuarioLogado.tipoUsuario) {
                    case TipoUsuario.ADMGERAL: {
                        router.push("/outrasPaginas/listas/listaEscolas")
                        break
                    }
                    case TipoUsuario.ADMESCOLA: {
                        router.push("/outrasPaginas/listas/listaFuncionarios")
                        break;
                    }
                    case TipoUsuario.FUNCIONARIO: {
                        router.push("/outrasPaginas/listas/listaFuncionarios")
                        break;
                    }
                }
            } else {
                console.log("Usuário não encontrado!")
            }
        } catch (e) {
            console.log(`Erro no login! ${e}`)
        }
    }

    return (
        <main className="flex flex-col w-screen h-screen justify-center items-center">
            <form onSubmit={submitLogin} className="text-lg bg-white w-[400px] p-9 py-14 rounded-3xl flex flex-col justify-center items-center">
                <h1 className="text-3xl mb-20 font-semibold">LOGIN</h1>
                <input className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" placeholder="Email" type="email" autoComplete="email" onChange={handleEmail} value={email} />

                <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="password" placeholder="Senha" autoComplete="current-password" onChange={handleSenha} value={senha} />

                <p className="mt-2 text-base self-start font-medium">Esqueceu a senha?</p>

                <button type="submit" className="text-lg mt-10 bg-[#3579FF] py-2 px-12 text-white rounded-full hover:px-14 transition-all duration-200">Logar</button>
                <LogarGoogle></LogarGoogle>
                <p className="mt-8 text-base">Não possui conta? <Link className="font-semibold" href="/cadastro">Clique aqui</Link></p>
            </form>
        </main>
    );
}