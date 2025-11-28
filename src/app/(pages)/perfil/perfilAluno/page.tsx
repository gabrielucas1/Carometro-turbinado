"use client"

import alunoDAO from "@/DAOs/AlunoDAO"
import registroVidaAlunoDAO from "@/DAOs/RegistroVidaAlunoDAO"
import registroProfessorDescricaoDAO from "@/DAOs/RegistroProfessorDescricaoDAO"

import Aluno from "@/model/Aluno"
import RegistroVidaAluno from "@/model/RegistroVidaAluno"
import { getDownloadURL, ref, uploadBytes, getStorage, deleteObject } from "firebase/storage"
import jsPDF from "jspdf"
import { useRouter, useSearchParams } from "next/navigation";
import NextImage from "next/image";
import { ChangeEvent, useEffect, useState } from "react"
import { getFirestore,collection,query,where,getDocs } from "firebase/firestore"
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs"

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
    fotoUrl: string
}

export default function PerfilAluno() {
    const router = useRouter()
    const [registros, setRegistros] = useState<RegistroVidaAluno[]>([])
    const [comentariosConselho, setComentariosConselho] = useState<any[]>([])
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
        fotoUrl: "",
    })
    const [removerFoto, setRemoverFoto] = useState<boolean>(false)
    const [novaFoto, setNovaFoto] = useState<File | null>(null)

    // PEGANDO ID DO ALUNO QUE VEIO DA TELA LISTA ALUNOS
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

