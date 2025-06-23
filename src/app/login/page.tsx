"use client";

import LogarGoogle from "@/components/LogarGoogle";
import { UserContext } from "@/contexts/UserContext";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import { auth } from "@/firebase/firebase";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import { CircularProgress } from "@nextui-org/progress";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useContext, useState } from "react";

export default function Login() {
  const router = useRouter();
  const { usuarioLogado, atualizarUsuarioLogado } = useContext(UserContext);
  const [logando, setLogando] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleSenha = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSenha(e.target.value);

  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogando(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const usuario = await usuarioDAO.getOne(userCredential.user.uid);

      atualizarUsuarioLogado(usuario);

      if (usuario) {
        console.log("Usuario logado com sucesso!", usuario.tipoUsuario);
        switch (usuario.tipoUsuario) {

          case TipoUsuario.ADMGERAL:
            console.log("PASSANDO!!!!!");
            router.push("listas/listaEscolas");
            break;
          case TipoUsuario.ADMESCOLA:
          case TipoUsuario.FUNCIONARIO:
            router.push("listas/listaFuncionarios");
            break;
            default:
            console.log("Tipo de usuário não reconhecido:", usuario.tipoUsuario);
        }
        
      } else {
        alert("Usuário não encontrado!");
      }
    } catch (e) {
       alert(`Erro no login! ${e}`);    }
  };

  return (
    <main className="flex flex-col w-screen h-screen justify-center items-center bg-[#5992FF]">
      <form
        onSubmit={submitLogin}
        className="text-lg bg-white w-[400px] p-9 py-14 rounded-3xl flex flex-col justify-center items-center"
      >
        <h1 className="text-3xl mb-20 font-semibold">LOGIN</h1>
        <input
          className="pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl"
          placeholder="Email"
          type="email"
          autoComplete="email"
          onChange={handleEmail}
          value={email}
        />
        <input
          className="mt-10 pb-1 w-full border-b-[3px] border-slate-300 placeholder:text-black placeholder:text-xl"
          type="password"
          placeholder="Senha"
          autoComplete="current-password"
          onChange={handleSenha}
          value={senha}
        />
        <p className="mt-2 text-base self-start font-medium">
          Esqueceu a senha?
        </p>
        <button
          type="submit"
          className="text-lg mt-10 bg-[#3579FF] py-2 px-12 text-white rounded-full hover:px-14 transition-all duration-200"
        >
          {logando ? (
            <CircularProgress size="sm" color="secondary" strokeWidth={4} />
          ) : (
            "Logar"
          )}
        </button>
        <LogarGoogle />
        <p className="mt-8 text-base">
          Não possui conta?{" "}
          <Link className="font-semibold" href="/cadastro">
            Clique aqui
          </Link>
        </p>
      </form>
    </main>
  );
}