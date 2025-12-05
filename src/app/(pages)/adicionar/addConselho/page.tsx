"use client"

import { useEffect, useState } from "react";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import { useRouter } from "next/navigation";

export default function AddConselhoPage() {
    const router = useRouter();
    const [nomeConselho, setNomeConselho] = useState("");
    const [turmas, setTurmas] = useState<any[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState("");
    const [dataConselho, setDataConselho] = useState("");
    const [horaConselho, setHoraConselho] = useState(""); // Novo campo de hora
    const [conselhoCriado, setConselhoCriado] = useState<any>(null);

    useEffect(() => {
        async function fetchTurmas() {
            const turmaDAO = (await import("@/DAOs/TurmaDAO")).default;
            const cursoDAO = (await import("@/DAOs/CursoDAO")).default;
            const turmas = await turmaDAO.getAll();
            const cursos = await cursoDAO.getAll();
            // Filtrar turmas pela escola do usuário logado
            const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "null");
            const idEscolaUsuario = usuarioLogado?.idEscola;
            console.log('[DEBUG] usuarioLogado:', usuarioLogado);
            console.log('[DEBUG] idEscolaUsuario:', idEscolaUsuario);
            console.log('[DEBUG] turmas:', turmas);
            console.log('[DEBUG] cursos:', cursos);
            const turmasFiltradas = turmas.filter(turma => {
                console.log('[DEBUG] turma.idCurso:', turma.idCurso);
                const curso = cursos.find(c => c.id === turma.idCurso);
                console.log('[DEBUG] curso encontrado:', curso);
                const match = curso && curso.idEscola === idEscolaUsuario;
                console.log('[DEBUG] turma:', turma, '| curso:', curso, '| match:', match);
                return match;
            });
            console.log('[DEBUG] turmasFiltradas:', turmasFiltradas);
            setTurmas(turmasFiltradas);
        }
        fetchTurmas();
    }, []);

    async function criarConselho() {
        if (!nomeConselho.trim()) {
            alert('Por favor, preencha o nome do conselho!');
            return;
        }
        if (!turmaSelecionada) {
            alert('Por favor, selecione uma turma!');
            return;
        }
        if (!dataConselho) {
            alert('Por favor, selecione uma data!');
            return;
        }
        if (!horaConselho) {
            alert('Por favor, selecione uma hora!');
            return;
        }

        // Buscar turma pelo idTurma
        const turmaObj = turmas.find(t => t.idTurma === turmaSelecionada || t.id === turmaSelecionada);
        console.log('[DEBUG] turmaSelecionada:', turmaSelecionada);
        console.log('[DEBUG] turmaObj retornado:', turmaObj);
        if (!turmaObj) {
            alert('Turma não encontrada!');
            return;
        }

        const conselhoClasseDAO = (await import("@/DAOs/ConselhoClasseDAO")).default;
        const ConselhoClasse = (await import("@/model/ConselhoClasse")).default;
        
        const novoConselho = new ConselhoClasse();
        novoConselho.nome = nomeConselho;
        // Salvar o objeto da turma, garantindo idTurma
        novoConselho.turma = turmaObj;
        
        // Combinar data e hora
        const dataHora = new Date(`${dataConselho}T${horaConselho}`);
        novoConselho.dataCriacao = dataHora;
        novoConselho.dataModificacao = new Date();
        
        // Adicionar hora como propriedade extra (para compatibilidade)
        (novoConselho as any).hora = horaConselho;

        try {
            await conselhoClasseDAO.inserir(novoConselho);
            alert("Conselho criado com sucesso!");
            router.push("/listas/listaConselho");
        } catch (error) {
            console.error('Erro ao criar conselho:', error);
            alert("Erro ao criar conselho. Tente novamente.");
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-blue-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Criar Conselho de Classe</h2>
                    <p className="text-gray-600">Preencha os dados para criar um novo conselho</p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Nome do Conselho */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nome do Conselho *
                        </label>
                        <input
                            className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                            value={nomeConselho}
                            onChange={e => setNomeConselho(e.target.value)}
                            placeholder="Ex: 1º Trimestre 2025"
                            required
                        />
                    </div>

                    {/* Turma */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Turma *
                        </label>
                        <select
                            className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                            value={turmaSelecionada}
                            onChange={e => setTurmaSelecionada(e.target.value)}
                            required
                        >
                            <option value="">Selecione a turma</option>
                            {turmas.map(turma => (
                                <option key={turma.idTurma || turma.id} value={turma.idTurma || turma.id}>
                                    {turma.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Data e Hora em linha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Data */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Data *
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                value={dataConselho}
                                onChange={e => setDataConselho(e.target.value)}
                                required
                            />
                        </div>

                        {/* Hora */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Hora *
                            </label>
                            <input
                                type="time"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                value={horaConselho}
                                onChange={e => setHoraConselho(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Botão */}
                    <button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 mt-8"
                        onClick={criarConselho}
                        disabled={!nomeConselho || !turmaSelecionada || !dataConselho || !horaConselho}
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Criar Conselho
                        </span>
                    </button>
                </div>

                {/* Nota */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                        <span className="font-semibold">Dica:</span> Todos os campos marcados com (*) são obrigatórios.
                    </p>
                </div>
            </div>

            {/* Preview do conselho criado */}
            {conselhoCriado && (
                <div className="bg-white rounded-2xl shadow-xl p-6 mt-8 w-full max-w-lg border border-green-200">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Conselho Criado</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-700"><span className="font-semibold">Nome:</span> {conselhoCriado.nome}</p>
                        <p className="text-gray-700"><span className="font-semibold">Turma:</span> {conselhoCriado.turma}</p>
                        <p className="text-gray-700"><span className="font-semibold">Data:</span> {new Date(conselhoCriado.data).toLocaleDateString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}