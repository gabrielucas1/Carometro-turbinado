"use client"

import LogarGoogle from "@/components/LogarGoogle";
import useForm from "@/hooks/useForm";
import Link from "next/link";
import Input from "@/components/Input";
import useInput from "@/hooks/useInput";
import { ErroInputProvider } from "../context/ErroInputContext";

export default function Cadastro() {
    const { getInput, submitCadastro } = useForm()
    const { propsNome, propsEmail, propsSenha, propsConfirmarSenha } = useInput()

    return (
        <ErroInputProvider>
            <main className="flex flex-col w-screen h-screen justify-center items-center">
                <form onSubmit={submitCadastro} className="text-lg bg-white w-[420px] p-9 px-10 rounded-3xl flex flex-col justify-center items-center">
                    <h1 className="text-3xl mb-16 font-bold">Cadastre-se</h1>

                    <Input {...propsNome}></Input>

                    {/*
                    <input className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="name" type="text" placeholder="Nome" autoComplete="name" />

                    {erro.nome
                        ? <p className="self-start text-red-600 text-sm">O nome não pode ter mais de 100 caracteres!</p>
                        : null
                    }
                    */}


                    <Input {...propsEmail}></Input>

                    {/*<input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="email" type="email" placeholder="Email" autoComplete="email" />

                    {erro.email
                        ? <p className="self-start text-red-600 text-sm">O E-mail deve conter menos 80 caracteres</p>
                        : null
                    }
                */}

                    <Input {...propsSenha}></Input>

                    {/*
                    <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="password" type="password" placeholder="Senha" autoComplete="current-password" />

                    {erro.senha
                        ? <p className="self-start text-red-600 text-sm">A senha deve conter no mínimo 6 caracteres e menos de 20 caracteres</p>
                        : null
                    }
                */}

                    {/*
                    <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="confirm" type="password" placeholder="Confirmar senha" autoComplete="current-password" />

                    {erro.confirmarSenha
                        ? <p className="self-start text-red-600 text-sm">A senha não confere</p>
                        : null
                    }
                */}

                    <button type="submit" className="text-lg mt-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Cadastar</button>

                    <LogarGoogle></LogarGoogle>

                    <p className="mt-5 text-base">Já possui conta? <Link className="font-semibold" href="/login">Clique aqui</Link></p>
                </form>
            </main>
        </ErroInputProvider>
    );
}