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

        registrosTurma.forEach((registro) => {
            const professoresNoRepeat: string[] = []
            if (!professoresNoRepeat.includes(registro.usuario.nome)) {
                const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(registro.data);

                yPosition += lineHeight;
                doc.text(`========== ${dataFormatada} ==========`, xPosition, yPosition);
                yPosition += lineHeight * 1.5;
                doc.text(`Professor: ${registro.usuario}`, xPosition, yPosition);
                yPosition += lineHeight;
                doc.text(`Disciplina: ${registro.disciplina}`, xPosition, yPosition);
                yPosition += lineHeight;
                doc.text(`Período: ${registro.periodo}`, xPosition, yPosition);
                yPosition += lineHeight;
                doc.text(`Revisão Geral: ${registro.revisaoGeral}`, xPosition, yPosition);
                yPosition += lineHeight;
                doc.text(`======================================`, xPosition, yPosition);
                yPosition += lineHeight + 6;

                professoresNoRepeat.push(registro.usuario.nome)
            }
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
                if (!professoresNoRepeat.includes(registro.nomeProfessor)) {
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

                    professoresNoRepeat.push(registro.nomeProfessor);
                }
            }
        }


        // Salvar o PDF
        doc.save('relatorio-alunos-com-registros.pdf');
    }





    return (
        <>
            <button onClick={excluir} className="fixed right-6 top-6 text-lg mt-14 mb-10 bg-red-500 py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Excluir</button>
            <h1 className="mt-4 text-2xl">Perfil da turma</h1>

            <form onSubmit={salvar} className="flex flex-col items-center">

                <label htmlFor="nome" className="mt-6 mb-1 self-start">Nome</label>
                <input onChange={getInput} id="nome" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={nome} />

                <button type="submit" className="fixed right-6 top-24 text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Salvar</button>
            </form>

            <div className="border-t-2 border-black mt-10 w-full flex items-center flex-col">
                <button onClick={navegarListaAlunos} className="absolute right-2 mt-4 text-lg bg-[#3579FF] py-2 px-4 text-white rounded-full hover:px-6 transition-all duration-200">Adicionar aluno</button>
                <h2 className="text-2xl mt-4 ">Lista de Alunos</h2>

                {alunos.length > 0 && (
                    alunos.map((aluno) => (
                        <button onClick={() => navegarPerfil(aluno.id)} key={aluno.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                            <p>{`Nome: ${aluno.nome}`}</p>
                            <p>{`Data de Nascimento: ${aluno.dataNascimento}`}</p>
                        </button>
                    ))
                )}
            </div>

            <div className="border-t-2 border-black mt-10 w-full flex items-center flex-col">
                <h2 className="text-2xl mt-4">Adicionar Registro de Professor</h2>
                <form onSubmit={adicionarRegistroProfessorTurma} className="flex flex-col items-center mt-4">
                    <label htmlFor="disciplina" className="mb-1 self-start">Disciplina</label>
                    <input id="disciplina" onChange={handleDisciplinaChange} className="border-gray-400 p-1 border-2 rounded w-full h-9" value={disciplina} />

                    <label htmlFor="periodo" className="mt-4 mb-1 self-start">Período</label>
                    <input id="periodo" onChange={handlePeriodoChange} className="border-gray-400 p-1 border-2 rounded w-full h-9" value={periodo} />

                    <label htmlFor="revisaoGeral" className="mt-4 mb-1 self-start">Revisão Geral</label>
                    <input id="revisaoGeral" onChange={handleRevisaoGeralChange} className="border-gray-400 p-1 border-2 rounded w-full h-9" value={revisaoGeral} />

                    <h3 className="text-xl mt-6">Observações por Aluno</h3>
                    {alunos.length > 0 && (
                        alunos.map((aluno) => (
                            <div key={aluno.id} className="w-full">
                                <label htmlFor={`observacao-${aluno.id}`} className="mt-4 mb-1 self-start">{`Observação para ${aluno.nome}`}</label>
                                <input
                                    id={`observacao-${aluno.id}`}
                                    onChange={(e) => handleObservacaoChange(e, aluno.id)}
                                    className="border-gray-400 p-1 border-2 rounded w-full h-9"
                                    value={observacoes[aluno.id] || ''} // Pega a observação do aluno ou uma string vazia
                                />
                            </div>
                        ))
                    )}

                    <button type="submit" className="mt-6 text-lg bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Adicionar Registro</button>
                </form>
            </div>
            <button onClick={gerarRelatorio} className="fixed right-3 bottom-3 p-3 bg-[#3579FF] text-white rounded-full hover:px-5 transition-all duration-200">Gerar relatório</button>
        </>
    )
}
