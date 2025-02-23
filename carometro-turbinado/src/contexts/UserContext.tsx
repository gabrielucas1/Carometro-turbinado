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
        setUsuarioLogado(usuario)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const usuarioLogadoAtualizado = await usuarioDAO.getOne(user.uid);
                setCarregando(false)
                atualizarUsuarioLogado(usuarioLogadoAtualizado);
            } else {
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
