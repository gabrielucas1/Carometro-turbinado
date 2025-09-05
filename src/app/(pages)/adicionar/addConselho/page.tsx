"use client"

import { useEffect, useState, useContext } from "react";
import registroProfessorDescricaoDAO from "@/DAOs/RegistroProfessorDescricaoDAO";
import alunoDAO from "@/DAOs/AlunoDAO";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO"; // Supondo que exista
import turmaDAO from "@/DAOs/TurmaDAO";
import RegistroProfessorDescricao from "@/model/RegistroProfessorDescricao";
import RegistroProfessorTurma from "@/model/RegistroProfessorTurma";
import Aluno from "@/model/Aluno";
import ConselhoClasse from "@/model/ConselhoClasse";
import { UserContext } from "@/contexts/UserContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddConselhoPage() {
    const router = useRouter();
    const { usuarioLogado } = useContext(UserContext);
    const [nomeConselho, setNomeConselho] = useState("");
    const [turmas, setTurmas] = useState<any[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
    const [carregando, setCarregando] = useState(true);
    const [conselhoCriado, setConselhoCriado] = useState<any>(null);

    useEffect(() => {
        async function fetchTurmas() {
            const turmaDAO = (await import("@/DAOs/TurmaDAO")).default;
            const turmas = await turmaDAO.getAll();
            // Filtra turmas pela escola do usuário logado
            const turmasFiltradas = turmas.filter(t => t.escola.id === usuarioLogado.escola.id);
            setTurmas(turmasFiltradas);
            setCarregando(false);
        }
        fetchTurmas();
    }, [usuarioLogado]);

    async function criarConselho() {
        if (!nomeConselho || !turmaSelecionada) return alert("Preencha todos os campos!");
        setCarregando(true);
        const turmaObj = turmas.find(t => t.id === turmaSelecionada);
        const conselhoClasseDAO = (await import("@/DAOs/ConselhoClasseDAO")).default;
        const ConselhoClasse = (await import("@/model/ConselhoClasse")).default;
        const novoConselho = new ConselhoClasse();
        novoConselho.nome = nomeConselho;
        novoConselho.turma = turmaObj;
        novoConselho.dataCriacao = new Date();
        novoConselho.dataModificacao = new Date();
        // Salva no Firestore
        await conselhoClasseDAO.inserir(novoConselho);
        setConselhoCriado({
            nome: novoConselho.nome,
            turma: turmaObj.nome,
            data: novoConselho.dataCriacao
        });
        setCarregando(false);
    }

    if (carregando) return <div>Carregando...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="bg-blue-100 rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Criar Conselho de Classe</h2>
                <label className="block mb-2 font-semibold">Nome do Conselho</label>
                <input
                    className="w-full p-2 mb-4 rounded border"
                    value={nomeConselho}
                    onChange={e => setNomeConselho(e.target.value)}
                    placeholder="Ex: 1º Trimestre 2025"
                />
                <label className="block mb-2 font-semibold">Turma</label>
                <select
                    className="w-full p-2 mb-4 rounded border"
                    value={turmaSelecionada}
                    onChange={e => setTurmaSelecionada(e.target.value)}
                >
                    <option value="">Selecione a turma</option>
                    {turmas.map(turma => (
                        <option key={turma.id} value={turma.id}>{turma.nome}</option>
                    ))}
                </select>
                <button
                    className="mt-6 bg-blue-600 text-white py-2 px-8 rounded-full font-semibold shadow hover:bg-blue-700"
                    onClick={criarConselho}
                >Criar Conselho</button>
            </div>
            {conselhoCriado && (
                <div className="bg-blue-100 rounded-xl shadow-lg p-6 mt-8 w-full max-w-md flex flex-col items-start">
                    <span className="font-bold text-lg">{conselhoCriado.nome}</span>
                    <span className="text-sm">Turma: {conselhoCriado.turma}</span>
                    <span className="text-sm">Data: {new Date(conselhoCriado.data).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    );
}