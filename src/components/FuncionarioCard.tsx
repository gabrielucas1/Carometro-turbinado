import Usuario from "@/model/Usuario"
import usuarioDAO from "@/DAOs/UsuarioDAO"
import { useRouter } from "next/navigation"

export default function FuncionarioCard({funcionario, onDelete}: {funcionario: Usuario; onDelete?: () => void}) {
    const router = useRouter()

    console.log(`Funcionario: ${funcionario.dataNascimento}`)
    
    function navegarPerfil(idFuncionario: string) {
        router.push(`/perfil/perfilFuncionario?id=${idFuncionario}`)
    }

    function editarFuncionario(e: React.MouseEvent) {
        e.stopPropagation();
        router.push(`/editar/editFuncionario?id=${funcionario.id}`)
    }

    async function excluirFuncionario(e: React.MouseEvent) {
        e.stopPropagation();
        
        const confirmacao = confirm(`Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?`);
        
        if (confirmacao) {
            try {
                await usuarioDAO.deletar(funcionario.id);
                alert("Funcionário excluído com sucesso!");
                
                if (onDelete) {
                    onDelete();
                }
            } catch (error: any) {
                console.error("Erro ao excluir funcionário:", error.message);
                alert("Erro ao excluir funcionário!");
            }
        }
    }
    
    return(
        <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
            {/* Botões de ação - sempre visíveis */}
            <div className="absolute top-2 right-2 flex gap-1">
                <button
                    onClick={editarFuncionario}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                    title="Editar funcionário"
                >
                    ✏️
                </button>
                <button
                    onClick={excluirFuncionario}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                    title="Excluir funcionário"
                >
                    🗑️
                </button>
            </div>

            {/* Área clicável para navegar ao perfil */}
            <div 
                className="flex w-full cursor-pointer" 
                onClick={() => navegarPerfil(funcionario.id)}
            >
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                    <p className="text-3xl">{funcionario.nome[0]}</p>
                </div>
                <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                    <p className="text-xl">{funcionario.nome}</p>
                    <p className="text-xl">{funcionario.escola.nome}</p>
                    <div className="">
                        <p>{funcionario.dataNascimento}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}