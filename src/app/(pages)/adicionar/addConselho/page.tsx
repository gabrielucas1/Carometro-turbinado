"use client"

import { useEffect, useState } from "react";
import registroProfessorDescricaoDAO from "@/DAOs/RegistroProfessorDescricaoDAO";
import alunoDAO from "@/DAOs/AlunoDAO";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO"; // Supondo que exista
import turmaDAO from "@/DAOs/TurmaDAO";
import RegistroProfessorDescricao from "@/model/RegistroProfessorDescricao";
import RegistroProfessorTurma from "@/model/RegistroProfessorTurma";
import Aluno from "@/model/Aluno";
import ConselhoClasse from "@/model/ConselhoClasse";
import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddConselhoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idConselho = searchParams.get("idConselho");
    const idAluno = searchParams.get("idAluno");
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [conselho, setConselho] = useState<ConselhoClasse | null>(null);
    const [observacao, setObservacao] = useState("");
    const [carregando, setCarregando] = useState(true);
    const { usuarioLogado } = useContext(UserContext);

    useEffect(() => {
        async function fetchData() {
            if (idAluno && idConselho) {
                const alunoBuscado = await alunoDAO.getOne(idAluno);
                const conselhoBuscado = await conselhoClasseDAO.getOne(idConselho);
                setAluno(alunoBuscado);
                setConselho(conselhoBuscado);
            }
            setCarregando(false);
        }
        fetchData();
    }, [idAluno, idConselho]);

    async function salvarComentario() {
        if (!aluno || !conselho || !usuarioLogado) return;
        // Cria o registro do professor para o conselho
        const registroProfessor = new RegistroProfessorTurma();
        registroProfessor.usuario = usuarioLogado;
        registroProfessor.conselhoClasse = conselho;
        // Corrigir: garantir que turma é objeto do tipo Turma
        if (conselho.turma) {
            // Se vier como referência do Firestore
            if (typeof conselho.turma === "string") {
                const turmaId = (conselho.turma as string).split("/").pop();
                if (!turmaId) {
                    throw new Error("ID da turma não encontrado na referência.");
                }
                const turmaObj = await turmaDAO.getOne(turmaId);
                registroProfessor.turma = turmaObj;
            } else if ((conselho.turma as any).id) {
                // Se vier como objeto já formatado
                registroProfessor.turma = conselho.turma;
            } else {
                // Fallback: não faz nada ou lança erro
                throw new Error("Turma do conselho em formato inesperado");
            }
        }
        registroProfessor.data = new Date();
        // Os outros campos podem ser preenchidos conforme necessário

        const registro = new RegistroProfessorDescricao();
        registro.aluno = aluno;
        registro.registroProfessor = registroProfessor;
        registro.observacao = observacao;
        registro.dataCriacao = new Date();
        registro.dataModificacao = new Date();
        await registroProfessorDescricaoDAO.inserir(registro);
        alert("Comentário salvo!");
        router.back();
    }

    if (carregando) return <div>Carregando...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="bg-blue-100 rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Adicionar Comentário ao Conselho de Classe</h2>
                <p><strong>Aluno:</strong> {aluno?.nome}</p>
                <p><strong>Conselho:</strong> {conselho?.nome}</p>
                <textarea
                    className="w-full mt-4 p-3 border border-blue-300 rounded-lg"
                    rows={5}
                    placeholder="Digite sua observação..."
                    value={observacao}
                    onChange={e => setObservacao(e.target.value)}
                />
                <button
                    className="mt-6 bg-blue-600 text-white py-2 px-8 rounded-full font-semibold shadow hover:bg-blue-700"
                    onClick={salvarComentario}
                >Salvar Comentário</button>
            </div>
        </div>
    );
}