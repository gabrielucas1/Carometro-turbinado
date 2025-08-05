"use client";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import alunoDAO from "@/DAOs/AlunoDAO";
import escolaDAO from "@/DAOs/EscolaDAO";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";

export default function TelaADM() {
  const { usuarioLogado } = useContext(UserContext);
  const [totalEscolas, setTotalEscolas] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [totalADMEscola, setTotalADMEscola] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const escolas = await escolaDAO.getAll();
      setTotalEscolas(escolas.length);
      const alunos = await alunoDAO.getAll();
      setTotalAlunos(alunos.length);
      const usuarios = await usuarioDAO.getAll();
      setTotalFuncionarios(usuarios.filter(u => u.tipoUsuario === TipoUsuario.FUNCIONARIO).length);
      setTotalADMEscola(usuarios.filter(u => u.tipoUsuario === TipoUsuario.ADMESCOLA).length);
    }
    fetchData();
  }, []);

  return (

<div className="min-h-screen bg-white flex flex-col items-center py-10">
  <div className="mb-10 text-center">
    <span className="text-5xl font-extrabold text-blue-700 drop-shadow">
      Bem vindo{usuarioLogado?.nome ? `, ${usuarioLogado.nome}` : ''}!
    </span>
  </div>
      <div className="flex flex-wrap gap-6 mb-10 w-full max-w-4xl justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 border-t-4 border-blue-500">
          <span className="text-3xl mb-2">🏫</span>
          <span className="text-2xl font-bold text-blue-700">{totalEscolas}</span>
          <span className="text-gray-600 mt-1">Escolas</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 border-t-4 border-green-500">
          <span className="text-3xl mb-2">👨‍🎓</span>
          <span className="text-2xl font-bold text-green-700">{totalAlunos}</span>
          <span className="text-gray-600 mt-1">Alunos</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 border-t-4 border-yellow-500">
          <span className="text-3xl mb-2">🧑‍💼</span>
          <span className="text-2xl font-bold text-yellow-700">{totalFuncionarios}</span>
          <span className="text-gray-600 mt-1">Funcionários</span>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 border-t-4 border-purple-500">
          <span className="text-3xl mb-2">👨‍💼</span>
          <span className="text-2xl font-bold text-purple-700">{totalADMEscola}</span>
          <span className="text-gray-600 mt-1">ADMEscola</span>
        </div>
      </div>
    </div>
  );
}
