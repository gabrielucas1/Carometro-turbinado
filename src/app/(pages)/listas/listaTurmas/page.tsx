"use client";

import TurmaCard from "@/components/TurmaCard";
import turmaDAO from "@/DAOs/TurmaDAO";
import Turma from "@/model/Turma";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListaTurmas() {
    const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);
    const router = useRouter();

    // PEGANDO ID DO CURSO QUE VEIO DA TELA LISTA DE CURSOS
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        console.log("ID do curso antes de navegar:", id);
        if (!id) {
            console.error("ID do curso não encontrado na URL!");
            return;
        }

        console.log("ID do curso: ", id);
        turmaDAO
            .getByCursoId(id)
            .then((turmas) => {
                setListaTurmas(turmas);
                console.log("Turmas encontradas: ", turmas);
            })
            .catch((e) => {
                console.error("Erro ao buscar turmas:", e.message);
            });
    }, [id]);

    function navegarPerfil(idTurma: string) {
        router.push(`/perfil/perfilTurma?id=${idTurma}`);
    }

    return (
        <>
            <h1 className="text-2xl mt-6">Lista de Turmas</h1>

            <div className="flex flex-col py-6 gap-4">
                {listaTurmas.map((turma) => (
                    <div key={turma.id} className="flex items-center justify-between">
                        {/* Renderiza o card da turma */}
                        <TurmaCard turma={turma} />

                    </div>
                ))}
            </div>
                
                <button onClick={() => router.push(`/adicionar/addTurma?idCurso=${id}`)} className="absolute bottom-4 right-4 p-3 px-8 rounded-full bg-blue-400 hover:px-9 transition-all">
                    Adicionar Turma
                </button>
         
        </>
    );
}