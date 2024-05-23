"use client"

import LogarGoogle from '@/components/LogarGoogle';
import Link from 'next/link';
import useLogin from './useLogin';

export default function Login() {
    const login = useLogin()
    return (
        <main className="flex flex-col w-screen h-screen justify-center items-center">
            <form onSubmit={login.submitLogin} className="text-lg bg-white w-[400px] p-9 py-14 rounded-3xl flex flex-col justify-center items-center">
                <h1 className="text-3xl mb-20 font-semibold">LOGIN</h1>
                <input className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" placeholder="Email" type="email" autoComplete="email" onChange={login.handleEmail} value={login.email} />

                <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" type="password" placeholder="Senha" autoComplete="current-password" onChange={login.handleSenha} value={login.senha} />

                <p className="mt-2 text-base self-start font-medium">Esqueceu a senha?</p>

                <button type="submit" className="text-lg mt-10 bg-[#3579FF] py-2 px-12 text-white rounded-full hover:px-14 transition-all duration-200">Logar</button>
                <LogarGoogle></LogarGoogle>
                <p className="mt-8 text-base">Não possui conta? <Link className="font-semibold" href="/cadastro">Clique aqui</Link></p>
            </form>
        </main>
    );
}