"use client"

import cursoDAO from "@/DAOs/CursoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import Turma from "@/model/Turma";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase";


export default function AddCurso() {
    const searchParams = useSearchParams();
    const idCurso = searchParams.get('idCurso');
    const router = useRouter();
    const [valorInput, setValorInput] = useState({
        nome: '',
        idCurso: "",
        ano: ""
    })
    const [foto, setFoto] = useState<File | null>(null);

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value, type, files } = event.target;
        if (type === "file") {
            setFoto(files && files[0] ? files[0] : null);
        } else {
            setValorInput((prevState) => ({
                ...prevState,
                [id]: value,
            }));
        }
    }

    async function adicionarCurso(e: FormEvent) {
        e.preventDefault();
        const turma = new Turma();
        turma.nome = valorInput.nome;
        turma.curso = await cursoDAO.getOne(idCurso!);
        turma.escola.id = turma.curso.escola.id
        turma.idCurso = idCurso!; // Adiciona o ID do curso
        turma.ano = valorInput.ano;

        // Upload da imagem, se houver
        if (foto) {
            const storageRef = ref(storage, `turmas/${Date.now()}_${foto.name}`);
            await uploadBytes(storageRef, foto);
            turma.fotoUrl = await getDownloadURL(storageRef);
        }

        try {
            await turmaDAO.inserir(turma);
            alert("Turma adicionada com sucesso!");
            router.push(`/listas/listaTurmas?id=${idCurso}`);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-blue-100 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🏫</span>
                    Adicionar Turma
                </h1>
                <form onSubmit={adicionarCurso} className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome da Turma</label>
                        <input
                            onChange={getInput}
                            id="nome"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.nome}
                            required
                            placeholder="Digite o nome da turma"
                        />
                    </div>
                    <div>
                        <label htmlFor="ano" className="block mb-2 text-lg font-semibold text-gray-700">Ano</label>
                        <input
                            onChange={getInput}
                            id="ano"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.ano}
                            required
                            placeholder="Digite o ano da turma"
                        />
                    </div>
                    <div>
                        <label htmlFor="foto" className="block mb-2 text-lg font-semibold text-gray-700">Foto da Turma (opcional)</label>
                        <input
                            id="foto"
                            type="file"
                            accept="image/*"
                            onChange={getInput}
                            className="border border-blue-200 p-3 rounded-xl w-full"
                        />
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
    )
}