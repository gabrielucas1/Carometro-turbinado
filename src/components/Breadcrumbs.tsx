"use client";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const router = useRouter();
    // Buscar tipo de usuário logado do localStorage (SSR-safe)
    let telaInicial = "/telaInicial";
    if (typeof window !== "undefined") {
        const tipo = localStorage.getItem("tipoUsuario");
        if (tipo === "admGeral") telaInicial = "/telaInicial/telaADMGeral";
        else if (tipo === "admEscola") telaInicial = "/telaInicial/telaADMEscola";
        else if (tipo === "funcionario") telaInicial = "/telaInicial/telaFuncionario";
    }
    const handleNavigation = (href?: string) => {
        if (href) {
            router.push(href);
        }
    };

    return (
        <nav className="w-full flex items-center mb-8">
            <ol className="flex items-center space-x-2 text-lg">
                {/* Home sempre presente */}
                <li className="flex items-center">
                    <button
                        onClick={() => handleNavigation(telaInicial)}
                        className="flex items-center text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <HomeIcon className="w-6 h-6 mr-2" />
                        Início
                    </button>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRightIcon className="w-5 h-5 text-gray-400 mx-1" />
                        {item.isActive || !item.href ? (
                            <span className="text-lg font-semibold text-blue-700 cursor-default">
                                {item.label}
                            </span>
                        ) : (
                            <button
                                onClick={() => handleNavigation(item.href)}
                                className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                {item.label}
                            </button>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

// Hook para gerar breadcrumbs automaticamente baseado na rota
export function useBreadcrumbs(customItems?: BreadcrumbItem[]) {
    if (customItems) {
        return customItems;
    }

    // Aqui você pode implementar lógica para gerar breadcrumbs baseado na URL atual
    // Por enquanto, retorna array vazio para usar breadcrumbs customizados
    return [];
}

// Função utilitária para criar breadcrumbs hierárquicos comuns
export function createHierarchicalBreadcrumbs(
    escola?: { id: string; nome: string },
    curso?: { id: string; nome: string },
    turma?: { id: string; nome: string },
    aluno?: { id: string; nome: string }
): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [];

    // Sempre começar com escolas
    items.push({ label: "Escolas", href: "/listas/listaEscolas" });

    if (escola) {
        items.push({
            label: escola.nome,
            href: `/perfil/perfilEscola?id=${escola.id}`
        });

        if (curso) {
            items.push({ label: "Cursos", href: `/listas/listaCursos?idEscola=${escola.id}` });
            items.push({
                label: curso.nome,
                href: `/perfil/perfilCurso?id=${curso.id}`
            });

            if (turma) {
                items.push({ label: "Turmas", href: `/listas/listaTurmas?idCurso=${curso.id}` });
                items.push({
                    label: turma.nome,
                    href: `/perfil/perfilTurma?id=${turma.id}`
                });

                if (aluno) {
                    items.push({ label: "Alunos", href: `/listas/listaAlunos?idTurma=${turma.id}` });
                    items.push({
                        label: aluno.nome,
                        isActive: true
                    });
                } else {
                    // Se estamos na turma, ela é ativa
                    items[items.length - 1].isActive = true;
                }
            } else {
                // Se estamos no curso, ele é ativo
                items[items.length - 1].isActive = true;
            }
        } else {
            // Se estamos na escola, ela é ativa
            items[items.length - 1].isActive = true;
        }
    }

    return items;
}
