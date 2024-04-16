"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import UsuarioDAO from "../UsuarioDAO"
import { useRouter } from "next/navigation"

interface ValorInputState{
    name: string,
    email: string,
    password: string,
    confirm: string
}

interface ErroState{
    name: boolean,
    email: boolean,
    password: boolean,
    confirm: boolean
}

export default function useForm(){
    //ROUTER PARA NAVEGAR
    const router = useRouter()

    //ESTADO PARA GUARDAR VALORES DOS INPUTS
    const [valorInput, setValorInput] = useState<ValorInputState>({
        name: '',
        email: "",
        password: "",
        confirm: ""
    })
    
    //ESTADO PARA MOSTRAR ERROS
    const [erro, setErro] = useState<ErroState>({
        name: false,
        email: false,
        password: false,
        confirm: false,
    });

    function getInput (event: ChangeEvent<HTMLInputElement>) {
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

    function submitLogin(e: FormEvent<HTMLFormElement>){
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

    async function submitCadastro(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        UsuarioDAO.cadastro(valorInput.email, valorInput.password).then((cadastrado) => {
            if(cadastrado == true){
                router.push("/bem-vindo")
            }
        }).catch((erro) => {
            console.log("Não foi possível saber se o cadastro foi bem sucedido!" + erro)
        })
    }
    
    return {
        getInput, 
        erro,
        submitLogin, 
        submitCadastro
    }
}