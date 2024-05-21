import { PropsInput } from "@/components/Input"
import useForm from "./useForm"
import { useContext } from "react"
import { ErroInputContext } from "@/app/context/ErroInputContext"


export default function useInput() {
    //MENSAGENS DOS ERROS
    const mensagemErro = {
        nome: "O nome não pode ter mais de 100 caracteres!",
        email: "O E-mail deve conter menos 80 caracteres",
        senha: "A senha deve conter no mínimo 6 caracteres e menos de 20 caracteres",
        confirmarSenha: "A senha não confere"
    }

    //PROPRIEDADES DO INPUT NOME
    const propsNome: PropsInput = {
        id: "nome",
        autoComplete: "name",
        type: "text",
        placeholder: "Nome",
        mensagemErro: mensagemErro.nome
    }

    //PROPRIEDADES DO INPUT EMAIL
    const propsEmail: PropsInput = {
        id: "email",
        autoComplete: "email",
        type: "email",
        placeholder: "Email",
        mensagemErro: mensagemErro.email
    }

    //PROPRIEDADES DO INPUT SENHA
    const propsSenha: PropsInput = {
        id: "senha",
        autoComplete: "current-password",
        type: "password",
        placeholder: "Senha",
        mensagemErro: mensagemErro.senha
    }

    //PROPRIEDADES DO INPUT CONFIRMAR SENHA
    const propsConfirmarSenha: PropsInput = {
        id: "confirmarSenha",
        autoComplete: "current-password",
        type: "password",
        placeholder: "Confirme a senha",
        mensagemErro: mensagemErro.confirmarSenha
    }

    return {
        propsNome,
        propsEmail,
        propsSenha,
        propsConfirmarSenha
    }
}