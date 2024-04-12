"use client"

import UsuarioDAO from "@/model/UsuarioDAO";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from "react";
import LogarGoogle from "./componentes/LogarGoogle";

export default function Home() {
  const router = useRouter()
  const [valorInput, setValorInput] = useState({
    "email": "",
    "password": ""
  })

  const [erroEmail, setErroEmail] = useState(false)
  const [erroSenha, setErroSenha] = useState(false)

  function getInput(event: ChangeEvent<HTMLInputElement>){
    const {id, value} = event.target
    setValorInput(prevState => ({
      ...prevState,
      [id]: value
    }))

    switch(id){
      case "email": {
        if(value.length >= 80){
          setErroEmail(true)
        }else{
          setErroEmail(false)
        }
        break;
      }

      case "password": {
        if(value.length < 6 || value.length >= 20){
          setErroSenha(true)
        }else{
          setErroSenha(false)
        }
        break
      }
    }
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>){
    const {email, password} = valorInput
    e.preventDefault()
    UsuarioDAO.login(email, password).then((logado) => {
      if(logado){
        router.push("/bem-vindo")
      }
    }).catch((erro) => {
      console.log("Não foi possível saber se o login foi bem sucedido!" + erro)
    })
  }

  return (
    <main className="flex flex-col w-screen h-screen justify-center items-center">
      <form onSubmit={submitForm} className="text-lg bg-white w-[400px] p-9 py-14 rounded-3xl flex flex-col justify-center items-center">
        <h1 className="text-3xl mb-20 font-semibold">LOGIN</h1>
        <input className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" placeholder="Email" onChange={getInput} id="email" type="email" autoComplete="email"/>

        {erroEmail
          ? <p className="self-start text-red-600 text-sm">O E-mail deve conter menos 80 caracteres</p> 
          : null
        }

        <input className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl" onChange={getInput} id="password" type="password" placeholder="Senha" autoComplete="current-password"/>
        {erroSenha
          ? <p className="self-start text-red-600 text-sm">A senha deve conter no mínimo 6 caracteres e menos de 20 caracteres</p> 
          : null
        }
        <p className="mt-2 text-base self-start font-medium">Esqueceu a senha?</p>

        <button type="submit" className="text-lg mt-10 bg-[#3579FF] py-2 px-12 text-white rounded-full">Logar</button>
        <LogarGoogle></LogarGoogle>
        <p className="mt-8 text-base">Não possui conta? <Link className="font-semibold" href="/cadastro">Clique aqui</Link></p>
      </form>
    </main>
  );
}