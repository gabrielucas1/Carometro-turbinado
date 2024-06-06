import FBAutentication from "@/DAOs/FBAutentication"
import usuarioDAO from "@/DAOs/UsuarioDAO"
import TipoUsuario from "@/model/Enums/TipoUsuario"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function useLogin() {
    //ROUTER PARA NAVEGAR ENTRE TELAS
    const router = useRouter()

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
        await FBAutentication.login(email, senha)

        try {
            if (FBAutentication.usuarioLogado != null) {
                switch (FBAutentication.usuarioLogado.tipoUsuario) {
                    case TipoUsuario.ADMGERAL: {
                        router.push("/usuarios/admGeral/listaEscolas")
                        break
                    }
                    case TipoUsuario.ADMESCOLA: {
                        router.push("/usuarios/admEscola/listaFuncionarios")
                        break;
                    }
                    case TipoUsuario.FUNCIONARIO: {
                        router.push("/usuarios/admGeral/listaFuncionarios")
                        break;
                    }
                }
            } else {
                console.log("Usuário não encontrado")
            }
        } catch (erro: any) {
            console.log(erro.message + erro)
        }

    }

    return {
        submitLogin,
        email, handleEmail,
        senha, handleSenha
    }
}