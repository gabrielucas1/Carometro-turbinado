"use client"

import LogarGoogle from "@/app/componentes/LogarGoogle";
import UsuarioDAO from "@/model/UsuarioDAO";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from "react";

export default function Cadastro(){
    const router = useRouter()
    const [valorInput, setValorInput] = useState({
        "name": "",
        "email": "",
        "password": "",
        "confirm": ""
    })

    const [erro, setErro] = useState({
        name: false,
        email: false,
        password: false,
        confirm: false,
      });
    
    const getInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));

        setErro((prevState) => ({
            ...prevState,
            [id]: validateInput(id, value),
        }));

        console.log(`Nome: ${erro.password}`);
    };

    function validateInput(id: string, value: string){
        switch (id) {
            case "name":
                return value.length > 100;
            case "email":
                return value.length >= 80;
            case "password":
                return value.length < 6 || value.length > 20;
            case "confirm":
                return value != valorInput.password;
            default:
                return false;
        }
    };

    async function submitForm(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        UsuarioDAO.cadastro(valorInput.email, valorInput.password).then((cadastrado) => {
            if(cadastrado == true){
                router.push("/bem-vindo")
            }
        }).catch((erro) => {
            console.log("Não foi possível saber se o cadastro foi bem sucedido!" + erro)
        })
    }

    return (
        <main className="flex flex-col w-screen h-screen justify-center items-center">
            <form onSubmit={submitForm} className="text-lg bg-white w-[420px] p-9 px-10 rounded-3xl flex flex-col justify-center items-center">
                <h1 className="text-3xl mb-16 font-semibold">Cadastre-se</h1>
                <input className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="name" type="text" placeholder="Nome" autoComplete="name"/>
                
                {erro.name
                    ? <p className="self-start text-red-600 text-sm">O nome não pode ter mais de 100 caracteres!</p>
                    : null
                }

                <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="email" type="email" placeholder="Email" autoComplete="email"/>

                {erro.email
                    ? <p className="self-start text-red-600 text-sm">O E-mail deve conter menos 80 caracteres</p> 
                    : null
                }

                <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} value={valorInput.password} id="password" type="password" placeholder="Senha" autoComplete="current-password"/>

                {erro.password
                    ? <p className="self-start text-red-600 text-sm">A senha deve conter no mínimo 6 caracteres e menos de 20 caracteres</p> 
                    : null
                }

                <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="confirm" type="password" placeholder="Confirmar senha" autoComplete="current-password"/>

                {erro.confirm
                    ? <p className="self-start text-red-600 text-sm">A senha não confere</p>
                    : null
                }

                <button type="submit" className="text-lg mt-10 bg-[#3579FF] py-2 px-10 text-white rounded-full">Cadastar</button>
                
                <LogarGoogle></LogarGoogle>

                <p className="mt-5 text-base">Já possui conta? <Link className="font-semibold" href="/">Clique aqui</Link></p>
            </form>
        </main>
    );
}