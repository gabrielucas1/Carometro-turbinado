"use client"

import useForm from '@/hooks/useForm';
import LogarGoogle from '@/components/LogarGoogle';
import Link from 'next/link';

export default function Login() {
    const { getInput, submitLogin, erro } = useForm()
    return (
        <main className="flex flex-col w-screen h-screen justify-center items-center">
            <form onSubmit={submitLogin} className="text-lg bg-white w-[400px] p-9 py-14 rounded-3xl flex flex-col justify-center items-center">
                <h1 className="text-3xl mb-20 font-semibold">LOGIN</h1>
                <input className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" placeholder="Email" onChange={getInput} id="email" type="email" autoComplete="email" />

                {erro.email
                    ? <p className="self-start text-red-600 text-sm">O E-mail deve conter menos 80 caracteres</p>
                    : null
                }

                <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="password" type="password" placeholder="Senha" autoComplete="current-password" />
                {erro.senha
                    ? <p className="self-start text-red-600 text-sm">A senha deve conter no mínimo 6 caracteres e menos de 20 caracteres</p>
                    : null
                }
                <p className="mt-2 text-base self-start font-medium">Esqueceu a senha?</p>

                <button type="submit" className="text-lg mt-10 bg-[#3579FF] py-2 px-12 text-white rounded-full hover:px-14 transition-all duration-200">Logar</button>
                <LogarGoogle></LogarGoogle>
                <p className="mt-8 text-base">Não possui conta? <Link className="font-semibold" href="/cadastro">Clique aqui</Link></p>
            </form>
        </main>
    );
}