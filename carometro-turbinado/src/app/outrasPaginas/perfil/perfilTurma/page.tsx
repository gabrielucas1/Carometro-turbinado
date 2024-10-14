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
import RegistroProfessorAluno from "@/model/RegistroProfessorAluno"
import registroProfessorAlunoDAO from "@/DAOs/RegistroProfessorAlunoDAO"
import jsPDF from "jspdf"
import RegistroVidaAluno from "@/model/RegistroVidaAluno"
import registroVidaAlunoDAO from "@/DAOs/RegistroVidaAlunoDAO"

export default function PerfilTurma() {
    const [turma, setTurma] = useState<Turma>(new Turma)
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [registros, setRegistros] = useState<RegistroVidaAluno[]>([])
    const [disciplina, setDisciplina] = useState("")
    const [periodo, setPeriodo] = useState("")
    const [revisaoGeral, setRevisaoGeral] = useState("")
    const router = useRouter()
    const [nome, setNome] = useState("")
    const { usuarioLogado, atualizarUsuarioLogado } = useContext(UserContext);
    const [observacoes, setObservacoes] = useState<{ [key: string]: string }>({}) // Estado para observações

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

                // Para cada aluno, buscar o registro de vida (relatório)
                const registrosTemp: RegistroVidaAluno[] = []; // Array temporário para armazenar registros
                for (const aluno of alunos) {
                    try {
                        const registro = await registroVidaAlunoDAO.getOne(aluno.id); // Chame o método passando o ID do aluno
                        registrosTemp.push(registro); // Adiciona o registro ao array temporário
                    } catch (e: any) {
                        console.log(`Erro ao buscar registro para o aluno ${aluno.id}: ${e.message}`);
                    }
                }
                setRegistros(registrosTemp); // Atualiza o estado com os registros
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

    function handleObservacaoChange(event: ChangeEvent<HTMLInputElement>, alunoId: string) {
        setObservacoes({ ...observacoes, [alunoId]: event.target.value })
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
                const novoRegistroProfessorAluno = new RegistroProfessorAluno()
                novoRegistroProfessorAluno.registroProfessorTurma = await registroProfessorTurmaDAO.getOne(idRegistroProfessorTurma)
                novoRegistroProfessorAluno.aluno = aluno
                novoRegistroProfessorAluno.observacao = observacoes[aluno.id] || ""

                await registroProfessorAlunoDAO.inserir(novoRegistroProfessorAluno)
            }

            alert('Registros de professor adicionados com sucesso!')
        } catch (e: any) {
            console.log(e.message)
        }
    }

    function navegarPerfil(idAluno: string) {
        router.push(`/outrasPaginas/perfil/perfilAluno?id=${idAluno}`)
    }

    function navegarListaAlunos() {
        router.push(`/outrasPaginas/listas/listaAlunos?id=${id}`)
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

        // Adicionar título
        doc.text('Relatório de Alunos', 10, 10);
        let yPosition = 20; // Posição inicial após o título
        const lineHeight = 10;

        for (const aluno of alunos) {
            // Adicionar atributos do aluno ao PDF
            // Se a posição Y for muito baixa, adicionar nova página
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 10; // Reiniciar a posição Y
            }

            doc.text(`Nome: ${aluno.nome}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Data de Nascimento: ${aluno.dataNascimento}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Telefone: ${aluno.telefone}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`CEP: ${aluno.cep}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Rua: ${aluno.rua}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Bairro: ${aluno.bairro}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Número: ${aluno.numeroEndereco}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Estado: ${aluno.estado}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Cidade: ${aluno.cidade}`, 10, yPosition);
            yPosition += lineHeight;
            doc.text(`Complemento: ${aluno.complemento}`, 10, yPosition);

            // Adicionar um título para a seção de registros
            yPosition += lineHeight * 2;
            doc.text('Registros de Vida do Aluno:', 10, yPosition);
            yPosition += lineHeight * 2;


            // Iterar sobre os registros e adicioná-los ao PDF
            registros.forEach((registro, index) => {
                // Se a posição Y for muito baixa, adicionar nova página
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 10; // Reiniciar a posição Y
                }

                doc.text(`Registro ${index + 1}`, 10, yPosition);
                yPosition += lineHeight * 1.5;
                doc.text(`Tipo: ${registro.tipoRegistro}`, 10, yPosition);
                yPosition += lineHeight;
                doc.text(`Descrição: ${registro.descricao}`, 10, yPosition);
                yPosition += lineHeight;
            });

            // Adicionar um espaço entre os alunos
            yPosition += lineHeight * 3;
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
                                <input id={`observacao-${aluno.id}`} onChange={(e) => handleObservacaoChange(e, aluno.id)} className="border-gray-400 p-1 border-2 rounded w-full h-9" value={observacoes[aluno.id] || ""} />
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
