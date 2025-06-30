import Aluno from "@/model/Aluno";
import alunoDAO from "@/DAOs/AlunoDAO";
import { useRouter } from "next/navigation";

export default function AlunoCard({ aluno, onDelete }: { aluno: Aluno; onDelete?: () => void }) {
    const router = useRouter()

    console.log("ALUNO1:", aluno);

    function navegarPerfilAluno(idAluno: string) {
        router.push(`/perfil/perfilAluno?id=${idAluno}`)
    }

    function editarAluno(e: React.MouseEvent) {
        e.stopPropagation();
        router.push(`/editar/editAluno?id=${aluno.id}`)
    }

    async function excluirAluno(e: React.MouseEvent) {
        e.stopPropagation();
        
        const confirmacao = confirm(`Tem certeza que deseja excluir o aluno "${aluno.nome}"?`);
        
        if (confirmacao) {
            try {
                await alunoDAO.deletar(aluno.id);
                alert("Aluno excluído com sucesso!");
                
                if (onDelete) {
                    onDelete();
                }
            } catch (error: any) {
                console.error("Erro ao excluir aluno:", error.message);
                alert("Erro ao excluir aluno!");
            }
        }
    }

    return (
        <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
            {/* Botões de ação - sempre visíveis */}
            <div className="absolute top-2 right-2 flex gap-1">
                <button
                    onClick={editarAluno}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                    title="Editar aluno"
                >
                    ✏️
                </button>
                <button
                    onClick={excluirAluno}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                    title="Excluir aluno"
                >
                    🗑️
                </button>
            </div>

            {/* Área clicável para navegar ao perfil */}
            <div 
                className="flex w-full cursor-pointer" 
                onClick={() => navegarPerfilAluno(aluno.id)}
            >
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg overflow-hidden">
                    <img 
                        src={aluno.fotoUrl} 
                        width={80} 
                        height={80}
                        className="w-full h-full object-cover rounded-lg" 
                        alt={`Foto do Aluno ${aluno.nome}`} 
                    />
                </div>
                <div className="px-3 flex flex-col justify-center text-start h-full py-1">
                    <p className="text-xl font-semibold">{aluno.nome}</p>
                    <p className="text-sm text-gray-600">{aluno.dataNascimento}</p>
                </div>
            </div>
        </div>
    )
}