useEffect(() => {
    async function fetchData() {
        if (id) {
            try {
                const alunoBuscado = await alunoDAO.getOne(id)
                const db = getFirestore()
                const turmaAlunoQuery = query(collection(db, "turmaAluno"), where("idAluno", "==", id))
                const turmaAlunoSnapshot = await getDocs(turmaAlunoQuery)
                let idTurma = ""
                turmaAlunoSnapshot.forEach((doc) => {
                    idTurma = doc.data().idTurma
                })

                setAluno({ ...alunoBuscado, idTurma, idEscola: alunoBuscado.idEscola })
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
                    fotoUrl: alunoBuscado.fotoUrl || "",
                })

                const registros = await registroVidaAlunoDAO.getAll(id)
                setRegistros(registros)

                // Buscar comentários do conselho de classe para o aluno
                const comentarios = await registroProfessorDescricaoDAO.getByAluno(id)
                
                // Ordenar comentários por data em ordem decrescente (mais recente primeiro)
                comentarios.sort((a, b) => {
                    const dateA = a.dataCriacao ? new Date(a.dataCriacao) : new Date(0);
                    const dateB = b.dataCriacao ? new Date(b.dataCriacao) : new Date(0);
                    return dateB.getTime() - dateA.getTime();
                });
                
                setComentariosConselho(comentarios)
            } catch (e: any) {
                console.log(e.message)
            }
        }
    }
    fetchData()
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

        const algumCampoAlterado = aluno.nome !== valorInput.nome ||
            aluno.cep !== valorInput.cep || 
            aluno.rua !== valorInput.rua ||
            aluno.bairro !== valorInput.bairro ||
            aluno.numeroEndereco !== valorInput.numeroEndereco ||
            aluno.estado !== valorInput.estado ||
            aluno.cidade !== valorInput.cidade ||
            aluno.complemento !== valorInput.complemento ||
            aluno.telefone !== valorInput.telefone ||
            aluno.dataNascimento !== valorInput.dataNascimento ||
            novaFoto || removerFoto;

        if(!algumCampoAlterado){
            alert("Nenhum campo foi alterado")
            router.push(`/listas/listaAlunos?idTurma=${aluno.idTurma}`)
            return;
        }

        let fotoUrlFinal = aluno.fotoUrl;
        
        try {
            // Processar foto
            if (removerFoto) {
                fotoUrlFinal = "";
            } else if (novaFoto) {
                // Validar arquivo
                if (novaFoto.size > 5 * 1024 * 1024) { // 5MB
                    throw new Error("Arquivo muito grande. Máximo 5MB.");
                }
                
                // Validar tipo de arquivo
                if (!novaFoto.type.startsWith('image/')) {
                    throw new Error("Por favor, selecione apenas arquivos de imagem.");
                }
                
                // Converter para base64 (solução alternativa ao Firebase Storage)
                console.log("Convertendo imagem para base64...");
                const reader = new FileReader();
                const base64Promise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
                    reader.readAsDataURL(novaFoto);
                });
                
                fotoUrlFinal = await base64Promise;
                console.log("Conversão concluída");
            }

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
            alunoAtualizado.fotoUrl = fotoUrlFinal
            alunoAtualizado.idTurma = aluno.idTurma
            alunoAtualizado.idEscola = aluno.idEscola

            await alunoDAO.update(alunoAtualizado)
            alert("Aluno atualizado com sucesso!")
            
            // Forçar recarregamento completo da página para atualizar as listas
            const targetUrl = `/listas/listaAlunos?idTurma=${aluno.idTurma}`;
            
            // Limpar qualquer cache do browser
            if (typeof window !== 'undefined') {
                // Adicionar timestamp para evitar cache
                window.location.href = `${targetUrl}&refresh=${Date.now()}`;
            } else {
                router.push(targetUrl);
            }  
        } catch (e: any) {
            console.error("Erro detalhado:", e);
            if (e.code === 'storage/unauthorized') {
                alert("Erro de autorização. Verifique se você está logado.");
            } else if (e.code === 'storage/unknown') {
                alert("Erro no servidor do Firebase Storage. Tente novamente em alguns minutos.");
            } else if (e.message.includes("Arquivo muito grande")) {
                alert(e.message);
            } else if (e.message.includes("arquivos de imagem")) {
                alert(e.message);
            } else {
                alert("Erro ao atualizar aluno: " + e.message);
            }
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
        router.push(`/adicionar/addRegistroVidaAluno?id=${id}`)
    }

    async function gerarRelatorio() {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        function desenharBorda() {
            doc.setLineWidth(1.1);
            doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
        }

        desenharBorda();
        doc.setFontSize(28);
        doc.setTextColor(0, 0, 0);
        doc.text(aluno.nome, pageWidth / 2, 30, { align: 'center' });
        doc.setFontSize(12);

        const response = await fetch(aluno.fotoUrl);
        const blob = await response.blob();
        const img = new globalThis.Image();
        img.src = URL.createObjectURL(blob);
        doc.addImage(img, 'JPEG', 20, 40, 50, 50);

        let yPosition = 105;
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Registro Acadêmico', pageWidth / 2, yPosition, { align: 'center' });
        doc.setFontSize(12);
        yPosition += 10;

        registros.forEach((registro) => {
            const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }).format(registro.data);

            doc.setFont('helvetica', 'bold');
            doc.text(`${dataFormatada}`, 20, yPosition);
            doc.setFont('helvetica', 'normal');
            yPosition += 7;

            doc.text(`Evento: ${registro.tipoRegistro}`, 30, yPosition);
            yPosition += 7;

            doc.text(`Descrição: ${registro.descricao}`, 30, yPosition);
            yPosition += 7;

            if (registro.nomeProfessor) {
                doc.text(`Professor: ${registro.nomeProfessor}`, 30, yPosition);
                yPosition += 7;
            }

            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 10;

            if (yPosition > pageHeight - 20) {
                doc.addPage();
                desenharBorda();
                yPosition = 20;
            }
        });

        doc.setTextColor(0, 0, 0);
        doc.text('CONSELHO DE CLASSE', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        if (comentariosConselho.length === 0) {
            doc.text('Nenhum registro de conselho disponível.', 30, yPosition);
            yPosition += 10;
        } else {
            // Buscar nomes dos conselhos antes de gerar o relatório
            const conselhoClasseDAO = (await import("@/DAOs/ConselhoClasseDAO")).default;
            
            // Processar e filtrar comentários válidos
            const comentariosValidos = [];
            
            for (const comentario of comentariosConselho) {
                // Extrair ID do conselho de diferentes formas possíveis
                let conselhoId = null;
                
                if (comentario.conselhoClasse?.id) {
                    conselhoId = comentario.conselhoClasse.id;
                } else if (typeof comentario.conselhoClasse === 'string') {
                    conselhoId = comentario.conselhoClasse.split('/').pop();
                } else if (comentario.registroProfessor?.conselhoClasse?.id) {
                    conselhoId = comentario.registroProfessor.conselhoClasse.id;
                }
                
                console.log(`[DEBUG] Processando comentário - ID do conselho: ${conselhoId}`);

                if (conselhoId) {
                    try {
                        const conselhoObj = await conselhoClasseDAO.getOne(conselhoId);
                        
                        // Formatar a data do conselho
                        let dataConselho = 'Data não disponível';
                        if (conselhoObj.dataCriacao) {
                            dataConselho = new Intl.DateTimeFormat('pt-BR', {
                                day: '2-digit',
                                month: '2-digit', 
                                year: 'numeric'
                            }).format(conselhoObj.dataCriacao);
                        }
                        
                        comentariosValidos.push({
                            ...comentario,
                            nomeConselho: conselhoObj.nome || 'Conselho sem nome',
                            dataConselho: dataConselho,
                            dataCriacaoConselho: conselhoObj.dataCriacao
                        });
                        
                        console.log(`[DEBUG] Conselho encontrado: ${conselhoObj.nome} - ${dataConselho}`);
                    } catch (error) {
                        console.error(`[ERROR] Conselho com ID ${conselhoId} não encontrado:`, error);
                        // Não adicionar à lista de comentários válidos
                    }
                } else {
                    console.warn(`[WARN] Comentário sem ID de conselho válido:`, comentario);
                }
            }
            
            if (comentariosValidos.length === 0) {
                doc.text('Nenhum registro de conselho válido encontrado.', 30, yPosition);
                yPosition += 10;
            } else {
                // Ordenar por data do conselho (mais recente primeiro)
                comentariosValidos.sort((a, b) => {
                    if (!a.dataCriacaoConselho) return 1;
                    if (!b.dataCriacaoConselho) return -1;
                    return new Date(b.dataCriacaoConselho).getTime() - new Date(a.dataCriacaoConselho).getTime();
                });
                
                for (const comentario of comentariosValidos) {
                    doc.setFont('helvetica', 'bold');
                    doc.text(`Conselho: ${comentario.nomeConselho} - ${comentario.dataConselho}`, 20, yPosition);
                    doc.setFont('helvetica', 'normal');
                    yPosition += 7;

                    doc.text(`Observação: ${comentario.observacao}`, 30, yPosition);
                    yPosition += 7;

                    if (comentario.registroProfessor?.usuario?.nome) {
                        doc.text(`Professor: ${comentario.registroProfessor.usuario.nome}`, 30, yPosition);
                        yPosition += 7;
                    }

                    doc.line(20, yPosition, pageWidth - 20, yPosition);
                    yPosition += 10;

                    if (yPosition > pageHeight - 20) {
                        doc.addPage();
                        desenharBorda();
                        yPosition = 20;
                    }
                }
            }
        }

        doc.save('relatorio-aluno-com-registros.pdf');
    }

    // Definir breadcrumbs dinâmicos
    const idTurma = searchParams.get("idTurma");
    const idCurso = searchParams.get("idCurso");
    let breadcrumbItems: BreadcrumbItem[];
    if (idTurma && idCurso) {
        breadcrumbItems = [
            { label: "Cursos", href: "/listas/listaCursos" },
            { label: "Turmas", href: `/listas/listaTurmas?id=${idCurso}` },
            { label: "Alunos", href: `/listas/listaAlunos?idTurma=${idTurma}&idCurso=${idCurso}` },
            { label: aluno.nome || "Perfil do Aluno", isActive: true }
        ];
    } else {
        breadcrumbItems = [
            { label: "Alunos", href: "/listas/listaTodosAlunos" },
            { label: aluno.nome || "Perfil do Aluno", isActive: true }
        ];
    }

    function handleRemoverFoto() {
        setRemoverFoto(true);
        setNovaFoto(null);
        setValorInput((prev) => ({ ...prev, fotoUrl: "" }));
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-10">
            <div className="w-full max-w-2xl mb-2">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-blue-100 animate-fade-in flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">👤</span>
                    Perfil do Aluno
                </h1>
                <div>
                    <label className="block mb-2 text-lg font-semibold text-gray-700">Foto do Aluno</label>
                    {valorInput.fotoUrl && !removerFoto && (
                        <div className="mt-2 flex flex-col items-center">
                            <NextImage src={valorInput.fotoUrl as string} alt="Foto do aluno" width={128} height={128} className="max-h-32 rounded-lg border" />
                            <span className="text-xs text-gray-500">Foto atual</span>
                            <button
                                type="button"
                                onClick={handleRemoverFoto}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow transition-all"
                            >
                                Remover imagem
                            </button>
                        </div>
                    )}
                </div>
                <form onSubmit={salvar} className="flex flex-col gap-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome</label>
                            <input onChange={getInput} id="nome" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.nome} />
                        </div>
                        <div>
                            <label htmlFor="dataNascimento" className="block mb-2 text-lg font-semibold text-gray-700">Data de Nascimento</label>
                            <input onChange={getInput} id="dataNascimento" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.dataNascimento} />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block mb-2 text-lg font-semibold text-gray-700">Telefone</label>
                            <input onChange={getInput} id="telefone" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.telefone} />
                        </div>
                        <div>
                            <label htmlFor="cep" className="block mb-2 text-lg font-semibold text-gray-700">CEP</label>
                            <input onChange={getInput} id="cep" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.cep} />
                        </div>
                        <div>
                            <label htmlFor="rua" className="block mb-2 text-lg font-semibold text-gray-700">Rua</label>
                            <input onChange={getInput} id="rua" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.rua} />
                        </div>
                        <div>
                            <label htmlFor="bairro" className="block mb-2 text-lg font-semibold text-gray-700">Bairro</label>
                            <input onChange={getInput} id="bairro" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.bairro} />
                        </div>
                        <div>
                            <label htmlFor="numeroEndereco" className="block mb-2 text-lg font-semibold text-gray-700">Número</label>
                            <input onChange={getInput} id="numeroEndereco" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.numeroEndereco} />
                        </div>
                        <div>
                            <label htmlFor="estado" className="block mb-2 text-lg font-semibold text-gray-700">Estado</label>
                            <input onChange={getInput} id="estado" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.estado} />
                        </div>
                        <div>
                            <label htmlFor="cidade" className="block mb-2 text-lg font-semibold text-gray-700">Cidade</label>
                            <input onChange={getInput} id="cidade" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.cidade} />
                        </div>
                        <div>
                            <label htmlFor="complemento" className="block mb-2 text-lg font-semibold text-gray-700">Complemento</label>
                            <input onChange={getInput} id="complemento" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={valorInput.complemento} />
                        </div>
                    </div>
                    <div className="mt-6 flex gap-4 justify-end">
                        <button onClick={excluir} type="button" className="bg-red-500 hover:bg-red-600 text-white py-2 px-8 rounded-full font-semibold shadow transition-all flex items-center gap-2">
                            <span>🗑️</span> Excluir
                        </button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-full font-semibold shadow transition-all flex items-center gap-2">
                            <span>💾</span> Salvar
                        </button>
                    </div>
                </form>
            </div>

 

            <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-2xl border border-blue-100 mt-10 animate-fade-in flex flex-col items-center">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">Registros da Vida do Aluno</h2>
                {registros.length === 0 ? (
                    <p className="text-lg text-gray-500">Nenhum registro encontrado.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {registros.map((registro) => (
                            <div key={registro.id} className="bg-blue-400 rounded-xl p-4 flex flex-col shadow-md hover:scale-105 transition-transform cursor-pointer">
                                <p className="font-semibold text-white">Tipo: {registro.tipoRegistro}</p>
                                <p className="text-white">{registro.descricao}</p>
                                <p className="text-xs text-white mt-2">Professor: {registro.nomeProfessor}</p>
                            </div>
                        ))}
                    </div>
                )}
                <button onClick={adicionarRegistroVidaAluno} className="mt-8 mb-2 text-lg bg-[#3579FF] py-2 px-8 text-white rounded-full hover:px-10 transition-all duration-200 font-semibold shadow flex items-center gap-2">
                    <span>➕</span> Adicionar registro
                </button>
            </div>
            <button onClick={gerarRelatorio} className="fixed right-3 bottom-3 p-3 bg-[#3579FF] text-white rounded-full hover:px-5 transition-all duration-200 shadow-lg font-semibold flex items-center gap-2">
                <span>📄</span> Gerar relatório
            </button>
        </div>
    )
}