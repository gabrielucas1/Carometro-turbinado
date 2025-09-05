"use client";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import alunoDAO from "@/DAOs/AlunoDAO";
import cursoDAO from "@/DAOs/CursoDAO";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import escolaDAO from "@/DAOs/EscolaDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";

export default function TelaADMEscola() {
  const { usuarioLogado } = useContext(UserContext);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalCursos, setTotalCursos] = useState(0);
  const [escola, setEscola] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!usuarioLogado?.escola?.id) return;
      const escolaData = await escolaDAO.getOne(usuarioLogado.escola.id);
      setEscola(escolaData);

      const alunos = await alunoDAO.getAll();
      setTotalAlunos(alunos.filter(a => a.idEscola === usuarioLogado.escola.id).length);

      const funcionarios = await usuarioDAO.getAll();
      setTotalFuncionarios(funcionarios.filter(u => u.tipoUsuario === TipoUsuario.FUNCIONARIO && u.escola?.id === usuarioLogado.escola.id).length);

      const cursos = await cursoDAO.getAll();
      setTotalCursos(cursos.filter(c => c.escola?.id === usuarioLogado.escola.id).length);
    }
    fetchData();
  }, [usuarioLogado]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <div className="mb-10 text-center">
        <span className="text-4xl font-extrabold text-blue-700 drop-shadow">
          Bem vindo{usuarioLogado?.nome ? `, ${usuarioLogado.nome}` : ''}!
        </span>
        {escola && (
          <div className="mt-4 text-lg text-gray-700 font-semibold">
            <span className="block text-2xl text-blue-600 font-bold mb-1">{escola.nome}</span>
            <span>{escola.rua ? `${escola.rua}, ` : ''}{escola.numeroCasa ? escola.numeroCasa : ''}{escola.bairro ? ` - ${escola.bairro}` : ''}</span><br/>
            <span>{escola.cidade ? escola.cidade : ''}{escola.estado ? ` - ${escola.estado}` : ''}</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-6 mb-10 w-full max-w-4xl justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 border-t-4 border-yellow-500">
          <span className="text-3xl mb-2">🧑‍💼</span>
          <span className="text-2xl font-bold text-yellow-700">{totalFuncionarios}</span>
          <span className="text-gray-600 mt-1">Funcionários</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 border-t-4 border-green-500">
          <span className="text-3xl mb-2">👨‍🎓</span>
          <span className="text-2xl font-bold text-green-700">{totalAlunos}</span>
          <span className="text-gray-600 mt-1">Alunos</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 border-t-4 border-indigo-500">
          <span className="text-3xl mb-2">📚</span>
          <span className="text-2xl font-bold text-indigo-700">{totalCursos}</span>
          <span className="text-gray-600 mt-1">Cursos</span>
        </div>
      </div>
    </div>
  );
}
