"use client"

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO";
import alunoDAO from "@/DAOs/AlunoDAO";
import registroProfessorDescricaoDAO from "@/DAOs/RegistroProfessorDescricaoDAO";
import AlunoCard from "@/components/AlunoCard";
import AlunoCardConselho from "@/components/AlunoCardConselho";

export default function PerfilConselho() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idConselho = searchParams.get("id");
  const [conselho, setConselho] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvandoComentario, setSalvandoComentario] = useState(false);
  // Novo estado para comentários em edição
  const [comentariosEdicao, setComentariosEdicao] = useState<{ [alunoId: string]: string }>({});



  useEffect(() => {
    async function fetchData() {
      if (!idConselho) return;
      try {
        console.log("[DEBUG] Iniciando carregamento de dados");
        console.log("[DEBUG] ID do conselho:", idConselho);
        setCarregando(true);

        // Buscar conselho
        const conselhoBuscado = await conselhoClasseDAO.getOne(idConselho);
        console.log("[DEBUG] Conselho buscado:", conselhoBuscado);
        if (!conselhoBuscado) throw new Error("Conselho não encontrado");

        // Buscar turma
        const turmaDAO = (await import("@/DAOs/TurmaDAO")).default;
        let turmaId: string | undefined;
        
        console.log("[DEBUG] Estrutura da turma no conselho:", conselhoBuscado.turma);
        
        // Verificação mais segura com type assertion
        const turmaRef = conselhoBuscado.turma as any;
        
        if (typeof turmaRef === 'string') {
          turmaId = turmaRef.split("/").pop();
          console.log("[DEBUG] ID extraído da string:", turmaId);
        } else if (turmaRef && typeof turmaRef === 'object') {
          if ('idTurma' in turmaRef) {
            turmaId = turmaRef.idTurma;
            console.log("[DEBUG] ID extraído do campo idTurma:", turmaId);
          } else if ('id' in turmaRef) {
            turmaId = turmaRef.id;
            console.log("[DEBUG] ID extraído do campo id:", turmaId);
          }
        }

        console.log("[DEBUG] ID da turma extraído final:", turmaId);
        if (!turmaId) throw new Error("ID da turma não encontrado");

        const turmaObj = await turmaDAO.getOne(turmaId);
        console.log("[DEBUG] Turma encontrada:", turmaObj);
        if (!turmaObj) throw new Error("Turma não encontrada");

        // Buscar alunos e seus comentários
        const turmaAlunoDAO = (await import("@/DAOs/TurmaAlunoDAO")).default;
        const alunosTurma = await turmaAlunoDAO.getAlunos(turmaId);
        console.log("[DEBUG] Alunos da turma:", alunosTurma);

        const comentariosPromises = alunosTurma.map(async (aluno) => {
          console.log("[DEBUG] Buscando comentários para aluno:", aluno.nome);
          const comentariosAluno = await registroProfessorDescricaoDAO.getByAluno(aluno.id);
          console.log("[DEBUG] Comentários encontrados para", aluno.nome, ":", comentariosAluno);

          console.log("[DEBUG] Comentários brutos para aluno:", aluno.nome, comentariosAluno);
          
          const comentariosFiltrados = comentariosAluno.filter((coment: any) => {
            console.log("[DEBUG] Verificando comentário:", coment);
            
            // Verificar primeiro no objeto conselhoClasse
            if (coment.conselhoClasse) {
              const comentConselhoId = typeof coment.conselhoClasse === 'string'
                ? coment.conselhoClasse.split("/").pop()
                : coment.conselhoClasse.id;
                
              console.log("[DEBUG] ID do conselho no comentário:", comentConselhoId);
              
              if (comentConselhoId === idConselho) {
                return true;
              }
            }
            
            // Verificar também no registroProfessor.conselhoClasse como fallback
            if (coment.registroProfessor?.conselhoClasse) {
              const rpConselhoId = typeof coment.registroProfessor.conselhoClasse === 'string'
                ? coment.registroProfessor.conselhoClasse.split("/").pop()
                : coment.registroProfessor.conselhoClasse.id;
                
              console.log("[DEBUG] ID do conselho no registroProfessor:", rpConselhoId);
              
              if (rpConselhoId === idConselho) {
                return true;
              }
            }
            
            return false;
          });

          console.log("[DEBUG] Comentários filtrados para", aluno.nome, ":", comentariosFiltrados);
          return { aluno, comentarios: comentariosFiltrados };
        });

        const comentariosTodos = await Promise.all(comentariosPromises);
        console.log("[DEBUG] Todos os comentários processados:", comentariosTodos);

        // Atualizar estados
        setConselho({ ...conselhoBuscado, turma: turmaObj });
        setComentarios(comentariosTodos);
        // Inicializar campos de edição vazios
        const comentariosIniciais: { [alunoId: string]: string } = {};
        alunosTurma.forEach(aluno => {
          comentariosIniciais[aluno.id] = "";
        });
        setComentariosEdicao(comentariosIniciais);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar os dados. Por favor, recarregue a página.");
      } finally {
        setCarregando(false);
      }
    }
    fetchData();
  }, [idConselho]);


  // Função para salvar todos os comentários de uma vez
  const handleSalvarTodos = async () => {
    setSalvandoComentario(true);
    try {
      // 1. Obter usuário atual via Firebase Auth
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Usuário não está logado");
      // 2. Buscar dados do usuário no banco
      const usuarioDAO = (await import("@/DAOs/UsuarioDAO")).default;
      const dadosUsuario = await usuarioDAO.getOne(currentUser.uid);
      if (!dadosUsuario) throw new Error("Dados do usuário não encontrados no banco");
      // 3. Salvar todos os comentários preenchidos
      const dataAtual = new Date();
      const promises = comentarios.map(async (item) => {
        const comentario = comentariosEdicao[item.aluno.id]?.trim();
        if (!comentario) return null; // Ignora se não preencheu
        const registroProfessorObj = {
          id: "",
          disciplina: "",
          periodo: "",
          turma: { id: "", nome: "" },
          usuario: {
            id: dadosUsuario.id,
            nome: dadosUsuario.nome,
            email: dadosUsuario.email || ""
          },
          tipoRegistro: "",
          revisaoGeral: "",
          data: dataAtual,
          conselhoClasse: { id: idConselho, nome: (conselho && conselho.nome) ? conselho.nome : "" }
        };
        const registroParaSalvar = {
          observacao: comentario,
          aluno: {
            id: item.aluno.id,
            nome: item.aluno.nome
          },
          conselhoClasse: {
            id: idConselho,
            nome: (conselho && conselho.nome) ? conselho.nome : ""
          },
          registroProfessor: registroProfessorObj,
          dataCriacao: dataAtual,
          dataModificacao: dataAtual
        };
        await registroProfessorDescricaoDAO.inserir(registroParaSalvar);
        return item.aluno.id;
      });
      const salvos = await Promise.all(promises);
      // Atualizar comentários exibidos
      for (const alunoId of salvos) {
        if (!alunoId) continue;
        const comentariosAtualizados = await registroProfessorDescricaoDAO.getByAluno(alunoId);
        setComentarios(estadoAtual =>
          estadoAtual.map(item =>
            item.aluno.id === alunoId
              ? { ...item, comentarios: comentariosAtualizados }
              : item
          )
        );
      }
      
      // Limpar todos os campos de comentário após salvar com sucesso
      const comentariosLimpos: { [alunoId: string]: string } = {};
      comentarios.forEach(item => {
        comentariosLimpos[item.aluno.id] = "";
      });
      setComentariosEdicao(comentariosLimpos);
      
      alert("Todos os comentários salvos com sucesso!");
    } catch (error: any) {
      alert(`Erro ao salvar comentários: ${error.message}`);
    } finally {
      setSalvandoComentario(false);
    }
  };

  if (carregando) return <div className="p-8">Carregando...</div>;
  if (!conselho) return <div className="p-8">Conselho não encontrado.</div>;

  console.log("[DEBUG] Render conselho.turma:", conselho.turma);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-white">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Detalhes do Conselho de Classe</h1>
        <div className="bg-blue-100 rounded-xl p-6 shadow mb-8 text-center">
            <p className="font-bold text-2xl">{conselho.nome}</p>
            <p className="text-lg">Turma: {conselho.turma?.nome || conselho.turma?.id || "-"}</p>
            <p className="text-lg">Data: {conselho.dataCriacao ? new Date(conselho.dataCriacao).toLocaleDateString() : "-"}</p>
        </div>
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Alunos</h2>
        {comentarios.length === 0 ? (
          <p className="text-gray-500">Nenhum aluno/comentário encontrado.</p>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSalvarTodos();
            }}
          >
            <div className="space-y-6">
              {comentarios.map((item) => (
                <div key={item.aluno.id} className="mb-4 flex flex-col md:flex-row items-center gap-4">
                  <AlunoCardConselho
                    aluno={item.aluno}
                    comentarios={item.comentarios}
                    comentarioEdicao={comentariosEdicao[item.aluno.id] || ""}
                    onChangeComentario={valor => setComentariosEdicao(ant => ({ ...ant, [item.aluno.id]: valor }))}
                    salvando={salvandoComentario}
                  />
                  {/* Campo de comentário sempre visível ao lado */}
                  {/*
                  <textarea
                    className="border rounded p-2 w-64"
                    placeholder="Digite o comentário para o aluno"
                    value={comentariosEdicao[item.aluno.id] || ""}
                    onChange={e => setComentariosEdicao(ant => ({ ...ant, [item.aluno.id]: e.target.value }))}
                    disabled={salvandoComentario}
                  />
                  */}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-8 rounded-full font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
                disabled={salvandoComentario}
              >
                Salvar Todos
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
