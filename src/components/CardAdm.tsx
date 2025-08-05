import React from "react";
import Usuario from "@/model/Usuario";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import { useRouter } from "next/navigation";

export default function CardAdm({ usuario, onDelete }: { usuario: Usuario; onDelete?: () => void }) {
    const router = useRouter();

    function navegarPerfil(idAdm: string) {
        router.push(`/perfil/perfilFuncionario?id=${idAdm}`);
    }

    function editarAdm(e: React.MouseEvent) {
        e.stopPropagation();
        router.push(`/editar/editarFuncionario?id=${usuario.id}`);
    }

    async function excluirAdm(e: React.MouseEvent) {
        e.stopPropagation();
        const confirmacao = confirm(`Tem certeza que deseja excluir o administrador "${usuario.nome}"?`);
        if (confirmacao) {
            try {
                await usuarioDAO.deletar(usuario.id);
                alert("Administrador excluído com sucesso!");
                if (onDelete) {
                    onDelete();
                }
            } catch (error: any) {
                console.error("Erro ao excluir administrador:", error.message);
                alert("Erro ao excluir administrador!");
            }
        }
    }

    return (
        <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
            {/* Botões de ação - sempre visíveis */}
            <div className="absolute top-2 right-2 flex gap-1">
                <button
                    onClick={editarAdm}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                    title="Editar administrador"
                >
                    ✏️
                </button>
                <button
                    onClick={excluirAdm}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                    title="Excluir administrador"
                >
                    🗑️
                </button>
            </div>

            {/* Área clicável para navegar ao perfil */}
            <div 
                className="flex w-full cursor-pointer" 
                onClick={() => navegarPerfil(usuario.id)}
            >
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg overflow-hidden">
                    {usuario.fotoUrl ? (
                        <img
                            src={usuario.fotoUrl as string}
                            alt={usuario.nome}
                            className="object-cover h-full w-full rounded-lg"
                        />
                    ) : (
                        <span className="text-3xl">{usuario.nome[0]}</span>
                    )}
                </div>
                <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                    <p className="text-xl font-bold">{usuario.nome}</p>
                    <p className="text-xl">{usuario.escola?.nome || 'Escola não informada'}</p>
                </div>
            </div>
        </div>
    );
}
