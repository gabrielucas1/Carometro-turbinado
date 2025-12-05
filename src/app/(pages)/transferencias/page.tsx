"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Aluno from "@/model/Aluno";
import Curso from "@/model/Curso";
import Turma from "@/model/Turma";
import cursoDAO from "@/DAOs/CursoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import alunoDAO from "@/DAOs/AlunoDAO";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";

interface AlunoComTurma extends Aluno {
    turmaAtual?: Turma;
}

export default function GerenciarTransferencias() {
    const router = useRouter();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [alunos, setAlunos] = useState<AlunoComTurma[]>([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState<Set<string>>(new Set());
    
    // Filtros
    const [cursoOrigemSelecionado, setCursoOrigemSelecionado] = useState<string>("");
    const [turmaOrigemSelecionada, setTurmaOrigemSelecionada] = useState<string>("");
    const [cursoDestinoSelecionado, setCursoDestinoSelecionado] = useState<string>("");
    const [turmaDestinoSelecionada, setTurmaDestinoSelecionada] = useState<string>("");
    
    // Estados de carregamento
    const [carregandoCursos, setCarregandoCursos] = useState(false);
    const [carregandoTurmas, setCarregandoTurmas] = useState(false);
    const [carregandoAlunos, setCarregandoAlunos] = useState(false);
    const [processandoTransferencias, setProcessandoTransferencias] = useState(false);
    
    // Turmas de destino
    const [turmasDestino, setTurmasDestino] = useState<Turma[]>([]);
    const [carregandoTurmasDestino, setCarregandoTurmasDestino] = useState(false);

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Gerenciar Transferências", isActive: true }
    ];

    // Carregar cursos ao montar o componente
    useEffect(() => {
        carregarCursos();
    }, []);

    // Carregar turmas quando curso origem for selecionado
    useEffect(() => {
        if (cursoOrigemSelecionado) {
            carregarTurmasOrigem();
        } else {
            setTurmas([]);
            setTurmaOrigemSelecionada("");
            setAlunos([]);
        }
    }, [cursoOrigemSelecionado]);

    // Carregar alunos quando turma origem for selecionada
    useEffect(() => {
        if (turmaOrigemSelecionada) {
            carregarAlunosDaTurma();
        } else {
            setAlunos([]);
        }
        setAlunosSelecionados(new Set());
    }, [turmaOrigemSelecionada]);

    // Carregar turmas destino quando curso destino for selecionado
    useEffect(() => {
        if (cursoDestinoSelecionado) {
            carregarTurmasDestino();
        } else {
            setTurmasDestino([]);
            setTurmaDestinoSelecionada("");
        }
    }, [cursoDestinoSelecionado]);

    async function carregarCursos() {
        try {
            setCarregandoCursos(true);
            const cursosData = await cursoDAO.getAll();
            setCursos(cursosData);
        } catch (error) {
            console.error("Erro ao carregar cursos:", error);
            alert("Erro ao carregar cursos");
        } finally {
            setCarregandoCursos(false);
        }
    }

    async function carregarTurmasOrigem() {
        try {
            setCarregandoTurmas(true);
            const turmasData = await turmaDAO.getByCursoId(cursoOrigemSelecionado);
            setTurmas(turmasData);
            setTurmaOrigemSelecionada("");
        } catch (error) {
            console.error("Erro ao carregar turmas:", error);
            alert("Erro ao carregar turmas");
        } finally {
            setCarregandoTurmas(false);
        }
    }

    async function carregarTurmasDestino() {
        try {
            setCarregandoTurmasDestino(true);
            const turmasData = await turmaDAO.getByCursoId(cursoDestinoSelecionado);
            // Filtrar turma de origem se for o mesmo curso
            const turmasFiltradas = turmasData.filter(turma => 
                turma.idTurma !== turmaOrigemSelecionada
            );
            setTurmasDestino(turmasFiltradas);
            setTurmaDestinoSelecionada("");
        } catch (error) {
            console.error("Erro ao carregar turmas de destino:", error);
            alert("Erro ao carregar turmas de destino");
        } finally {
            setCarregandoTurmasDestino(false);
        }
    }

    async function carregarAlunosDaTurma() {
        try {
            setCarregandoAlunos(true);
            const alunosData = await turmaAlunoDAO.getAlunos(turmaOrigemSelecionada);
            
            // Buscar informações da turma atual para cada aluno
            const alunosComTurma = await Promise.all(
                alunosData.map(async (aluno) => {
                    try {
                        const turmaAtual = await turmaDAO.getOne(turmaOrigemSelecionada);
                        return { ...aluno, turmaAtual };
                    } catch (error) {
                        console.error(`Erro ao buscar turma para aluno ${aluno.id}:`, error);
                        return aluno;
                    }
                })
            );
            
            setAlunos(alunosComTurma);
        } catch (error) {
            console.error("Erro ao carregar alunos:", error);
            alert("Erro ao carregar alunos");
        } finally {
            setCarregandoAlunos(false);
        }
    }

    function toggleAlunoSelecionado(alunoId: string) {
        const novosAlunosSelecionados = new Set(alunosSelecionados);
        if (novosAlunosSelecionados.has(alunoId)) {
            novosAlunosSelecionados.delete(alunoId);
        } else {
            novosAlunosSelecionados.add(alunoId);
        }
        setAlunosSelecionados(novosAlunosSelecionados);
    }

    function selecionarTodosAlunos() {
        if (alunosSelecionados.size === alunos.length) {
            setAlunosSelecionados(new Set());
        } else {
            setAlunosSelecionados(new Set(alunos.map(aluno => aluno.id)));
        }
    }

    async function executarTransferenciasEmMassa() {
        if (alunosSelecionados.size === 0) {
            alert("Selecione pelo menos um aluno para transferir");
            return;
        }

        if (!turmaDestinoSelecionada) {
            alert("Selecione uma turma de destino");
            return;
        }

        const confirmacao = confirm(
            `Tem certeza que deseja transferir ${alunosSelecionados.size} aluno(s) para a nova turma?`
        );

        if (!confirmacao) return;

        try {
            setProcessandoTransferencias(true);
            let sucessos = 0;
            let erros: string[] = [];

            for (const alunoId of Array.from(alunosSelecionados)) {
                try {
                    await turmaAlunoDAO.transferirAluno(
                        alunoId,
                        turmaOrigemSelecionada,
                        turmaDestinoSelecionada
                    );
                    sucessos++;
                } catch (error) {
                    const alunoNome = alunos.find(a => a.id === alunoId)?.nome || alunoId;
                    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
                    erros.push(`${alunoNome}: ${msg}`);
                    console.error(`Erro ao transferir aluno ${alunoId}:`, error);
                }
            }

            // Mostrar resultado
            let mensagem = `${sucessos} aluno(s) transferido(s) com sucesso!`;
            if (erros.length > 0) {
                mensagem += `\n\nErros (${erros.length}):\n${erros.join('\n')}`;
            }
            alert(mensagem);

            // Recarregar lista de alunos
            if (sucessos > 0) {
                await carregarAlunosDaTurma();
                setAlunosSelecionados(new Set());
            }

        } catch (error) {
            console.error("Erro durante transferências em massa:", error);
            alert("Erro durante as transferências");
        } finally {
            setProcessandoTransferencias(false);
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full px-4 py-10 bg-gray-50">
            <div className="w-full max-w-6xl mx-auto">
                <Breadcrumbs items={breadcrumbItems} />
                
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">
                        Gerenciar Transferências de Alunos
                    </h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* ORIGEM */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                🎯 Turma de Origem
                            </h2>
                            
                            {/* Curso Origem */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Curso de Origem:
                                </label>
                                <select
                                    value={cursoOrigemSelecionado}
                                    onChange={(e) => setCursoOrigemSelecionado(e.target.value)}
                                    disabled={carregandoCursos}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">
                                        {carregandoCursos ? "Carregando..." : "Selecione um curso"}
                                    </option>
                                    {cursos.map((curso) => (
                                        <option key={curso.id} value={curso.id}>
                                            {curso.nome} - {curso.escola?.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Turma Origem */}
                            {cursoOrigemSelecionado && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Turma de Origem:
                                    </label>
                                    <select
                                        value={turmaOrigemSelecionada}
                                        onChange={(e) => setTurmaOrigemSelecionada(e.target.value)}
                                        disabled={carregandoTurmas}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">
                                            {carregandoTurmas ? "Carregando..." : "Selecione uma turma"}
                                        </option>
                                        {turmas.map((turma) => (
                                            <option key={turma.idTurma} value={turma.idTurma}>
                                                {turma.nome} - {turma.ano}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* DESTINO */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                🚀 Turma de Destino
                            </h2>
                            
                            {/* Curso Destino */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Curso de Destino:
                                </label>
                                <select
                                    value={cursoDestinoSelecionado}
                                    onChange={(e) => setCursoDestinoSelecionado(e.target.value)}
                                    disabled={carregandoCursos}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">
                                        {carregandoCursos ? "Carregando..." : "Selecione um curso"}
                                    </option>
                                    {cursos.map((curso) => (
                                        <option key={curso.id} value={curso.id}>
                                            {curso.nome} - {curso.escola?.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Turma Destino */}
                            {cursoDestinoSelecionado && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Turma de Destino:
                                    </label>
                                    <select
                                        value={turmaDestinoSelecionada}
                                        onChange={(e) => setTurmaDestinoSelecionada(e.target.value)}
                                        disabled={carregandoTurmasDestino}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">
                                            {carregandoTurmasDestino ? "Carregando..." : "Selecione uma turma"}
                                        </option>
                                        {turmasDestino.map((turma) => (
                                            <option key={turma.idTurma} value={turma.idTurma}>
                                                {turma.nome} - {turma.ano}
                                            </option>
                                        ))}
                                    </select>
                                    {turmasDestino.length === 0 && !carregandoTurmasDestino && cursoDestinoSelecionado && (
                                        <p className="text-gray-500 text-sm mt-2">
                                            Nenhuma turma disponível para transferência
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* LISTA DE ALUNOS */}
                {turmaOrigemSelecionada && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                👥 Alunos da Turma ({alunos.length})
                            </h2>
                            {alunos.length > 0 && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={selecionarTodosAlunos}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        {alunosSelecionados.size === alunos.length ? "Desmarcar Todos" : "Selecionar Todos"}
                                    </button>
                                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                                        {alunosSelecionados.size} selecionado(s)
                                    </span>
                                </div>
                            )}
                        </div>

                        {carregandoAlunos ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">Carregando alunos...</p>
                            </div>
                        ) : alunos.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">
                                Nenhum aluno encontrado nesta turma
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {alunos.map((aluno) => (
                                    <div
                                        key={aluno.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            alunosSelecionados.has(aluno.id)
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => toggleAlunoSelecionado(aluno.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={alunosSelecionados.has(aluno.id)}
                                                onChange={() => toggleAlunoSelecionado(aluno.id)}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {aluno.nome}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {aluno.dataNascimento}
                                                </p>
                                                {aluno.turmaAtual && (
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Turma: {aluno.turmaAtual.nome}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Botão de transferência */}
                        {alunosSelecionados.size > 0 && turmaDestinoSelecionada && (
                            <div className="mt-6 pt-6 border-t">
                                <button
                                    onClick={executarTransferenciasEmMassa}
                                    disabled={processandoTransferencias}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {processandoTransferencias ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processando transferências...
                                        </>
                                    ) : (
                                        <>
                                            🔄 Transferir {alunosSelecionados.size} Aluno(s)
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}