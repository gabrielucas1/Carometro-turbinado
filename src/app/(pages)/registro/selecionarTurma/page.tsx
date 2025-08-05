"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import turmaDAO from "@/DAOs/TurmaDAO";
import Turma from "@/model/Turma";
import RelatorioTurma from "@/components/RelatorioTurma";

export default function SelecionarTurmaRegistro() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idCurso = searchParams.get("idCurso");
    const [turmas, setTurmas] = useState<Turma[]>([]);

    useEffect(() => {
        if (!idCurso) return;
        turmaDAO.getByCursoId(idCurso)
            .then((turmasData) => setTurmas(turmasData))
            .catch(() => setTurmas([]));
    }, [idCurso]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white py-10">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl border border-gray-200 flex flex-col items-center">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">👥</span>
                    Selecione a turma para adicionar registro
                </h1>
                <div className="flex flex-col gap-6 w-full">
                    {turmas.length === 0 && <p className="text-lg text-gray-500 text-center">Nenhuma turma encontrada para este curso.</p>}
                    {turmas.map(turma => (
                        <button
                            key={turma.id}
                            onClick={() => router.push(`/perfil/perfilTurma?id=${turma.id}`)}
                            className="flex items-center gap-4 bg-green-100 text-green-900 px-8 py-5 rounded-2xl shadow hover:bg-green-200 transition-all border border-green-200 font-bold text-xl"
                        >
                            <span className="text-3xl">🏫</span>
                            <span>{turma.nome}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PerfilTurma({ searchParams }: { searchParams: { id: string } }) {
    const turmaId = searchParams.id;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Perfil da Turma</h1>
            {/* Outros detalhes da turma */}
            <RelatorioTurma turmaId={turmaId} />
        </div>
    );
}
