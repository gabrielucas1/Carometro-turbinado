"use client";

import TurmaCard from "@/components/TurmaCard";
import turmaDAO from "@/DAOs/TurmaDAO";
import Turma from "@/model/Turma";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";

export default function ListaTurmas() {
    const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);
    const router = useRouter();
    const { usuarioLogado } = useContext(UserContext);

    // PEGANDO ID DO CURSO QUE VEIO DA TELA LISTA DE CURSOS
    const searchParams = useSearchParams();
    // Aceita tanto idCurso quanto id para compatibilidade, mas prioriza idCurso
    const idCurso = searchParams.get("idCurso") || searchParams.get("id");

    useEffect(() => {
        console.log("ID do curso antes de navegar:", idCurso);
        if (!idCurso) {
            console.error("ID do curso não encontrado na URL!");
            return;
        }

        console.log("ID do curso: ", idCurso);
        turmaDAO
            .getByCursoId(idCurso)
            .then((turmas) => {
                setListaTurmas(turmas);
                console.log("Turmas encontradas: ", turmas);
            })
            .catch((e) => {
                console.error("Erro ao buscar turmas:", e.message);
            });
    }, [idCurso]);

    function navegarPerfil(idTurma: string) {
        router.push(`/perfil/perfilTurma?id=${idTurma}`);
    }

    // Definir breadcrumbs
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Cursos", href: "/listas/listaCursos" },
        { label: "Turmas", isActive: true }
    ];

    return (
        <div className="flex flex-col items-center min-h-screen w-full px-4 py-10 bg-white">
            <div className="w-full max-w-3xl mx-auto">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-3xl font-extrabold text-blue-700 mb-10 text-center tracking-tight">
                    Lista de Turmas
                </h1>
                <div className="flex flex-col py-6 gap-4 items-center">
                    {listaTurmas.length === 0 ? (
                        <p className="text-lg text-gray-500 text-center">
                            Nenhuma turma cadastrada.
                        </p>
                    ) : (
                        listaTurmas.map((turma) => (
                            <div
                                key={turma.id}
                                className="flex items-center justify-center w-full max-w-lg"
                            >
                                {/* Renderiza o card da turma */}
                                <TurmaCard turma={turma} />
                            </div>
                        ))
                    )}
                </div>

                {/* Botão para ADMEscola adicionar turma */}
                {usuarioLogado?.tipoUsuario === TipoUsuario.ADMESCOLA && (
                    <button
                        onClick={() =>
                            router.push(`/adicionar/addTurma?idCurso=${idCurso}`)
                        }
                        className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 border-2 border-blue-200"
                    >
                        <span className="text-2xl">➕</span>
                        <span className="text-lg">Adicionar Turma</span>
                    </button>
                )}

                {/* Botão para Funcionário adicionar registro */}
                {usuarioLogado?.tipoUsuario === TipoUsuario.FUNCIONARIO && (
                    <button
                        onClick={() =>
                            router.push(`/registro/selecionarTurma?idCurso=${idCurso}`)
                        }
                        className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-green-500 via-green-400 to-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-700 transition-all duration-200 border-2 border-green-200"
                    >
                        <span className="text-2xl">📝</span>
                        <span className="text-lg">Registro</span>
                    </button>
                )}
            </div>
        </div>
    );
}