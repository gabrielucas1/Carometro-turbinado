"use client"

import FBAutentication from "@/DAOs/FBAutentication"
import UsuarioDAO from "@/DAOs/UsuarioDAO"
import TipoUsuario from "@/model/Enums/TipoUsuario"
import Usuario from "@/model/Usuario"
import { useRouter } from "next/navigation"

export default function TipoUsuarioPage() {
    //ROUTER PARA NAVEGAR
    const router = useRouter()

    function btADM() {
        const usuario = new Usuario()
        usuario.tipoUsuario = TipoUsuario.ADMESCOLA
        usuario.idAuth = FBAutentication.usuarioAuthLogado.uid
        UsuarioDAO.inserir(usuario)
        router.push("/outrasPaginas/addEscola")
    }

    function btFuncionario() {
        const usuario = new Usuario()
        usuario.tipoUsuario = TipoUsuario.FUNCIONARIO
        UsuarioDAO.inserir(usuario)
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl mt-10">Qual o seu cargo?</h1>
            <div className="mt-20 flex gap-10">
                <button className="p-10 px-14 bg-blue-500 rounded" onClick={btADM}>Administrador</button>
                <button className="p-10 px-14 bg-blue-500 rounded" onClick={btFuncionario}>Funcionário</button>
            </div>
        </div>
    )
}