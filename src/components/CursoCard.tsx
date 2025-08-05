import Curso from "@/model/Curso"
import cursoDAO from "@/DAOs/CursoDAO"
import { useRouter } from "next/navigation"
import TipoRegistro from "@/model/Enums/TipoRegistro";
import Usuario from "@/model/Usuario";
import TipoUsuario from "@/model/Enums/TipoUsuario";

export default function CursoCard({ curso, escola, onDelete, usuarioLogado }: { curso: Curso; escola: string; onDelete?: () => void; usuarioLogado: any }) {
    const router = useRouter()

    function navegarTurmas(idCurso: string) {
        router.push(`/listas/listaTurmas?id=${idCurso}`)
    }

    function editarCurso(e: React.MouseEvent) {
        e.stopPropagation();
        router.push(`/editar/editarCurso?id=${curso.id}`)
    }

    async function excluirCurso(e: React.MouseEvent) {
        e.stopPropagation();
        const confirmacao = confirm(`Tem certeza que deseja excluir o curso "${curso.nome}"?`);
        if (confirmacao) {
            try {
                await cursoDAO.deletar(curso.id);
                alert("Curso excluído com sucesso!");
                if (onDelete) {
                    onDelete();
                }
            } catch (error: any) {
                console.error("Erro ao excluir curso:", error.message);
                alert("Erro ao excluir curso!");
            }
        }
    }

    console.log("Tipo do usuário logado:", usuarioLogado?.tipoUsuario);

    return(
        <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
            {/* Botões de ação - visíveis apenas para ADMESCOLA */}
            {usuarioLogado?.tipoUsuario === "admEscola" && (
                <div className="absolute top-2 right-2 flex gap-1">
                    <button
                        onClick={editarCurso}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                        title="Editar curso"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={excluirCurso}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                        title="Excluir curso"
                    >
                        🗑️
                    </button>
                </div>
            )}

            {/* Área clicável para navegar às turmas */}
            <div 
                className="flex w-full cursor-pointer" 
                onClick={() => navegarTurmas(curso.id)}
            >
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg overflow-hidden">
                    {curso.fotoUrl ? (
                        <img
                            src={curso.fotoUrl as string}
                            alt={curso.nome}
                            className="object-cover h-full w-full rounded-lg"
                        />
                    ) : (
                        <p className="text-3xl">{curso.nome[0]}</p>
                    )}
                </div>
                <div className="px-3 flex flex-col justify-between text-start h-full py-1">
                    <div>
                        <p className="text-xl font-semibold">{curso.nome}</p>
                        <p className="text-sm text-gray-600">Escola: {escola}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        {curso.turno.map((turno) => (
                            <span key={turno} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {turno}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}