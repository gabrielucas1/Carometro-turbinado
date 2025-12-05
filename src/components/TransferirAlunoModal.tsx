"use client";

import { useState, useEffect } from "react";
import Aluno from "@/model/Aluno";
import Curso from "@/model/Curso";
import Turma from "@/model/Turma";
import cursoDAO from "@/DAOs/CursoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";

interface TransferirAlunoModalProps {
    aluno: Aluno;
    turmaAtualId?: string;
    isOpen: boolean;
    onClose: () => void;
    onTransferSuccess: () => void;
}

export default function TransferirAlunoModal({
    aluno,
    turmaAtualId,
    isOpen,
    onClose,
    onTransferSuccess
}: TransferirAlunoModalProps) {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [cursoSelecionado, setCursoSelecionado] = useState<string>("");
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
    const [carregandoCursos, setCarregandoCursos] = useState(false);
    const [carregandoTurmas, setCarregandoTurmas] = useState(false);
    const [transferindo, setTransferindo] = useState(false);
    const [turmaAtualInfo, setTurmaAtualInfo] = useState<Turma | null>(null);

    // Carregar cursos quando o modal abre
    useEffect(() => {
        if (isOpen) {
            carregarCursos();
            if (turmaAtualId) {
                carregarTurmaAtual();
            }
        }
    }, [isOpen, turmaAtualId]);

    // Carregar turmas quando curso é selecionado
    useEffect(() => {
        if (cursoSelecionado) {
            carregarTurmas();
        } else {
            setTurmas([]);
            setTurmaSelecionada("");
        }
    }, [cursoSelecionado]);

    async function carregarCursos() {
        try {
            setCarregandoCursos(true);
            console.log('[DEBUG] TransferirAlunoModal - Carregando cursos');
            const cursosData = await cursoDAO.getAll();
            setCursos(cursosData);
            console.log('[DEBUG] TransferirAlunoModal - Cursos carregados:', cursosData.length);
        } catch (error) {
            console.error('[ERROR] TransferirAlunoModal - Erro ao carregar cursos:', error);
            alert("Erro ao carregar cursos");
        } finally {
            setCarregandoCursos(false);
        }
    }

    async function carregarTurmaAtual() {
        if (!turmaAtualId) return;
        
        try {
            console.log('[DEBUG] TransferirAlunoModal - Carregando turma atual:', turmaAtualId);
            const turma = await turmaDAO.getOne(turmaAtualId);
            setTurmaAtualInfo(turma);
            console.log('[DEBUG] TransferirAlunoModal - Turma atual carregada:', turma);
        } catch (error) {
            console.error('[ERROR] TransferirAlunoModal - Erro ao carregar turma atual:', error);
        }
    }

    async function carregarTurmas() {
        try {
            setCarregandoTurmas(true);
            console.log('[DEBUG] TransferirAlunoModal - Carregando turmas do curso:', cursoSelecionado);
            const turmasData = await turmaDAO.getByCursoId(cursoSelecionado);
            
            // Filtrar turma atual se existir
            const turmasFiltradas = turmasData.filter(turma => turma.idTurma !== turmaAtualId);
            
            setTurmas(turmasFiltradas);
            setTurmaSelecionada("");
            console.log('[DEBUG] TransferirAlunoModal - Turmas carregadas:', turmasFiltradas.length);
        } catch (error) {
            console.error('[ERROR] TransferirAlunoModal - Erro ao carregar turmas:', error);
            alert("Erro ao carregar turmas");
        } finally {
            setCarregandoTurmas(false);
        }
    }

    async function executarTransferencia() {
        if (!turmaSelecionada) {
            alert("Selecione uma turma de destino");
            return;
        }

        if (!turmaAtualId) {
            alert("Turma atual não identificada");
            return;
        }

        const confirmacao = confirm(
            `Tem certeza que deseja transferir "${aluno.nome}" para a nova turma?`
        );

        if (!confirmacao) return;

        try {
            setTransferindo(true);
            console.log('[DEBUG] TransferirAlunoModal - Iniciando transferência:', {
                aluno: aluno.id,
                origem: turmaAtualId,
                destino: turmaSelecionada
            });

            await turmaAlunoDAO.transferirAluno(aluno.id, turmaAtualId, turmaSelecionada);
            
            alert("Aluno transferido com sucesso!");
            onTransferSuccess();
            fecharModal();

        } catch (error) {
            console.error('[ERROR] TransferirAlunoModal - Erro na transferência:', error);
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            alert(`Erro ao transferir aluno: ${msg}`);
        } finally {
            setTransferindo(false);
        }
    }

    function fecharModal() {
        setCursoSelecionado("");
        setTurmaSelecionada("");
        setTurmas([]);
        setTurmaAtualInfo(null);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
                    <h2 className="text-xl font-bold">Transferir Aluno</h2>
                    <p className="text-blue-100 mt-1">
                        {aluno.nome}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Turma atual */}
                    {turmaAtualInfo && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Turma Atual:</h3>
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {turmaAtualInfo.nome}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    {turmaAtualInfo.curso?.nome} - {turmaAtualInfo.ano}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Seleção de curso */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selecione o Curso de Destino:
                        </label>
                        <select
                            value={cursoSelecionado}
                            onChange={(e) => setCursoSelecionado(e.target.value)}
                            disabled={carregandoCursos || transferindo}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">
                                {carregandoCursos ? "Carregando cursos..." : "Selecione um curso"}
                            </option>
                            {cursos.map((curso) => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.nome} - {curso.escola?.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Seleção de turma */}
                    {cursoSelecionado && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione a Turma de Destino:
                            </label>
                            <select
                                value={turmaSelecionada}
                                onChange={(e) => setTurmaSelecionada(e.target.value)}
                                disabled={carregandoTurmas || transferindo}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">
                                    {carregandoTurmas ? "Carregando turmas..." : "Selecione uma turma"}
                                </option>
                                {turmas.map((turma) => (
                                    <option key={turma.idTurma} value={turma.idTurma}>
                                        {turma.nome} - {turma.ano}
                                    </option>
                                ))}
                            </select>
                            {turmas.length === 0 && !carregandoTurmas && (
                                <p className="text-gray-500 text-sm mt-2">
                                    Nenhuma turma disponível para transferência neste curso
                                </p>
                            )}
                        </div>
                    )}

                    {/* Warning */}
                    {turmaSelecionada && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-yellow-600 text-lg">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Atenção
                                    </h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Esta ação irá mover o aluno permanentemente para a nova turma. 
                                        Todos os registros e histórico serão mantidos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
                    <button
                        onClick={fecharModal}
                        disabled={transferindo}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={executarTransferencia}
                        disabled={!turmaSelecionada || transferindo}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {transferindo && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {transferindo ? "Transferindo..." : "Transferir Aluno"}
                    </button>
                </div>
            </div>
        </div>
    );
}