"use client";

import RegistroProfessorTurma from "@/model/RegistroProfessorTurma";
import TipoRegistro from "@/model/Enums/TipoRegistro";
import { ChangeEvent, useContext, useState } from "react";
import registroProfessorTurmaDAO from "@/DAOs/RegistroProfessorTurmaDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import { useSearchParams, useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

export default function AddRegistroTurma() {
  const { usuarioLogado } = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const idTurma = searchParams.get("idTurma");

  const [valorInput, setValorInput] = useState({
    tipoRegistro: "",
    revisaoGeral: "",
    disciplina: "",
    periodo: "",
  });
  const [loading, setLoading] = useState(false);

  function getInput(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { id, value } = event.target;
    setValorInput((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  async function submitForm(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valorInput.tipoRegistro || !valorInput.revisaoGeral || !valorInput.disciplina || !valorInput.periodo || !idTurma) {
      alert("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    try {
      const registro = new RegistroProfessorTurma();
      const turmaCompleta = await turmaDAO.getOne(idTurma);
      registro.turma = turmaCompleta;
      // Corrige o tipo do usuário para ser compatível com o modelo Usuario
      const usuario = new (await import("@/model/Usuario")).default();
      usuario.id = usuarioLogado.id;
      usuario.nome = usuarioLogado.nome;
      usuario.email = usuarioLogado.email;
      registro.usuario = usuario;
      registro.tipoRegistro = valorInput.tipoRegistro;
      registro.revisaoGeral = valorInput.revisaoGeral;
      registro.disciplina = valorInput.disciplina;
      registro.periodo = valorInput.periodo;
      registro.data = new Date();
      await registroProfessorTurmaDAO.inserir(registro);
      alert("Registro salvo com sucesso!");
      router.push(`/perfil/perfilTurma?id=${idTurma}`);
    } catch (e: any) {
      alert("Erro ao salvar registro: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center justify-center py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-blue-100 animate-fade-in flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
          <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">
            📝
          </span>
          Adicionar Registro da Turma
        </h1>
        <form
          onSubmit={submitForm}
          className="flex flex-col gap-7 w-full"
        >
          <div>
            <label htmlFor="tipoRegistro" className="block mb-2 text-lg font-semibold text-gray-700">Tipo de Registro</label>
            <select
              id="tipoRegistro"
              className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              value={valorInput.tipoRegistro}
              onChange={getInput}
              required
            >
              <option value="" disabled>Selecione o tipo de registro</option>
              <option value={TipoRegistro.MERITO}>Méritos</option>
              <option value={TipoRegistro.AVISO}>Avisos</option>
              <option value={TipoRegistro.DETALHE}>Detalhes</option>
            </select>
          </div>
          <div>
            <label htmlFor="disciplina" className="block mb-2 text-lg font-semibold text-gray-700">Disciplina</label>
            <input
              id="disciplina"
              type="text"
              className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              value={valorInput.disciplina}
              onChange={getInput}
              placeholder="Digite a disciplina"
              required
            />
          </div>
          <div>
            <label htmlFor="periodo" className="block mb-2 text-lg font-semibold text-gray-700">Período</label>
            <input
              id="periodo"
              type="text"
              className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              value={valorInput.periodo}
              onChange={getInput}
              placeholder="Digite o período"
              required
            />
          </div>
          <div>
            <label htmlFor="revisaoGeral" className="block mb-2 text-lg font-semibold text-gray-700">Descrição</label>
            <textarea
              id="revisaoGeral"
              className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
              value={valorInput.revisaoGeral}
              onChange={getInput}
              placeholder="Digite a descrição"
              rows={4}
              required
            />
          </div>
          <div className="flex gap-4 justify-end mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-full font-semibold shadow transition-all flex items-center gap-2"
              disabled={loading}
            >
              <span className="mr-2">↩️</span> Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-semibold shadow transition-all flex items-center gap-2"
              disabled={loading}
            >
              <span>💾</span> Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
