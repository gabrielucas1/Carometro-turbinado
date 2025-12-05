"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import alunoDAO from "@/DAOs/AlunoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import Aluno from "@/model/Aluno";
import TurmaAluno from "@/model/TurmaAluno";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddAluno() {
    const router = useRouter();
    const searchParams = useSearchParams(); // kook para pegar os parâmetros da URL
    const idTurma = searchParams.get("idTurma"); // Captura o ID da turma da URL


    const [valorInput, setValorInput] = useState({
        nome: "",
        dataNascimento: "",
        telefone: "",
        cep: "",
        rua: "",
        bairro: "",
        numeroEndereco: "",
        estado: "",
        cidade: "",
        complemento: "",
        foto: null as File | null, // Adicione um estado para o arquivo de foto
    });

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value, type, files } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: type === "file" ? files?.[0] ?? null : value,
        }));
    }

    async function adicionarAluno(e: FormEvent) {
        e.preventDefault();

        if (!idTurma) {
            alert("ID da turma não foi fornecido.");
            return;
        }

        // Busca a turma completa para pegar o idEscola
        const turma = await turmaDAO.getOne(idTurma);
        if (!turma) {
            alert("Turma não encontrada.");
            return;
        }

        const idEscola = turma.curso?.escola?.id || "";

        const aluno = new Aluno();
        aluno.nome = valorInput.nome;
        aluno.dataNascimento = valorInput.dataNascimento;
        aluno.telefone = valorInput.telefone;
        aluno.cep = valorInput.cep;
        aluno.rua = valorInput.rua;
        aluno.bairro = valorInput.bairro;
        aluno.numeroEndereco = valorInput.numeroEndereco;
        aluno.estado = valorInput.estado;
        aluno.cidade = valorInput.cidade;
        aluno.complemento = valorInput.complemento;
        aluno.idTurma = idTurma;
        aluno.idEscola = idEscola;

        try {
            let fotoUrl = "";
            if (valorInput.foto) {
                // Converter para base64 (solução alternativa ao Firebase Storage)
                const reader = new FileReader();
                const base64Promise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
                    reader.readAsDataURL(valorInput.foto!);
                });
                
                fotoUrl = await base64Promise;
            }

            aluno.fotoUrl = fotoUrl; // Adicione a URL da foto ao aluno

            const idAluno = await alunoDAO.inserir(aluno);

            const turmaAluno = new TurmaAluno();
            turmaAluno.aluno = await alunoDAO.getOne(idAluno);
            turmaAluno.turma = turma;

            await turmaAlunoDAO.inserir(turmaAluno);

            alert("Aluno adicionado com sucesso!");
            router.push(`/listas/listaAlunos?idTurma=${idTurma}`);
        } catch (e: any) {

            alert("Erro ao adicionar aluno.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-blue-100 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">👤</span>
                    Adicionar Aluno
                </h1>
                <form onSubmit={adicionarAluno} className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome</label>
                        <input onChange={getInput} id="nome" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required placeholder="Digite o nome do aluno" />
                    </div>
                    <div>
                        <label htmlFor="dataNascimento" className="block mb-2 text-lg font-semibold text-gray-700">Data de Nascimento</label>
                        <input onChange={getInput} id="dataNascimento" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="date" required />
                    </div>
                    <div>
                        <label htmlFor="telefone" className="block mb-2 text-lg font-semibold text-gray-700">Telefone</label>
                        <input onChange={getInput} id="telefone" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required placeholder="(99) 99999-9999" />
                    </div>
                    <div>
                        <label htmlFor="cep" className="block mb-2 text-lg font-semibold text-gray-700">CEP</label>
                        <input onChange={getInput} id="cep" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required placeholder="00000-000" />
                    </div>
                    <div>
                        <label htmlFor="rua" className="block mb-2 text-lg font-semibold text-gray-700">Rua</label>
                        <input onChange={getInput} id="rua" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="bairro" className="block mb-2 text-lg font-semibold text-gray-700">Bairro</label>
                        <input onChange={getInput} id="bairro" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="numeroEndereco" className="block mb-2 text-lg font-semibold text-gray-700">Número do Endereço</label>
                        <input onChange={getInput} id="numeroEndereco" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="estado" className="block mb-2 text-lg font-semibold text-gray-700">Estado</label>
                        <input onChange={getInput} id="estado" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="cidade" className="block mb-2 text-lg font-semibold text-gray-700">Cidade</label>
                        <input onChange={getInput} id="cidade" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="complemento" className="block mb-2 text-lg font-semibold text-gray-700">Complemento</label>
                        <input onChange={getInput} id="complemento" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" />
                    </div>
                    <div>
                        <label htmlFor="foto" className="block mb-2 text-lg font-semibold text-gray-700">Foto do Aluno (opcional)</label>
                        <input onChange={getInput} id="foto" type="file" accept="image/*" className="border border-blue-200 p-3 rounded-xl w-full" />
                    </div>
                    <div className="flex gap-4 justify-end mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-full font-semibold shadow transition-all"
                        >
                            <span className="mr-2">↩️</span> Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-semibold shadow transition-all"
                        >
                            <span>➕ Adicionar</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}