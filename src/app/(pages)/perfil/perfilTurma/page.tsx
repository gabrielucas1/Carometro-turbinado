"use client"

import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO"
import turmaDAO from "@/DAOs/TurmaDAO"
import registroProfessorTurmaDAO from "@/DAOs/RegistroProfessorTurmaDAO"
import Aluno from "@/model/Aluno"
import Turma from "@/model/Turma"
import RegistroProfessorTurma from "@/model/RegistroProfessorTurma"
import Usuario from "@/model/Usuario" // Supondo que você tenha um DAO para usuários
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import FBAutentication from "@/DAOs/FBAutentication"
import { UserContext } from "@/contexts/UserContext"
import jsPDF from "jspdf"
import RegistroVidaAluno from "@/model/RegistroVidaAluno"
import registroVidaAlunoDAO from "@/DAOs/RegistroVidaAlunoDAO"
import TipoRegistro from "@/model/Enums/TipoRegistro"
import Breadcrumbs, { BreadcrumbItem, createHierarchicalBreadcrumbs } from "@/components/Breadcrumbs"

export default function PerfilTurma() {
    const [turma, setTurma] = useState<Turma>(new Turma)
    const [alunos, setAlunos] = useState<Aluno[]>([])

    //REGISTRO DO PROFESSOR DA TURMA
    const [registrosTurma, setRegistrosTurma] = useState<RegistroProfessorTurma[]>([])

    //REGISTRO DO PROFESSOR DO ALUNO
    const [registrosAluno, setRegistrosAluno] = useState<RegistroVidaAluno[]>([])

    const [disciplina, setDisciplina] = useState("")
    const [periodo, setPeriodo] = useState("")
    const [revisaoGeral, setRevisaoGeral] = useState("")
    const router = useRouter()
    const [nome, setNome] = useState("")
    const { usuarioLogado } = useContext(UserContext);

    //[key: string]: string DEFINE QUE O OBJETO TERÁ APENAS STRINGS
    const [observacoes, setObservacoes] = useState<{ [key: string]: string }>({})

    //PEGANDO ID DA TURMA QUE VEIO DA URL
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        const carregarDados = async () => {
            console.log("[DEBUG] ID da turma recebido:", id);
            
            if (!id || id === 'undefined') {
                console.error("[ERROR] ID da turma inválido");
                alert("ID da turma inválido");
                router.push('/cursos');
                return;
            }

            try {
                // Buscar a turma
                console.log("[DEBUG] Buscando turma com ID:", id);
                const turmaBuscada = await turmaDAO.getOne(id);
                console.log("[DEBUG] Turma buscada:", turmaBuscada);
                
                if (!turmaBuscada) {
                    throw new Error("Turma não encontrada");
                }
                
                setTurma(turmaBuscada);
                setNome(turmaBuscada.nome);

                // Buscar os alunos da turma
                console.log("[DEBUG] Buscando alunos da turma:", id);
                const alunosBuscados = await turmaAlunoDAO.getAlunos(id);
                console.log("[DEBUG] Alunos encontrados:", alunosBuscados);
                setAlunos(alunosBuscados);

                // Buscar registros dos alunos
                const registrosTemp: RegistroVidaAluno[] = [];
                for (const aluno of alunosBuscados) {
                    try {
                        console.log(`[DEBUG] Buscando registros do aluno ${aluno.id} na turma ${id}`);
                        const registros = await registroVidaAlunoDAO.getAllByAlunoAndTurma(aluno.id, id);
                        console.log(`[DEBUG] Registros encontrados para aluno ${aluno.id}:`, registros);
                        registrosTemp.push(...registros);
                    } catch (error) {
                        console.error(`[ERROR] Erro ao buscar registros do aluno ${aluno.id}:`, error);
                    }
                }
                setRegistrosAluno(registrosTemp);

                // Buscar registros do professor da turma
                console.log("[DEBUG] Buscando registros do professor da turma");
                const todosRegistros = await registroProfessorTurmaDAO.getAll();
                const registrosFiltrados = todosRegistros.filter(registro => 
                    registro.turma.idTurma === id || registro.turma.idTurma === id
                );
                console.log("[DEBUG] Registros do professor filtrados:", registrosFiltrados);
                setRegistrosTurma(registrosFiltrados);

            } catch (error: any) {
                console.error("[ERROR] Erro ao carregar dados:", error);
                const mensagem = error?.message ?? String(error);
                alert(`Erro ao carregar dados: ${mensagem}`);
            }
        }

        carregarDados();
    }, [id]);

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        setNome(event.target.value)
    }

    async function salvar(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const turmaAtualizada = new Turma();
            turmaAtualizada.nome = nome;
            turmaAtualizada.curso = turma.curso;
            turmaAtualizada.idTurma = turma.idTurma;
            turmaAtualizada.idCurso = turma.idCurso;
            
            console.log("[DEBUG] Atualizando turma:", turmaAtualizada);
            await turmaDAO.update(turmaAtualizada);
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async function excluir() {
        try {
            if (!turma.idTurma) {
                throw new Error("ID da turma não encontrado");
            }
            console.log("[DEBUG] Excluindo turma:", turma.idTurma);
            await turmaDAO.deletar(turma.idTurma);
            router.push('/cursos');
        } catch (error: any) {
            console.error("[ERROR] Erro ao excluir turma:", error);
            alert(`Erro ao excluir turma: ${error.message}`);
        }
    }

    //RELACIONA A NOVA OBSERVAÇÃO AO ALUNO NO ARRAY DE OBSERVAÇÕES
    function handleObservacaoChange(event: ChangeEvent<HTMLInputElement>, idAluno: string) {
        const novaObservacao = event.target.value
        setObservacoes({ ...observacoes, [idAluno]: novaObservacao })
    }

    async function adicionarRegistroProfessorTurma(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const novoRegistroProfessorTurma = new RegistroProfessorTurma()
            novoRegistroProfessorTurma.disciplina = disciplina
            novoRegistroProfessorTurma.periodo = periodo
            novoRegistroProfessorTurma.usuario = usuarioLogado
            novoRegistroProfessorTurma.turma = turma
            novoRegistroProfessorTurma.revisaoGeral = revisaoGeral

            const idRegistroProfessorTurma = await registroProfessorTurmaDAO.inserir(novoRegistroProfessorTurma)

            // Adicionar um RegistroProfessorAluno para cada aluno
            for (const aluno of alunos) {
                const novoRegistroVidaAluno = new RegistroVidaAluno()
                novoRegistroVidaAluno.idAluno = aluno.id
                novoRegistroVidaAluno.descricao = observacoes[aluno.id]
                novoRegistroVidaAluno.nomeProfessor = usuarioLogado.nome
                novoRegistroVidaAluno.tipoRegistro = TipoRegistro.DETALHE
                await registroVidaAlunoDAO.inserir(novoRegistroVidaAluno)
            }

            alert('Registros de professor adicionados com sucesso!')
        } catch (e: any) {
            console.log(e.message)
        }
    }

    function navegarPerfil(idAluno: string) {
        router.push(`/perfil/perfilAluno?id=${idAluno}`)
    }

    function navegarListaAlunos() {
        router.push(`/listas/listaAlunos?idTurmaAddAluno=${id}`)
    }

    function handleDisciplinaChange(event: ChangeEvent<HTMLInputElement>) {
        setDisciplina(event.target.value)
    }

    function handlePeriodoChange(event: ChangeEvent<HTMLInputElement>) {
        setPeriodo(event.target.value)
    }

    function handleRevisaoGeralChange(event: ChangeEvent<HTMLInputElement>) {
        setRevisaoGeral(event.target.value)
    }

    async function gerarRelatorio() {
        try {
            console.log("Iniciando geração do relatório...");
            console.log("Registros do aluno:", registrosAluno);
            console.log("Registros da turma:", registrosTurma);

            const doc = new jsPDF();

            // Dimensões da página (em milímetros)
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setLineWidth(1.1);

            // Desenhar um retângulo ao redor da página (x, y, largura, altura)
            doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

            const lineHeight = 10;
            let yPosition = 20;
            let xPosition = 10;

            doc.text(`Relatórios da turma: ${turma.nome || "Nome não disponível"}`, xPosition, yPosition);
            yPosition += lineHeight * 2;

            // Adicionar registros da turma primeiro
            const registrosDaTurma = registrosTurma.filter(r => 
                r.turma.idTurma === turma.idTurma || r.turma.idTurma === turma.idTurma
            );
            
            if (registrosDaTurma.length > 0) {
                doc.text('=== REGISTROS DA TURMA ===', xPosition, yPosition);
                yPosition += lineHeight;

                registrosDaTurma.forEach((registro) => {
                    // Verificar se há espaço suficiente
                    if (yPosition + lineHeight * 4 > pageHeight - 10) {
                        doc.addPage();
                        doc.setLineWidth(1.1);
                        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
                        yPosition = 20;
                    }

                    doc.text(`Tipo: ${registro.tipoRegistro || "Não especificado"}`, xPosition, yPosition);
                    yPosition += lineHeight;
                    doc.text(`Professor: ${registro.usuario?.nome || "Não especificado"}`, xPosition, yPosition);
                    yPosition += lineHeight;
                    doc.text(`Descrição: ${registro.revisaoGeral || "Não especificado"}`, xPosition, yPosition);
                    yPosition += lineHeight;
                    if (registro.disciplina) {
                        doc.text(`Disciplina: ${registro.disciplina}`, xPosition, yPosition);
                        yPosition += lineHeight;
                    }
                    if (registro.periodo) {
                        doc.text(`Período: ${registro.periodo}`, xPosition, yPosition);
                        yPosition += lineHeight;
                    }
                    doc.text('-----------------------------------', xPosition, yPosition);
                    yPosition += lineHeight * 1.5;
                });
            }

            // Adicionar registros dos alunos
            if (registrosAluno.length > 0) {
                yPosition += lineHeight;
                doc.text('=== REGISTROS DOS ALUNOS ===', xPosition, yPosition);
                yPosition += lineHeight;

                for (const registro of registrosAluno) {
                    // Verificar se há espaço suficiente
                    if (yPosition + lineHeight * 5 > pageHeight - 10) {
                        doc.addPage();
                        doc.setLineWidth(1.1);
                        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
                        yPosition = 20;
                    }

                    let dataFormatada = "Data não disponível";
                    try {
                        if (registro.data) {
                            // Tentar diferentes formatos de data
                            const data = typeof registro.data === 'string' ? new Date(registro.data) : registro.data;
                            if (data instanceof Date && !isNaN(data.getTime())) {
                                dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).format(data);
                            }
                        }
                    } catch (e) {
                        console.error("Erro ao formatar data:", e);
                    }

                    doc.text(`Data: ${dataFormatada}`, xPosition, yPosition);
                    yPosition += lineHeight;
                    doc.text(`Tipo: ${registro.tipoRegistro || "Tipo não especificado"}`, xPosition, yPosition);
                    yPosition += lineHeight;
                    doc.text(`Professor: ${registro.nomeProfessor || "Nome não especificado"}`, xPosition, yPosition);
                    yPosition += lineHeight;
                    doc.text(`Descrição: ${registro.descricao || "Descrição não especificada"}`, xPosition, yPosition);
                    yPosition += lineHeight;
                    doc.text('-----------------------------------', xPosition, yPosition);
                    yPosition += lineHeight * 1.5;
                }
            }

            if (registrosTurma.filter(r => r.turma.idTurma === turma.idTurma).length === 0 && registrosAluno.length === 0) {
                doc.text('Nenhum registro encontrado para esta turma.', xPosition, yPosition);
            }

            // Salvar o PDF
            doc.save(`relatorio-turma-${turma.nome || 'sem-nome'}.pdf`);
            console.log("Relatório gerado com sucesso!");

        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            alert("Erro ao gerar relatório. Verifique o console para mais detalhes.");
        }
    }

    // Breadcrumbs ajustado para navegação correta
    const idCurso = turma.curso?.id ?? "";
    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Cursos", href: "/listas/listaCursos" },
        turma.curso && { label: turma.curso.nome ?? "ADS", isActive: false },
        { label: "Turmas", href: `/listas/listaTurmas?idCurso=${idCurso}` },
        { label: turma.nome ?? "Turma", isActive: true }
    ].filter(Boolean) as BreadcrumbItem[];

    return (
        <>
            <div className="min-h-screen bg-white flex flex-col items-center py-10">
                <div className="w-full max-w-3xl bg-blue-50 rounded-2xl shadow-lg p-8 mb-10 flex flex-col items-center">
                    <Breadcrumbs items={breadcrumbItems} />
                    <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Perfil da Turma</h1>
                    <div className="text-2xl text-gray-700 font-semibold mb-2">{turma.nome}</div>
                </div>

                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mb-10">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Registros da Turma</h2>
                    <div className="flex flex-col gap-4 items-center">
                        {registrosTurma.filter(r => r.turma.idTurma === turma.idTurma).length > 0 ? (
                            registrosTurma.filter(r => r.turma.idTurma === turma.idTurma).map((registro) => (
                                <div key={registro.id} className="bg-blue-100 rounded-xl p-4 shadow flex flex-col gap-2 w-full max-w-md border border-blue-300">
                                    <span className="font-bold text-lg text-blue-700">Tipo: {registro.tipoRegistro}</span>
                                    <span className="text-gray-600">{registro.revisaoGeral}</span>
                                    <span className="text-gray-600">Professor: {registro.usuario?.nome}</span>
                                    {registro.disciplina && <span className="text-gray-600">Disciplina: {registro.disciplina}</span>}
                                    {registro.periodo && <span className="text-gray-600">Período: {registro.periodo}</span>}
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500">Nenhum registro encontrado para esta turma.</span>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mb-10">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Registros da Turma</h2>
                    <button
                        onClick={() => router.push(`/adicionar/addRegistroTurma?idTurma=${id}`)}
                        className="mt-4 text-lg bg-[#3579FF] py-3 px-12 text-white rounded-full hover:px-16 transition-all duration-200 font-bold shadow"
                    >
                        Adicionar registro
                    </button>
                </div>

                <button onClick={gerarRelatorio} className="fixed right-3 bottom-3 p-4 bg-[#3579FF] text-white rounded-full hover:px-7 transition-all duration-200 font-bold shadow-lg">Gerar relatório</button>
            </div>
        </>
    )
}