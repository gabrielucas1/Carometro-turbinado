"use client";

import FuncionarioCard from "@/components/FuncionarioCard";
import { UserContext } from "@/contexts/UserContext";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function ListaFuncionarios() {
    const router = useRouter();
    const [listUsuarios, setListUsuarios] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState(true);

    const { usuarioLogado } = useContext(UserContext);

    useEffect(() => {
        setCarregando(true);
        usuarioDAO
            .getAll()
            .then((usuario) => {
                console.log("Usuários retornados:", usuario);
                setListUsuarios(usuario);
            })
            .catch((error) => {
                console.error("Erro ao buscar usuários:", error.message);
            })
            .finally(() => {
                setCarregando(false);
            });
    }, []);


    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="mt-6 text-2xl">Funcionários</h1>
            {carregando ? (
                <p>Carregando funcionários...</p>
            ) : (
                <div className="flex flex-col py-6 gap-4">
    {listUsuarios.map((usuario, index) => {
        console.log(`Usuario: ${usuario.nome}, Tipo: ${usuario.tipoUsuario}, Escola: ${usuario.escola?.id}`);
        console.log(`Usuario Logado: ${usuarioLogado.nome}, Tipo: ${usuarioLogado.tipoUsuario}, Escola: ${usuarioLogado.escola?.id}`);
        return (

     //FORMA QUE O DIOGO FEZ PARA EXIBIR OS FUNCIONÁRIOS       
    // usuario.id !== usuarioLogado.id &&
    // usuario.tipoUsuario === TipoUsuario.FUNCIONARIO &&
    // usuario.escola?.id === usuarioLogado.escola?.id ? (
    //     <FuncionarioCard funcionario={usuario} key={index} />
    // ) : null


    //MINHA FORMA QUE EU FIZ PARA EXIBIR OS FUNCIONÁRIOS
    usuario.id !== usuarioLogado.id &&
    usuario.tipoUsuario === TipoUsuario.FUNCIONARIO &&
    usuario.escola?.id === usuarioLogado.escola?.id ? (
            <FuncionarioCard
                funcionario={usuario}
                key={index}
                 />
    ) : null
        );  
    })}
</div>
                
            )}

            <button onClick={() => router.push("/adicionar/addFuncionario")} className="absolute bottom-4 right-4 p-4 bg-blue-400">
                Adicionar
            </button>
        </div>
    );
}