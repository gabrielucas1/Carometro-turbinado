import { ErroState } from "@/hooks/useForm";
import { createContext, ReactNode, useState } from "react";

/*
    INTERFACE PARA DEFINIR O TIPO DO CONTEXTO E O QUE SERÁ ACESSÍVEL 
    PARA QUEM USAR ESSE CONTEXTO
*/
interface ErroInputContextType{
    erro: ErroState,
    setErro: React.Dispatch<React.SetStateAction<ErroState>>
}

//CRIAÇÃO DO CONTEXTO COM UM VALOR PADRAO
export const ErroInputContext = createContext<ErroInputContextType>({
    erro: {
        nome: false,
        email: false,
        senha: false,
        confirmarSenha: false,
    },
    setErro: (newState) => newState,
});

/*
    REACTNODE É O TIPO USADO PARA OS FILHOS QUANDO ALGO ENVOLVE HTML    
    QUE É O CASO AQUI, É COMO SE FOSSE UMA TAG ENVOLVENDO OUTRA, E AS 
    FILHAS DA TAG SÃO DO TIPO REACTNODE
*/
export const ErroInputProvider = ({ children }: { children: ReactNode }) => {
    //ESTADO PARA MOSTRAR ERROS DOS INPUTS
    const [erro, setErro] = useState<ErroState>({
        nome: false,
        email: false,
        senha: false,
        confirmarSenha: false,
    });

    return <ErroInputContext.Provider value={{erro, setErro}}>{ children }</ErroInputContext.Provider>
}