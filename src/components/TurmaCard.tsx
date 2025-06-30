import Turma from "@/model/Turma"
import turmaDAO from "@/DAOs/TurmaDAO"
import { useRouter } from "next/navigation"

export default function TurmaCard({turma, onDelete} : {turma: Turma; onDelete?: () => void}) {
    const router = useRouter()

    function navegarAlunos(idTurma: string) {
        router.push(`/listas/listaAlunos?idTurma=${idTurma}`)
    }

    function editarTurma(e: React.MouseEvent) {
        e.stopPropagation();
        router.push(`/editar/editTurma?id=${turma.id}`)
    }

    async function excluirTurma(e: React.MouseEvent) {
        e.stopPropagation();
        
        const confirmacao = confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"?`);
        
        if (confirmacao) {
            try {
                await turmaDAO.deletar(turma.id);
                alert("Turma excluída com sucesso!");
                
                if (onDelete) {
                    onDelete();
                }
            } catch (error: any) {
                console.error("Erro ao excluir turma:", error.message);
                alert("Erro ao excluir turma!");
            }
        }
    }

    return(
        <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
            {/* Botões de ação - sempre visíveis */}
            <div className="absolute top-2 right-2 flex gap-1">
                <button
                    onClick={editarTurma}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                    title="Editar turma"
                >
                    ✏️
                </button>
                <button
                    onClick={excluirTurma}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                    title="Excluir turma"
                >
                    🗑️
                </button>
            </div>

            {/* Área clicável para navegar aos alunos */}
            <div 
                className="flex w-full cursor-pointer" 
                onClick={() => navegarAlunos(turma.id)}
            >
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                    <p className="text-3xl">{turma.nome[0]}</p>
                </div>
                <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                    <p className="text-xl">{turma.nome}</p>
                    <div className="">
                        <p>{turma.ano}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}