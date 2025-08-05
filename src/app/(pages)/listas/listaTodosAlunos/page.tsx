"use client";

import AlunoCard from "@/components/AlunoCard";
import alunoDAO from "@/DAOs/AlunoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import escolaDAO from "@/DAOs/EscolaDAO";
import cursoDAO from "@/DAOs/CursoDAO";
import Aluno from "@/model/Aluno";
import { useEffect, useState } from "react";
import Link from "next/link";

type AlunoComInfo = Aluno & {
    nomeTurma?: string;
    anoTurma?: string;
    nomeEscola?: string;
};

export default function ListaTodosAlunos() {
    const [listaAlunos, setListaAlunos] = useState<AlunoComInfo[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        setCarregando(true);
        async function buscarTodosAlunos() {
            try {
                const admEscola = JSON.parse(localStorage.getItem("usuario") || "null");
                const idEscolaAdm = admEscola?.idEscola?.toString().trim();
                const alunos = await alunoDAO.getAll();
                console.log("idEscolaAdm:", idEscolaAdm);
                alunos.forEach(aluno => {
                    console.log(`Aluno: ${aluno.nome} | idEscola: '${aluno.idEscola}' | Comparação: ${aluno.idEscola?.toString().trim()} === ${idEscolaAdm} =>`, aluno.idEscola?.toString().trim() === idEscolaAdm);
                });
                const alunosFiltrados = alunos.filter(aluno => aluno.idEscola?.toString().trim() === idEscolaAdm);
                setListaAlunos(alunosFiltrados);
            } catch (e: any) {
                console.log("Erro ao buscar alunos:", e.message);
            } finally {
                setCarregando(false);
            }
        }
        buscarTodosAlunos();
    }, []);

    console.log("ListaAlunos para renderizar:", listaAlunos);
    console.log(localStorage.getItem("usuarioLogado"));
    console.log(localStorage.getItem("usuario"));

    return (
        <>
            <h1 className="text-2xl mt-6 mb-4 text-center">Todos os Alunos</h1>
            {carregando ? (
                <p className="text-center">Carregando alunos...</p>
            ) : (
                <div className="flex flex-col py-6 gap-4 items-center">
                    {listaAlunos.length === 0 ? (
                        <p className="text-lg text-gray-500">Nenhum aluno cadastrado.</p>
                    ) : (
                        listaAlunos.map((aluno) => (
                            <div key={aluno.id} className="w-full max-w-xl">
                                <AlunoCard aluno={aluno} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
}