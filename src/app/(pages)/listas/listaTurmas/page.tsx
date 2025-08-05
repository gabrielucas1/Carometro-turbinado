"use client";

import TurmaCard from "@/components/TurmaCard";
import turmaDAO from "@/DAOs/TurmaDAO";
import Turma from "@/model/Turma";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import TipoUsuario from "@/model/Enums/TipoUsuario";

export default function ListaTurmas() {
    const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);
    const router = useRouter();
    const { usuarioLogado } = useContext(UserContext);

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

            {/* Botão para ADMEscola adicionar turma */}
            {usuarioLogado?.tipoUsuario === TipoUsuario.ADMESCOLA && (
                <button
                    onClick={() => router.push(`/adicionar/addTurma?idCurso=${id}`)}
                    className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 border-2 border-blue-200"
                >
                    <span className="text-2xl">➕</span>
                    <span className="text-lg">Adicionar Turma</span>
                </button>
            )}

            {/* Botão para Funcionário adicionar registro */}
            {usuarioLogado?.tipoUsuario === TipoUsuario.FUNCIONARIO && (
                <button
                    onClick={() => router.push(`/registro/selecionarTurma?idCurso=${id}`)}
                    className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-green-500 via-green-400 to-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-700 transition-all duration-200 border-2 border-green-200"
                >
                    <span className="text-2xl">📝</span>
                    <span className="text-lg">Registro</span>
                </button>
            )}
        </>
    );
}