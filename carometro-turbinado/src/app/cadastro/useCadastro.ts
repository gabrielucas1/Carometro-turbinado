"use client"

import FBAutentication from "@/DAOs/FBAutentication"
import usuarioDAO from "@/DAOs/UsuarioDAO"
import TipoUsuario from "@/model/Enums/TipoUsuario"
import Usuario from "@/model/Usuario"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function useCadastro() {
    //ROUTER PARA NAVEGAR ENTRE TELAS
    const router = useRouter()

    //ESTADOS PARA GUARDAR VALORES DOS INPUTS
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")

    const [dataNascimento, setDataNascimento] = useState("")
    const [celular, setCelular] = useState("")
    const [estado, setEstado] = useState("")
    const [cidade, setCidade] = useState("")

    const [cep, setCep] = useState("")
    const [rua, setRua] = useState("")
    const [bairro, setBairro] = useState("")
    const [numeroCasa, setNumeroCasa] = useState("")
    const [complemento, setComplemento] = useState("")

    //FUNÇÕES PARA SALVAR O VALOR DO INPUT
    function handleNome(e: React.ChangeEvent<HTMLInputElement>) {
        setNome(e.target.value)
    }

    function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)
    }

    function handleSenha(e: React.ChangeEvent<HTMLInputElement>) {
        setSenha(e.target.value)
    }

    function handleConfirmarSenha(e: React.ChangeEvent<HTMLInputElement>) {
        setConfirmarSenha(e.target.value)
    }

    function handleDataNascimento(e: React.ChangeEvent<HTMLInputElement>) {
        setDataNascimento(e.target.value)
    }

    function handleCelular(e: React.ChangeEvent<HTMLInputElement>) {
        setCelular(e.target.value)
    }

    function handleEstado(e: React.ChangeEvent<HTMLInputElement>) {
        setEstado(e.target.value)
    }

    function handleCidade(e: React.ChangeEvent<HTMLInputElement>) {
        setCidade(e.target.value)
    }

    function handleCEP(e: React.ChangeEvent<HTMLInputElement>) {
        setCep(e.target.value)
    }

    function handleRua(e: React.ChangeEvent<HTMLInputElement>) {
        setRua(e.target.value)
    }

    function handleBairro(e: React.ChangeEvent<HTMLInputElement>) {
        setBairro(e.target.value)
    }

    function handleNumeroCasa(e: React.ChangeEvent<HTMLInputElement>) {
        setNumeroCasa(e.target.value)
    }

    function handleComplemento(e: React.ChangeEvent<HTMLInputElement>) {
        setComplemento(e.target.value)
    }

    async function submitCadastro(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            await FBAutentication.cadastro(email, senha)
            const usuario: Usuario = {
                id: "",
                idAuth: FBAutentication.usuarioAuthLogado.uid,
                tipoUsuario: TipoUsuario.ADMGERAL,
                nome: nome,
                CEP: cep,
                rua: rua,
                bairro: bairro,
                complemento: complemento,
                numeroCasa: numeroCasa,
                estado: estado,
                cidade: cidade,
                dataNascimento: dataNascimento,
                celular: celular,
            }

            try {
                await usuarioDAO.inserir(usuario)

                switch (usuario.tipoUsuario) {
                    case TipoUsuario.ADMGERAL: {
                        router.push("/usuarios/admGeral/listaEscolas")
                        break
                    }
                    case TipoUsuario.ADMESCOLA: {
                        router.push("/usuarios/admEscola")
                    }
                    case TipoUsuario.FUNCIONARIO: {
                        router.push("/usuarios/funcionario")
                    }
                }
            } catch (erro: any) {
                console.log(erro.message + erro)
            }

        } catch (erro: any) {
            console.log(erro.message + erro)
        }
    }

    return {
        submitCadastro,
        nome, handleNome,
        email, handleEmail,
        senha, handleSenha,
        confirmarSenha, handleConfirmarSenha,
        dataNascimento, handleDataNascimento,
        celular, handleCelular,
        estado, handleEstado,
        cidade, handleCidade,
        cep, handleCEP,
        rua, handleRua,
        bairro, handleBairro,
        numeroCasa, handleNumeroCasa,
        complemento, handleComplemento
    }
}
