"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

export default function TelaInicial() {
    const { usuarioLogado, carregando } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (carregando) return;
        if (!usuarioLogado) {
            router.push("/login");
            return;
        }
        // Redireciona para a tela inicial correta conforme o tipo de usuário
        if (usuarioLogado.tipoUsuario === "admGeral") {
            router.push("/telaInicial/telaADMGeral");
        } else if (usuarioLogado.tipoUsuario === "admEscola") {
            router.push("/telaInicial/telaADMEscola");
        } else if (usuarioLogado.tipoUsuario === "funcionario") {
            router.push("/telaInicial/telaFuncionario");
        } else {
            router.push("/login");
        }
    }, [usuarioLogado, carregando, router]);

    return null;
}
