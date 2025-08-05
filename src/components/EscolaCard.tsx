
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Escola from "@/model/Escola";
import { useRouter } from "next/navigation";
import escolaDAO from "@/DAOs/EscolaDAO";
import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";

export default function EscolaCard({ escola, idFuncionario, onDelete }: { escola: Escola, idFuncionario?: string | null, onDelete?: () => void }) {
    const router = useRouter();
    const { usuarioLogado } = useContext(UserContext);

    function navegarPerfil(idEscola: string) {
        router.push(`/perfil/perfilEscola?id=${idEscola}`);
    }

    function editarEscola(e: React.MouseEvent) {
        e.stopPropagation();
        router.push(`/editar/editarEscola?id=${escola.id}`);
    }

    async function excluirEscola(e: React.MouseEvent) {
        e.stopPropagation();
        const confirmacao = confirm(`Tem certeza que deseja excluir a escola "${escola.nome}"?`);
        if (confirmacao) {
            try {
                await escolaDAO.deletar(escola.id);
                alert("Escola excluída com sucesso!");
                if (onDelete) {
                    onDelete();
                }
            } catch (error: any) {
                console.error("Erro ao excluir escola:", error.message);
                alert("Erro ao excluir escola!");
            }
        }
    }

    return(
        <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
            {/* Botões de ação - permissões */}
            {usuarioLogado?.tipoUsuario === "admGeral" && (
                <div className="absolute top-2 right-2 flex gap-1">
                    <button
                        onClick={editarEscola}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                        title="Editar escola"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={excluirEscola}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                        title="Excluir escola"
                    >
                        🗑️
                    </button>
                </div>
            )}
            {usuarioLogado?.tipoUsuario === "admEscola" && (
                <div className="absolute top-2 right-2 flex gap-1">
                    <button
                        onClick={editarEscola}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                        title="Editar escola"
                    >
                        ✏️
                    </button>
                </div>
            )}
            {/* Área clicável para navegar ao perfil */}
            <div 
                className="flex w-full cursor-pointer" 
                onClick={() => navegarPerfil(escola.id)}
            >
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                    <p className="text-3xl">{escola.nome[0]}</p>
                </div>
                <div className="px-3 flex flex-col justify-center text-start h-full py-1">
                    <p className="text-xl font-semibold">{escola.nome}</p>
                    <p className="text-sm text-gray-600">{escola.cidade} - {escola.estado}</p>
                </div>
            </div>
        </div>
    )
}