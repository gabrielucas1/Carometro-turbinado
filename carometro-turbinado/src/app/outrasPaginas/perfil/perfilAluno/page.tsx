"use client"

import alunoDAO from "@/DAOs/AlunoDAO"
import registroVidaAlunoDAO from "@/DAOs/RegistroVidaAlunoDAO"
import { storage } from "@/firebase/firebase"
import Aluno from "@/model/Aluno"
import RegistroVidaAluno from "@/model/RegistroVidaAluno"
import { getDownloadURL, ref } from "firebase/storage"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useEffect, useState } from "react"

interface ValorInput {
    nome: string
    cep: string
    rua: string
    bairro: string
    numeroEndereco: string
    estado: string
    cidade: string
    complemento: string
    telefone: string
    dataNascimento: string
}

export default function PerfilAluno() {
    const router = useRouter()
    const [registros, setRegistros] = useState<RegistroVidaAluno[]>([])
    const [aluno, setAluno] = useState<Aluno>(new Aluno)
    const [valorInput, setValorInput] = useState<ValorInput>({
        nome: "",
        cep: "",
        rua: "",
        bairro: "",
        numeroEndereco: "",
        estado: "",
        cidade: "",
        complemento: "",
        telefone: "",
        dataNascimento: "",
    })

    // PEGANDO ID DO ALUNO QUE VEIO DA TELA LISTA ALUNOS
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        if (id) {
            alunoDAO.getOne(id).then((alunoBuscado) => {
                setAluno(alunoBuscado)
                setValorInput({
                    nome: alunoBuscado.nome,
                    cep: alunoBuscado.cep,
                    rua: alunoBuscado.rua,
                    bairro: alunoBuscado.bairro,
                    numeroEndereco: alunoBuscado.numeroEndereco,
                    estado: alunoBuscado.estado,
                    cidade: alunoBuscado.cidade,
                    complemento: alunoBuscado.complemento,
                    telefone: alunoBuscado.telefone,
                    dataNascimento: alunoBuscado.dataNascimento,
                })
            }).catch((e) => {
                console.log(e.message)
            })

            registroVidaAlunoDAO.getAll().then((registros) => {
                setRegistros(registros)
            }).catch((e) => {
                console.log(e.message)
            })
        }
    }, [id])

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target

        setValorInput((prevState) => ({
            ...prevState,
            [id]: value,
        }))
    }

    async function salvar(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const alunoAtualizado = new Aluno()
            alunoAtualizado.id = aluno.id
            alunoAtualizado.nome = valorInput.nome
            alunoAtualizado.cep = valorInput.cep
            alunoAtualizado.rua = valorInput.rua
            alunoAtualizado.bairro = valorInput.bairro
            alunoAtualizado.numeroEndereco = valorInput.numeroEndereco
            alunoAtualizado.estado = valorInput.estado
            alunoAtualizado.cidade = valorInput.cidade
            alunoAtualizado.complemento = valorInput.complemento
            alunoAtualizado.telefone = valorInput.telefone
            alunoAtualizado.dataNascimento = valorInput.dataNascimento

            await alunoDAO.update(alunoAtualizado)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    async function excluir() {
        try {
            await alunoDAO.deletar(aluno.id)
        } catch (e: any) {
            console.log(e.message)
        }
    }

    function adicionarRegistroVidaAluno() {
        router.push(`/outrasPaginas/adicionar/addRegistroVidaAluno?id=${id}`)
    }

    async function gerarRelatorio() {
        const doc = new jsPDF();

        // Dimensões da página (em milímetros)
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setLineWidth(1.1);

        // Desenhar um retângulo ao redor da página (x, y, largura, altura)
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);  // Ajustar as margens de acordo com a necessidade

        const response = await fetch(aluno.fotoUrl);

        //IMG.SRC SÓ ACEITA TIPO BLOB, POR ISSO A CONVERSÃO
        const blob = await response.blob();
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        doc.addImage(img, 'JPEG', 10, 10, 40, 50);

        const lineHeight = 10;
        let yPosition = 20;
        let xPosition = 56;

        doc.text(`Nome: ${aluno.nome}`, xPosition, yPosition);
        yPosition += lineHeight
        doc.text(`Data de Nascimento: ${aluno.dataNascimento}`, xPosition, yPosition);
        yPosition += lineHeight
        doc.text(`Cidade: ${aluno.cidade}`, xPosition, yPosition);

        // doc.text(`Telefone: ${aluno.telefone}`, 10, yPosition);
        // yPosition += lineHeight;
        // doc.text(`CEP: ${aluno.cep}`, 10, yPosition);
        // yPosition += lineHeight;
        // doc.text(`Rua: ${aluno.rua}`, 10, yPosition);
        // yPosition += lineHeight;
        // doc.text(`Bairro: ${aluno.bairro}`, 10, yPosition);
        // yPosition += lineHeight;
        // doc.text(`Número: ${aluno.numeroEndereco}`, 10, yPosition);
        // yPosition += lineHeight;
        // doc.text(`Estado: ${aluno.estado}`, 10, yPosition);
        // yPosition += lineHeight;
        // doc.text(`Complemento: ${aluno.complemento}`, 10, yPosition);

        xPosition = 10
        yPosition = 76
        doc.text('Registros da Vida do Aluno:', 10, yPosition);
        yPosition += lineHeight + 6;

        registros.forEach((registro, index) => {
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
        });

        doc.save('relatorio-aluno-com-registros.pdf');
    }



    return (
        <>
            <section className="w-full flex flex-col justify-center items-center">
                <h1 className="mt-4 text-2xl">Perfil do Aluno</h1>

                <img src={aluno.fotoUrl} className="h-20" alt="Foto do Aluno" />

                <form onSubmit={salvar} className="flex flex-col items-center h-full w-full px-96">
                    <label htmlFor="nome" className="mt-6 mb-1 self-start">Nome</label>
                    <input onChange={getInput} id="nome" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.nome} />

                    <label htmlFor="cep" className="mt-6 mb-1 self-start">CEP</label>
                    <input onChange={getInput} id="cep" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.cep} />

                    <label htmlFor="rua" className="mt-6 mb-1 self-start">Rua</label>
                    <input onChange={getInput} id="rua" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.rua} />

                    <label htmlFor="bairro" className="mt-6 mb-1 self-start">Bairro</label>
                    <input onChange={getInput} id="bairro" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.bairro} />

                    <label htmlFor="numeroEndereco" className="mt-6 mb-1 self-start">Número</label>
                    <input onChange={getInput} id="numeroEndereco" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.numeroEndereco} />

                    <label htmlFor="estado" className="mt-6 mb-1 self-start">Estado</label>
                    <input onChange={getInput} id="estado" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.estado} />

                    <label htmlFor="cidade" className="mt-6 mb-1 self-start">Cidade</label>
                    <input onChange={getInput} id="cidade" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.cidade} />

                    <label htmlFor="complemento" className="mt-6 mb-1 self-start">Complemento</label>
                    <input onChange={getInput} id="complemento" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.complemento} />

                    <label htmlFor="telefone" className="mt-6 mb-1 self-start">Telefone</label>
                    <input onChange={getInput} id="telefone" className="border-gray-400 p-1 border-2 rounded w-full h-9" value={valorInput.telefone} />

                    <label htmlFor="dataNascimento" className="mt-6 mb-1 self-start">Data de Nascimento</label>
                    <input onChange={getInput} id="dataNascimento" className="border-gray-400 mb-6 p-1 border-2 rounded w-full h-9" value={valorInput.dataNascimento} />

                    <div className="mt-4 mb-6 flex space-x-10">
                        <button onClick={excluir} className="text-lg bg-red-500 py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Excluir</button>
                        <button type="submit" className="text-lg bg-[#3579FF] py-2 px-10 text-white rounded-full hover:px-12 transition-all duration-200">Salvar</button>
                    </div>
                </form>

            </section>

            <section className="border-t-2 border-black w-full flex flex-col justify-center items-center">
                <h2 className="mt-6 text-xl">Observações</h2>

                {registros.map((registro) => (
                    <div key={registro.id} className="bg-blue-400 rounded w-96 h-20 mt-8 p-4 flex flex-col hover:w-[26rem] transition-all cursor-pointer">
                        <p>{`TipoRegistro: ${registro.tipoRegistro}`}</p>
                        <p>{`Descrição: ${registro.descricao}`}</p>
                    </div>
                ))}

                <button onClick={adicionarRegistroVidaAluno} className="mt-8 mb-8 text-lg bg-[#3579FF] py-2 px-6 text-white rounded-full hover:px-8 transition-all duration-200">Adicionar registro</button>
            </section>
            <button onClick={gerarRelatorio} className="fixed right-3 bottom-3 p-3 bg-[#3579FF] text-white rounded-full hover:px-5 transition-all duration-200">Gerar relatório</button>
        </>
    )
}