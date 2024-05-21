"use client"

import { ChangeEvent, FormEvent, useContext, useState } from "react"
import UsuarioFBDAO from "../DAOs/FBAutentication"
import { useRouter } from "next/navigation"
import { ErroInputContext } from "@/app/context/ErroInputContext"

interface ValorInputState {
    nome: string,
    email: string,
    senha: string,
    confirmarSenha: string
}

interface ErroState {
    nome: boolean,
    email: boolean,
    senha: boolean,
    confirmarSenha: boolean
}

export default function useForm() {
    //ROUTER PARA NAVEGAR ENTRE TELAS
    const router = useRouter()

    const { erro, setErro } = useContext(ErroInputContext)

    //ESTADO PARA GUARDAR VALORES DOS INPUTS
    const [valorInput, setValorInput] = useState<ValorInputState>({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: ""
    })

    function validateInput(id: string, value: string) {
        switch (id) {
            case "nome":
                return value.length > 100;
            case "email":
                return value.length >= 80;
            case "senha":
                return value.length < 6 || value.length > 20;
            case "confirmarSehha":
                return value != valorInput.senha;
            default:
                return false;
        }
    };

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }));

        setErro((prevState) => ({
            ...prevState,
            [id]: validateInput(id, value),
        }));
    };


    function submitLogin(e: FormEvent<HTMLFormElement>) {
        const { email, senha: password } = valorInput
        e.preventDefault()
        UsuarioFBDAO.login(email, password).then((logado) => {
            if (logado) {
                router.push("/outrasPaginas/tipoUsuario")
            }
        }).catch((erro) => {
            console.log("Não foi possível saber se o login foi bem sucedido!" + erro)
        })
    }

    async function submitCadastro(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        UsuarioFBDAO.cadastro(valorInput.email, valorInput.senha).then((cadastrado) => {
            if (cadastrado == true) {
                router.push("/outrasPaginas/tipoUsuario")
            }
        }).catch((erro) => {
            console.log("Não foi possível saber se o cadastro foi bem sucedido!" + erro)
        })
    }

    return {
        getInput,
        submitLogin,
        submitCadastro
    }
}

export type { ValorInputState, ErroState }