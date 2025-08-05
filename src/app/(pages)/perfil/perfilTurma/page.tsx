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
    const { usuarioLogado, atualizarUsuarioLogado } = useContext(UserContext);

    //[key: string]: string DEFINE QUE O OBJETO TERÁ APENAS STRINGS
    const [observacoes, setObservacoes] = useState<{ [key: string]: string }>({})

    //PEGANDO ID DA ESCOLA QUE VEIO DA TELA LISTA ALUNOS
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            // Buscar a turma
            turmaDAO.getOne(id).then((turmaBuscada) => {
                setTurma(turmaBuscada);
                setNome(turmaBuscada.nome);
            }).catch((e) => {
                console.log(e.message);
            });

            // Buscar os alunos da turma
            turmaAlunoDAO.getAlunos(id).then(async (alunos) => {
                setAlunos(alunos);
                for (const aluno of alunos) {
                    try {
                        const registros: RegistroVidaAluno[] = await registroVidaAlunoDAO.getAll(aluno.id); // Chame o método passando o ID do aluno
                        setRegistrosAluno(registros) // Adiciona o registro ao array temporário
                    } catch (e: any) {
                        console.log(`Erro ao buscar registro para o aluno ${aluno.id}: ${e.message}`);
                    }
                }
            }).catch((e) => {
                console.log(e.message);
            });

            // Buscar os registros de professor da turma
            registroProfessorTurmaDAO.getAll().then((registros) => {
                setRegistrosTurma(registros);
            }).catch((e) => {
                console.log(e.message);
            });
        }
    }, [id]);

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        setNome(event.target.value)
    }

    async function salvar(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const turmaAtualizada = new Turma
            turmaAtualizada.nome = nome
            turmaAtualizada.curso = turma.curso
            turmaAtualizada.id = turma.id

            await turmaDAO.update(turmaAtualizada)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async function excluir() {
        try {
            await turmaDAO.deletar(turma.id)
        } catch (e: any) {
            console.log(e.message)
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
        const doc = new jsPDF();

        // Dimensões da página (em milímetros)
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setLineWidth(1.1);

        // Desenhar um retângulo ao redor da página (x, y, largura, altura)
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);  // Ajustar as margens de acordo com a necessidade

        const lineHeight = 10;
        let yPosition = 20;
        let xPosition = 10;

        doc.text(`Relatórios da turma: ${turma.nome}`, xPosition, yPosition);

        if (registrosTurma.length === 0) {
            doc.text('Nenhum registro encontrado.', xPosition, 30);
        }

        const blocoRegistroAltura = lineHeight + lineHeight * 1.5 + lineHeight * 4 + lineHeight + 6; // altura total do bloco do registro
        registrosTurma.filter(r => r.turma.id === turma.id).forEach((registro) => {
            const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(registro.data);

            // Se não houver espaço suficiente para o bloco, adiciona nova página
            if (yPosition + blocoRegistroAltura > pageHeight - 10) {
                doc.addPage();
                doc.setLineWidth(1.1);
                doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
                yPosition = 20;
                doc.text(`Relatórios da turma: ${turma.nome}`, xPosition, yPosition);
                yPosition += lineHeight;
            }

            yPosition += lineHeight;
            doc.text(`========== ${dataFormatada} ==========`, xPosition, yPosition);
            yPosition += lineHeight * 1.5;
            doc.text(`Professor: ${registro.usuario?.nome || "(não informado)"}`, xPosition, yPosition);
            yPosition += lineHeight;
            doc.text(`Disciplina: ${registro.disciplina || ""}`, xPosition, yPosition);
            yPosition += lineHeight;
            doc.text(`Período: ${registro.periodo || ""}`, xPosition, yPosition);
            yPosition += lineHeight;
            doc.text(`Revisão Geral: ${registro.revisaoGeral || ""}`, xPosition, yPosition);
            yPosition += lineHeight;
            doc.text(`======================================`, xPosition, yPosition);
            yPosition += lineHeight + 6;
        })

        for (const aluno of alunos) {
            const response = await fetch(aluno.fotoUrl);

            // IMG.SRC SÓ ACEITA TIPO BLOB, POR ISSO A CONVERSÃO
            const blob = await response.blob();
            const img = new Image();
            img.src = URL.createObjectURL(blob);



            if (yPosition > doc.internal.pageSize.getHeight() - 20) { // Checa se a posição excede a altura da página
                doc.addPage(); // Adiciona nova página
                yPosition = 20; // Reseta a posição vertical
            }

            doc.addImage(img, 'JPEG', xPosition, yPosition -10, 40, 50);

            xPosition += 46;

            doc.text(`Nome: ${aluno.nome}`, xPosition, yPosition);
            yPosition += lineHeight;
            doc.text(`Data de Nascimento: ${aluno.dataNascimento}`, xPosition, yPosition);
            yPosition += lineHeight;
            doc.text(`Cidade: ${aluno.cidade}`, xPosition, yPosition);

            xPosition = 10;

            yPosition += lineHeight * 3;

            doc.text('Registros da Vida do Aluno:', xPosition, yPosition);
            yPosition += lineHeight + 6;

            if (registrosAluno.length === 0) {
                doc.text('Nenhum registro encontrado.', xPosition, yPosition);
            }

            const professoresNoRepeat: string[] = []; // Mover a declaração para fora do loop
            for (const registro of registrosAluno) {
                const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(registro.data);

                doc.text(`========== ${dataFormatada} ==========`, xPosition, yPosition);
                yPosition += lineHeight * 1.5;
                doc.text(`Tipo: ${registro.tipoRegistro}`, xPosition, yPosition);
                yPosition += lineHeight;
                doc.text(`Professor ${registro.nomeProfessor}: ${registro.descricao}`, xPosition, yPosition);
                yPosition += lineHeight;
                doc.text(`======================================`, xPosition, yPosition);
                yPosition += lineHeight + 6;
            }
        }


        // Salvar o PDF
        doc.save('relatorio-alunos-com-registros.pdf');
    }





    return (
        <>
            <div className="min-h-screen bg-white flex flex-col items-center py-10">
                <div className="w-full max-w-3xl bg-blue-50 rounded-2xl shadow-lg p-8 mb-10 flex flex-col items-center">
                    <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Perfil da Turma</h1>
                    <div className="text-2xl text-gray-700 font-semibold mb-2">{turma.nome}</div>
                </div>

                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mb-10">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6">Registros da Turma</h2>
                    <div className="flex flex-col gap-4 items-center">
                        {registrosTurma.filter(r => r.turma.id === turma.id).length > 0 ? (
                            registrosTurma.filter(r => r.turma.id === turma.id).map((registro) => (
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