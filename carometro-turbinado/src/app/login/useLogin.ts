import FBAutentication from "@/DAOs/FBAutentication"
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


    function submitLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        FBAutentication.login(email, senha).then((logado) => {
            if (logado) {
                router.push("/outrasPaginas/principal")
            }
        }).catch((erro) => {
            console.log("Não foi possível saber se o login foi bem sucedido!" + erro)
        })
    }

    return {
        submitLogin,
        email, handleEmail,
        senha, handleSenha
    }
}