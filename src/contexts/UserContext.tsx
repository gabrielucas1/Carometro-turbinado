"use client"

import usuarioDAO from '@/DAOs/UsuarioDAO';
import { auth } from '@/firebase/firebase';
import Usuario from '@/model/Usuario';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

interface userContext{
    usuarioLogado: Usuario,
    atualizarUsuarioLogado: (usuario: Usuario) => void,
    carregando: boolean
}

const UserContext = React.createContext<userContext>({
    usuarioLogado: new Usuario(),
    atualizarUsuarioLogado: () => { },
    carregando: true
});

function UserContextProvider({
    children,
}: {
    children: React.ReactNode
}){
    const [usuarioLogado, setUsuarioLogado] = useState<Usuario>(new Usuario())
    const [carregando, setCarregando] = useState<boolean>(true)

    function atualizarUsuarioLogado(usuario: Usuario) {
        console.log("Atualizando usuário logado:", usuario);
        setUsuarioLogado(usuario);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    console.log("Usuário autenticado, UID:", user.uid);
                    const usuarioLogadoAtualizado = await usuarioDAO.getOne(user.uid);
                    usuarioLogadoAtualizado.id = user.uid; // Garante que o ID do usuário logado seja atribuído
                    console.log("Dados do usuário retornados pelo DAO:", usuarioLogadoAtualizado);
                    atualizarUsuarioLogado(usuarioLogadoAtualizado);
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error);
                    atualizarUsuarioLogado(new Usuario());
                }
            } else {
                console.warn("Nenhum usuário autenticado.");
                atualizarUsuarioLogado(new Usuario());
            }

            setCarregando(false);
        });

        return () => unsubscribe(); // Limpar o ouvinte ao desmontar o componente
    }, []);

    return (
        <UserContext.Provider value={{ usuarioLogado, atualizarUsuarioLogado, carregando }}>
            {children}
        </UserContext.Provider>
    )

}

export { UserContext, UserContextProvider }
