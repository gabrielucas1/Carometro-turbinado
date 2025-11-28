import Aluno from "@/model/Aluno";
import alunoDAO from "@/DAOs/AlunoDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import TurmaAluno from "@/model/TurmaAluno";
import Escola from "@/model/Escola";
import TransferirAlunoModal from "./TransferirAlunoModal";

interface AlunoCardProps {
    aluno: Aluno;
    onClick?: () => void;
    onDelete?: () => void;
    onTransfer?: () => void; // Nova prop para callback de transferência
    disableNavigation?: boolean; // Desativa o redirecionamento
    hideActions?: boolean; // Nova propriedade para ocultar ações
    showTransferButton?: boolean; // Nova prop para mostrar botão de transferência
    turmaAtualId?: string; // ID da turma atual para transferência
    profileUrl?: string; // URL para navegação do perfil
}

export default function AlunoCard({ 
    aluno, 
    onClick, 
    onDelete, 
    onTransfer,
    disableNavigation, 
    hideActions, 
    showTransferButton = false,
    turmaAtualId,
    profileUrl 
}: AlunoCardProps) {
    const router = useRouter()
    const [modalTransferirAberto, setModalTransferirAberto] = useState(false);

    console.log("[AlunoCard] Renderizando aluno:", aluno);
    console.log("[AlunoCard] fotoUrl:", aluno.fotoUrl);

    function navegarPerfilAluno(idAluno: string) {
        if (!disableNavigation) {
            if (profileUrl) {
                router.push(profileUrl);
            } else {
                router.push(`/perfil/perfilAluno?id=${idAluno}`);
            }
        }
    }

    function editarAluno(e: React.MouseEvent) {
        e.stopPropagation();
        router.push(`/editar/editarAluno?id=${aluno.id}`)
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

    function abrirModalTransferir(e: React.MouseEvent) {
        e.stopPropagation();
        setModalTransferirAberto(true);
    }

    function handleTransferSuccess() {
        setModalTransferirAberto(false);
        if (onTransfer) {
            onTransfer();
        }
    }

    return (
        <>
            <div className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all relative">
                {/* Botões de ação - Condicional */}
                {!hideActions && (
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                        <button
                            onClick={editarAluno}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full text-xs"
                            title="Editar aluno"
                        >
                            ✏️
                        </button>
                        {showTransferButton && turmaAtualId && (
                            <button
                                onClick={abrirModalTransferir}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full text-xs"
                                title="Transferir aluno"
                            >
                                🔄
                            </button>
                        )}
                        <button
                            onClick={excluirAluno}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                            title="Excluir aluno"
                        >
                            🗑️
                        </button>
                    </div>
                )}

                {/* Área clicável para navegar ao perfil */}
                <div 
                    className="flex w-full cursor-pointer" 
                    onClick={() => {
                        if (onClick) {
                            onClick();
                        } else {
                            navegarPerfilAluno(aluno.id);
                        }
                    }}
                >
                    <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg overflow-hidden">
                        {(() => {
                            // Verificar se existe fotoUrl válida
                            const hasFoto = aluno.fotoUrl && aluno.fotoUrl.trim() !== "";
                            
                            if (hasFoto) {
                                console.log("[AlunoCard] Exibindo foto do aluno:", aluno.nome);
                                return (
                                    <Image 
                                        src={aluno.fotoUrl}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover rounded-lg" 
                                        alt={`Foto do Aluno ${aluno.nome}`}
                                        onError={(e) => {
                                            console.log("[AlunoCard] Erro ao carregar imagem para:", aluno.nome);
                                            // Em caso de erro, trocar para placeholder
                                            (e.target as HTMLImageElement).src = "/images/default-user.png";
                                        }}
                                    />
                                );
                            } else {
                                console.log("[AlunoCard] Sem foto, exibindo placeholder para:", aluno.nome);
                                return (
                                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500 text-xs">Foto do Aluno</span>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                    <div className="px-3 flex flex-col justify-center text-start h-full py-1">
                        <p className="text-xl font-semibold">{aluno.nome}</p>
                        <p className="text-sm text-gray-600">{aluno.dataNascimento}</p>
                    </div>
                </div>
            </div>

            {/* Modal de Transferência */}
            {modalTransferirAberto && (
                <TransferirAlunoModal
                    aluno={aluno}
                    turmaAtualId={turmaAtualId}
                    isOpen={modalTransferirAberto}
                    onClose={() => setModalTransferirAberto(false)}
                    onTransferSuccess={handleTransferSuccess}
                />
            )}
        </>
    )
}