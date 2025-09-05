"use client";
import { UserContext } from "@/contexts/UserContext"; // Adicione esta linha
import CursoCard from "@/components/CursoCard";
import CursoDAO from "@/DAOs/CursoDAO";
import Curso from "@/model/Curso";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import { useSearchParams } from "next/navigation";

export default function ListaCursos() {
    const [listaCursos, setListaCursos] = useState<Curso[]>([]);
    const [escolas, setEscolas] = useState<{ [key: string]: string }>({}); // Mapeia escolaId para nome da escola
    const { usuarioLogado, carregando } = useContext(UserContext);
    const searchParams = useSearchParams();
    const idEscola = searchParams.get("idEscola");
    
    

    useEffect(() => {
        if(carregando) return;
            CursoDAO.getAll()
            .then((cursos) => {
                const cursosDaEscola = cursos.filter(
                    (curso) => curso.escola.id === usuarioLogado.escola.id
                );

                const escolasMap: { [key: string]: string } = {};
                cursosDaEscola.forEach((curso) => {
                    escolasMap[curso.escola.id] = curso.escola.nome;

                });

                setEscolas(escolasMap);
                setListaCursos(cursosDaEscola);
            })
            .catch((e) => {
                console.error("Erro ao buscar cursos:", e.message);
            });
        
    }, [usuarioLogado,carregando]);

    const isADMEscola = usuarioLogado?.tipoUsuario === TipoUsuario.ADMESCOLA;
    
    // Definir breadcrumbs
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Cursos", isActive: true }
    ];

    return (
        <div className="flex flex-col items-center w-full px-4 py-10 min-h-screen bg-white">
            <div className="w-full max-w-3xl mx-auto">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-4xl font-extrabold text-blue-700 mb-10 text-center tracking-tight">Cursos</h1>
                <div className="flex flex-col gap-8 items-center">
                    {listaCursos.length === 0 ? (
                        <p className="text-lg text-gray-500 text-center">Nenhum curso cadastrado.</p>
                    ) : (
                        listaCursos.map((curso) => (
                            <CursoCard
                                curso={curso}
                                key={curso.id}
                                escola={escolas[curso.escola.id] || "Escola não encontrada"}
                                usuarioLogado={usuarioLogado}
                            />
                        ))
                    )}
                </div>
                {isADMEscola && (
                    <Link href={"/adicionar/addCurso"}>
                        <button
                            className="fixed bottom-8 right-8 flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 border-2 border-blue-200"
                        >
                            <span className="text-2xl">➕</span>
                            <span className="text-lg">Adicionar Curso</span>
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}

//