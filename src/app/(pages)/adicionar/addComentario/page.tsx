"use client";


import Aluno from "@/model/Aluno";
import ConselhoClasse from "@/model/ConselhoClasse";
import Usuario from "@/model/Usuario";
import Turma from "@/model/Turma";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import registroProfessorDescricaoDAO from "@/DAOs/RegistroProfessorDescricaoDAO";
import conselhoClasseDAO from "@/DAOs/ConselhoClasseDAO";
import alunoDAO from "@/DAOs/AlunoDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";

export default function AddComentarioConselho() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const alunoId = searchParams.get("alunoId");
  const conselhoId = searchParams.get("conselhoId");
  const [comentario, setComentario] = useState("");
  const [professor, setProfessor] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [conselhoClasse, setConselhoClasse] = useState<ConselhoClasse | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (alunoId) {
        const alunoObj = await alunoDAO.getOne(alunoId);
        setAluno(alunoObj);
      }
      if (conselhoId) {
        const conselhoObj = await conselhoClasseDAO.getOne(conselhoId);
        setConselhoClasse(conselhoObj);
      }
    }
    fetchData();
  }, [alunoId, conselhoId]);

  const handleSalvar = async () => {
    if (!comentario || !professor || !aluno || !conselhoClasse) {
    }
    setCarregando(true);
    setErro("");
    try {
      // Monta objeto simples para aluno
      const alunoObj = aluno ? {
        id: aluno.id,
        nome: aluno.nome
      } : {};
      // Monta objeto simples para conselhoClasse
      const conselhoClasseObj = conselhoClasse ? {
        id: conselhoClasse.id,
        nome: conselhoClasse.nome
      } : {};
      // Monta objeto simples para turma
      const turmaObj = aluno && aluno.idTurma ? { id: aluno.idTurma } : {};
      // Monta objeto simples para usuario
      const usuarioObj = {
        id: "",
        tipoUsuario: TipoUsuario.FUNCIONARIO,
        nome: professor
      };
      // Monta objeto simples para registroProfessorTurma
      const registroProfessorTurma = {
        id: "",
        disciplina: "",
        periodo: "",
        turma: turmaObj,
        usuario: usuarioObj,
        dataCriacao: new Date(),
        dataModificacao: new Date(),
        ativo: true,
        descricao: "",
        tipoRegistro: "",
        revisaoGeral: "",
        data: new Date(),
        conselhoClasse: conselhoClasseObj
      };
      await registroProfessorDescricaoDAO.inserir({
        id: "",
        aluno: alunoObj,
        conselhoClasse: conselhoClasseObj,
        observacao: comentario,
        registroProfessor: registroProfessorTurma,
        dataCriacao: new Date(),
        dataModificacao: new Date(),
      });
      router.back();
    } catch (err) {
      setErro("Erro ao salvar comentário!");
    }
    setCarregando(false);
        if (!comentario || !professor || !aluno || !conselhoClasse) {
          console.log("[ERRO] Campos obrigatórios faltando:", { comentario, professor, aluno, conselhoClasse });
          setErro("Preencha todos os campos!");
          return;
        }
        setCarregando(true);
        setErro("");
        try {
          // Monta objeto RegistroProfessorTurma mínimo
          const registroProfessorTurma = {
            id: "",
            disciplina: "",
            periodo: "",
            turma: new Turma(),
            usuario: {
              id: "",
              tipoUsuario: TipoUsuario.FUNCIONARIO,
              escola: null,
              nome: professor,
              email: "",
              CEP: "",
              rua: "",
              bairro: "",
              complemento: "",
              numeroCasa: "",
              estado: "",
              cidade: "",
              dataNascimento: "",
              celular: "",
              fotoUrl: "",
              usuario: { id: "", nome: "" }
            } as Usuario,
            dataCriacao: new Date(),
            dataModificacao: new Date(),
            ativo: true,
            descricao: "",
            tipoRegistro: "",
            revisaoGeral: "",
            data: new Date(),
            conselhoClasse: conselhoClasse
          };
          const registroDescricao = {
            id: "",
            aluno: aluno,
            conselhoClasse: conselhoClasse,
            observacao: comentario,
            registroProfessor: registroProfessorTurma,
            dataCriacao: new Date(),
            dataModificacao: new Date(),
          };
          console.log("[DEBUG] registroDescricao a ser salvo:", registroDescricao);
          await registroProfessorDescricaoDAO.inserir(registroDescricao);
          router.back();
        } catch (err) {
          console.error("[ERRO] Falha ao salvar comentário:", err);
          setErro("Erro ao salvar comentário!");
        }
        setCarregando(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-white">
      <div className="w-full max-w-md bg-blue-100 rounded-xl p-8 shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">Adicionar Comentário do Conselho</h1>
        <label className="block mb-2 font-semibold">Professor</label>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded border"
          value={professor}
          onChange={e => setProfessor(e.target.value)}
          placeholder="Nome do professor"
        />
        <label className="block mb-2 font-semibold">Comentário</label>
        <textarea
          className="w-full p-2 mb-4 rounded border"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Digite o comentário"
        />
        {erro && <p className="text-red-500 mb-2">{erro}</p>}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          onClick={handleSalvar}
          disabled={carregando}
        >
          {carregando ? "Salvando..." : "Salvar Comentário"}
        </button>
      </div>
    </div>
  );
}
