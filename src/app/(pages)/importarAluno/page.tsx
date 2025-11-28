"use client";

import { ChangeEvent, useState, useEffect, useContext } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import turmaDAO from "@/DAOs/TurmaDAO";
import cursoDAO from "@/DAOs/CursoDAO";
import alunoDAO from "@/DAOs/AlunoDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import Turma from "@/model/Turma";
import Curso from "@/model/Curso";
import Aluno from "@/model/Aluno"; // Importando o tipo Aluno
import TurmaAluno from "@/model/TurmaAluno";
import { UserContext } from "@/contexts/UserContext";
import { useSearchParams } from "next/navigation"; // Substituir useRouter
import AlunoCard from "@/components/AlunoCard"; // Importando o componente AlunoCard

export default function ImportarAluno() {
    // Estados de navegação
    const [etapaAtual, setEtapaAtual] = useState<'cursos' | 'turmas' | 'alunos'>('cursos');
    const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
    const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);

    // Contexto do usuário
    const { usuarioLogado } = useContext(UserContext);
    const searchParams = useSearchParams(); // Substituir useRouter

    // Estados de dados
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);

    // Função para mudar etapa e atualizar URL
    function mudarEtapa(etapa: 'cursos' | 'turmas' | 'alunos') {
        setEtapaAtual(etapa);
        const url = `/importarAluno?etapa=${etapa}`;
        window.history.pushState({}, "", url); // Atualizar URL manualmente
    }

    // Ler etapa da URL ao carregar a página
    useEffect(() => {
        const etapa = searchParams.get("etapa") as 'cursos' | 'turmas' | 'alunos';
        if (etapa) {
            setEtapaAtual(etapa);
        }
    }, [searchParams]);

    // Ajustando o breadcrumb para refletir corretamente as etapas e melhorar a clareza
    const breadcrumbs = [
        { label: "Importar Aluno", href: "/importarAluno", onClick: () => mudarEtapa('cursos') },
        { label: "Cursos", href: "/importarAluno?etapa=cursos", onClick: () => mudarEtapa('cursos'), isActive: etapaAtual === 'cursos' },
        { label: "Turmas", href: "/importarAluno?etapa=turmas", onClick: () => mudarEtapa('turmas'), isActive: etapaAtual === 'turmas' },
        { label: "Alunos", href: "/importarAluno?etapa=alunos", onClick: () => mudarEtapa('alunos'), isActive: etapaAtual === 'alunos' },
    ];

    // Estados de carregamento
    const [carregandoCursos, setCarregandoCursos] = useState(true);
    const [carregandoTurmas, setCarregandoTurmas] = useState(false);
    const [carregandoAlunos, setCarregandoAlunos] = useState(false);
    
    // Estados do arquivo
    const [fileName, setFileName] = useState("");
    const [alunosImportados, setAlunosImportados] = useState<Student[]>([]);
    const [importando, setImportando] = useState(false);

    // Carregar cursos na primeira etapa
    useEffect(() => {
        async function carregarCursos() {
            try {
                console.log("[DEBUG] Carregando cursos...");
                const cursosDisponiveis = await cursoDAO.getAll();
                console.log("[DEBUG] Cursos encontrados:", cursosDisponiveis);
                setCursos(cursosDisponiveis);
            } catch (error) {
                console.error("[ERROR] Erro ao carregar cursos:", error);
                alert("Erro ao carregar cursos disponíveis");
            } finally {
                setCarregandoCursos(false);
            }
        }
        carregarCursos();
    }, []);

    // Função para selecionar curso e carregar turmas
    async function selecionarCurso(curso: Curso) {
        setCursoSelecionado(curso);
        setCarregandoTurmas(true);
        setEtapaAtual('turmas');
        
        try {
            console.log("[DEBUG] Carregando turmas do curso:", curso.id);
            const turmasDisponiveis = await turmaDAO.getByCursoId(curso.id);
            console.log("[DEBUG] Turmas encontradas:", turmasDisponiveis);
            setTurmas(turmasDisponiveis);
        } catch (error) {
            console.error("[ERROR] Erro ao carregar turmas:", error);
            alert("Erro ao carregar turmas do curso");
        } finally {
            setCarregandoTurmas(false);
        }
    }

    // Função para selecionar turma e carregar alunos
    async function selecionarTurma(turma: Turma) {
        setTurmaSelecionada(turma);
        setCarregandoAlunos(true);
        setEtapaAtual('alunos');
        
        try {
            console.log("[DEBUG] Carregando alunos da turma:", turma.idTurma);
            const alunosDisponiveis = await turmaAlunoDAO.getAlunos(turma.idTurma);
            console.log("[DEBUG] Alunos encontrados:", alunosDisponiveis);
            setAlunos(alunosDisponiveis);
        } catch (error) {
            console.error("[ERROR] Erro ao carregar alunos:", error);
            alert("Erro ao carregar alunos da turma");
        } finally {
            setCarregandoAlunos(false);
        }
    }

    // Função para voltar nas etapas
   

    async function submitArquivo(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files![0];
        if (!file) return;

        setFileName(file.name);
        console.log("[DEBUG] Processando arquivo:", file.name, "Tamanho:", file.size);

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result as string;
            console.log("[DEBUG] Conteúdo bruto do arquivo:");
            console.log(content);
            
            // Normalizar quebras de linha (Windows/Mac/Linux)
            const contentNormalizado = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            console.log("[DEBUG] Conteúdo normalizado:");
            console.log(contentNormalizado);
            
            // Processar CSV linha por linha
            const linhas = contentNormalizado.split('\n').filter(linha => linha.trim());
            console.log("[DEBUG] Total de linhas encontradas:", linhas.length);
            console.log("[DEBUG] Linhas:", linhas);
            
            const alunosParaImportar: Student[] = [];
            
            // Detectar se primeira linha é cabeçalho
            const primeiraLinha = linhas[0] ? linhas[0].toLowerCase() : "";
            const temCabecalho = primeiraLinha.includes('nome') || primeiraLinha.includes('data');
            const inicioLinhas = temCabecalho ? 1 : 0;
            console.log("[DEBUG] Tem cabeçalho:", temCabecalho, "Começar na linha:", inicioLinhas);
            
            for (let i = inicioLinhas; i < linhas.length; i++) {
                const linha = linhas[i].trim();
                if (!linha) {
                    console.log(`[DEBUG] Linha ${i} vazia, pulando`);
                    continue;
                }
                
                // Tentar diferentes separadores
                let dados = linha.split(',');
                if (dados.length < 9) {
                    dados = linha.split(';'); // Tentar ponto-e-vírgula
                }
                if (dados.length < 9) {
                    dados = linha.split('\t'); // Tentar tab
                }
                
                console.log(`[DEBUG] Linha ${i}: "${linha}"`);
                console.log(`[DEBUG] Dados extraídos (${dados.length} campos):`, dados);
                
                if (dados.length >= 10) {
                    const aluno: Aluno = {
                        nome: dados[0].trim().replace(/"/g, ''),
                        dataNascimento: dados[1].trim().replace(/"/g, ''),
                        telefone: dados[2].trim().replace(/"/g, ''),
                        cep: dados[3].trim().replace(/"/g, ''),
                        rua: dados[4].trim().replace(/"/g, ''),
                        numeroEndereco: dados[5].trim().replace(/"/g, ''),
                        estado: validarEstado(dados[6].trim().replace(/"/g, '')),
                        cidade: validarCidade(dados[7].trim().replace(/"/g, '')),
                        bairro: dados[8].trim().replace(/"/g, ''),
                        complemento: dados[9] ? validarComplemento(dados[9].trim().replace(/"/g, '')) : "",
                    };
                    
                    console.log(`[DEBUG] Aluno processado:`, aluno);
                    
                    // Validar campos obrigatórios
                    if (aluno.nome && aluno.dataNascimento && aluno.telefone) {
                        alunosParaImportar.push(aluno);
                        console.log(`[DEBUG] ✅ Aluno ${aluno.nome} adicionado com sucesso`);
                    } else {
                        console.warn(`[WARN] ❌ Aluno inválido na linha ${i}:`, {
                            nome: aluno.nome,
                            dataNascimento: aluno.dataNascimento,
                            telefone: aluno.telefone
                        });
                    }
                } else {
                    console.warn(`[WARN] Linha ${i} com poucos campos (${dados.length}):`, dados);
                }
            }
            
            setAlunosImportados(alunosParaImportar);
            console.log("[DEBUG] 🎯 RESULTADO FINAL:");
            console.log("[DEBUG] Total de alunos para importar:", alunosParaImportar.length);
            console.log("[DEBUG] Lista completa:", alunosParaImportar);
            
            // Feedback adicional
            if (alunosParaImportar.length === 0) {
                console.error("[ERROR] ❌ Nenhum aluno válido encontrado!");
                console.log("[DEBUG] Verifique o formato do seu CSV:");
                console.log("Esperado: nome,dataNascimento,telefone,cep,rua,bairro,numeroEndereco,estado,cidade,complemento");
            } else {
                console.log(`[SUCCESS] ✅ ${alunosParaImportar.length} alunos prontos para importação!`);
            }
        };
        reader.readAsText(file);
    }

    async function importarAlunos() {
        if (!turmaSelecionada || alunosImportados.length === 0) return;
        
        setImportando(true);
        let sucessos = 0;
        let erros = 0;
        
        try {
            for (const alunoData of alunosImportados) {
                try {
                    // Criar novo aluno
                    const novoAluno = new Aluno();
                    novoAluno.nome = alunoData.nome;
                    novoAluno.dataNascimento = alunoData.dataNascimento;
                    novoAluno.telefone = alunoData.telefone;
                    novoAluno.cep = alunoData.cep;
                    novoAluno.rua = alunoData.rua;
                    novoAluno.bairro = alunoData.bairro;
                    novoAluno.numeroEndereco = alunoData.numeroEndereco;
                    novoAluno.estado = alunoData.estado;
                    novoAluno.cidade = alunoData.cidade;
                    novoAluno.complemento = alunoData.complemento;
                    novoAluno.idTurma = turmaSelecionada.idTurma;
                    novoAluno.idEscola = usuarioLogado?.escola?.id || ""; // ✅ CORREÇÃO: Preencher idEscola
                    novoAluno.fotoUrl = "";
                    
                    console.log("[DEBUG] Criando aluno:", novoAluno);
                    console.log("[DEBUG] idEscola do usuário:", usuarioLogado?.escola?.id);
                    
                    // Inserir aluno
                    const idAluno = await alunoDAO.inserir(novoAluno);
                    
                    // Criar relacionamento turma-aluno
                    const turmaAluno = new TurmaAluno();
                    turmaAluno.aluno = new Aluno();
                    turmaAluno.aluno.id = idAluno;
                    turmaAluno.turma = turmaSelecionada;
                    
                    await turmaAlunoDAO.inserir(turmaAluno);
                    sucessos++;
                    
                } catch (error) {
                    console.error(`[ERROR] Erro ao importar aluno ${alunoData.nome}:`, error);
                    erros++;
                }
            }
            
            alert(`Importação concluída!\nSucessos: ${sucessos}\nErros: ${erros}`);
            
            // Recarregar lista de alunos
            if (sucessos > 0) {
                await selecionarTurma(turmaSelecionada);
            }
            
            // Limpar estados do arquivo
            setFileName("");
            setAlunosImportados([]);
            
        } catch (error) {
            console.error("[ERROR] Erro geral na importação:", error);
            alert("Erro durante a importação");
        } finally {
            setImportando(false);
        }
    }

    // Ler etapa da URL ao carregar a página
    useEffect(() => {
        const etapa = searchParams.get("etapa") as 'cursos' | 'turmas' | 'alunos';
        if (etapa) {
            setEtapaAtual(etapa);
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-6xl">
                <Breadcrumbs items={breadcrumbs} />
                
               

                {/* ETAPA 1: SELEÇÃO DE CURSOS */}
                {etapaAtual === 'cursos' && (
                    <div>
                        {carregandoCursos ? (
                            <p className="text-center text-gray-500">Carregando cursos...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cursos.map((curso) => (
                                    <div
                                        key={curso.id}
                                        onClick={() => selecionarCurso(curso)}
                                        className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer"
                                    >
                                        <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg overflow-hidden">
                                            {curso.fotoUrl ? (
                                                <img
                                                    src={curso.fotoUrl as string}
                                                    alt={curso.nome}
                                                    className="object-cover h-full w-full rounded-lg"
                                                />
                                            ) : (
                                                <p className="text-3xl">{curso.nome[0]}</p>
                                            )}
                                        </div>
                                        <div className="px-3 flex flex-col justify-between text-start h-full py-1">
                                            <div>
                                                <p className="text-xl font-semibold">{curso.nome}</p>
                                                <p className="text-sm text-gray-600">{curso.escola.nome}</p>
                                            </div>
                                            <div className="flex gap-1 flex-wrap">
                                                {curso.turno?.map((turno) => (
                                                    <span key={turno} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                        {turno}
                                                    </span>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ETAPA 2: SELEÇÃO DE TURMAS */}
                {etapaAtual === 'turmas' && (
                    <div>
                        {carregandoTurmas ? (
                            <p className="text-center text-gray-500">Carregando turmas...</p>
                        ) : turmas.length === 0 ? (
                            <p className="text-center text-gray-500">Nenhuma turma encontrada para este curso.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {turmas.map((turma) => (
                                    <div
                                        key={turma.idTurma}
                                        onClick={() => selecionarTurma(turma)}
                                        className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer"
                                    >
                                        <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg overflow-hidden">
                                            {turma.fotoUrl ? (
                                                <img
                                                    src={turma.fotoUrl}
                                                    alt={turma.nome}
                                                    className="object-cover h-full w-full rounded-lg"
                                                />
                                            ) : (
                                                <p className="text-3xl">{turma.nome[0]}</p>
                                            )}
                                        </div>
                                        <div className="px-3 flex flex-col justify-between text-start h-full py-1">
                                            <div>
                                                <p className="text-xl font-semibold">{turma.nome}</p>
                                                <p className="text-sm text-gray-600">Ano: {turma.ano}</p>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ETAPA 3: ALUNOS DA TURMA + IMPORTAÇÃO */}
                {etapaAtual === 'alunos' && (
                    <div>
                        {carregandoAlunos ? (
                            <p className="text-center text-gray-500">Carregando alunos...</p>
                        ) : (
                            <div>
                                {/* Botão de importar */}
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <h3 className="text-xl font-semibold text-purple-700 mb-4">
                                        📥 Importar Alunos para esta Turma
                                    </h3>
                                    
                                    {!fileName ? (
                                        <button
                                            onClick={() => document.getElementById('file-upload')!.click()}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Selecionar Arquivo CSV
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-green-600 font-medium">
                                                📄 Arquivo: {fileName} ({alunosImportados.length} alunos)
                                            </p>
                                            
                                            {/* Preview dos dados do CSV */}
                                            {alunosImportados.length > 0 && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-semibold mb-2">Preview dos alunos:</h4>
                                                    <div className="max-h-32 overflow-y-auto">
                                                        {alunosImportados.slice(0, 3).map((aluno, index) => (
                                                            <div key={index} className="text-sm text-gray-700 mb-1">
                                                                {index + 1}. {aluno.nome} - {aluno.telefone} - {aluno.cidade}
                                                            </div>
                                                        ))}
                                                        {alunosImportados.length > 3 && (
                                                            <div className="text-sm text-gray-500">
                                                                ... e mais {alunosImportados.length - 3} alunos
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {alunosImportados.length === 0 && fileName && (
                                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                                    <p className="text-red-700 font-medium">⚠️ Nenhum aluno foi encontrado no arquivo</p>
                                                    <p className="text-red-600 text-sm mt-1">
                                                        Verifique se o arquivo CSV tem o formato correto:<br/>
                                                        nome,dataNascimento,telefone,cep,rua,bairro,numeroEndereco,estado,cidade,complemento
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setFileName("");
                                                            setAlunosImportados([]);
                                                        }}
                                                        className="mt-2 text-red-600 underline text-sm"
                                                    >
                                                        Tentar outro arquivo
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {alunosImportados.length > 0 && (
                                                <button
                                                    onClick={importarAlunos}
                                                    disabled={importando}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                                >
                                                    {importando ? "Importando..." : `Importar ${alunosImportados.length} Alunos`}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    
                                    <input 
                                        id="file-upload" 
                                        type="file" 
                                        accept=".csv,.txt" 
                                        onChange={submitArquivo} 
                                        className="hidden" 
                                    />
                                </div>

                                {/* Lista de alunos */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                        👥 Alunos da Turma ({alunos.length})
                                    </h3>
                                    
                                    {alunos.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">
                                            Nenhum aluno cadastrado nesta turma ainda.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {alunos.map((aluno) => (
                                                <AlunoCard
                                                    key={aluno.id}
                                                    aluno={aluno}
                                                    disableNavigation={true} // Desativa o redirecionamento
                                                    hideActions={true} // Oculta os botões de ação
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function validarEstado(estado: string): string {
    const estadosValidos = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
    return estadosValidos.includes(estado) ? estado : "";
}

function validarCidade(cidade: string): string {
    return cidade.length > 0 ? cidade : "";
}

function validarComplemento(complemento: string): string {
    return complemento.length > 0 ? complemento : "";
}
