"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import turmaDAO from "@/DAOs/TurmaDAO";
import Turma from "@/model/Turma";
import Curso from "@/model/Curso";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase"; // ajuste o caminho conforme seu projeto

export default function EditarTurma() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [carregando, setCarregando] = useState(true);
    const [valorInput, setValorInput] = useState({
        nome: "",
        ano: "",
        idCurso: "",
        fotoUrl: ""
    });
    const [novaFoto, setNovaFoto] = useState<File | null>(null);
    const [removerFoto, setRemoverFoto] = useState(false);

    useEffect(() => {
        if (id) {
            turmaDAO.getOne(id)
                .then((turma: Turma) => {
                    console.log("TURMA CARREGADAAAAAA", turma)
                    setValorInput({
                        nome: turma.nome,
                        ano: turma.ano,
                        idCurso: turma.idCurso || (turma.curso ? turma.curso.id : ""),
                        fotoUrl: turma.fotoUrl || ""
                    });
                })
                .catch((e) => {
                    console.error("Erro ao buscar turma:", e.message);
                    alert("Erro ao carregar dados da turma");
                })
                .finally(() => setCarregando(false));
        }
    }, [id]);

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value, type, files } = event.target;
        if (type === "file") {
            setNovaFoto(files && files[0] ? files[0] : null);
            setRemoverFoto(false); // Se selecionar nova foto, não remover
        } else {
            setValorInput((prevState) => ({ ...prevState, [id]: value }));
        }
    }

    function handleRemoverFoto() {
        setRemoverFoto(true);
        setNovaFoto(null);
        setValorInput((prev) => ({ ...prev, fotoUrl: "" }));
    }

    async function editarTurma(e: FormEvent) {
        e.preventDefault();
        setCarregando(true);
        if (!id) {
            alert("ID da turma não encontrado!");
            setCarregando(false);
            return;
        }
        try {
            console.log("[EditarTurma] Iniciando atualização da turma...");
            const turma = new Turma();
            turma.idTurma = id;
            turma.nome = valorInput.nome;
            turma.ano = valorInput.ano;
            turma.idCurso = valorInput.idCurso;
            const curso = new Curso();
            curso.id = valorInput.idCurso;
            turma.curso = curso;
            console.log("[EditarTurma] Dados antes da foto:", turma);
            if (removerFoto) {
                turma.fotoUrl = "";
                console.log("[EditarTurma] Foto removida.");
            } else if (novaFoto) {
                const storageRef = ref(storage, `turmas/${id}/${novaFoto.name}`);
                console.log("[EditarTurma] Fazendo upload da nova foto:", novaFoto.name);
                await uploadBytes(storageRef, novaFoto);
                turma.fotoUrl = await getDownloadURL(storageRef);
                console.log("[EditarTurma] Nova fotoUrl obtida:", turma.fotoUrl);
            } else {
                turma.fotoUrl = valorInput.fotoUrl;
                console.log("[EditarTurma] Mantendo foto atual:", turma.fotoUrl);
            }
            console.log("[EditarTurma] Dados finais da turma para update:", turma);
            await turmaDAO.update(turma);
            console.log("[EditarTurma] Turma atualizada com sucesso!");
            alert("Turma atualizada com sucesso!");
            router.back();
        } catch (e: any) {
            console.error("[EditarTurma] Erro ao atualizar turma:", e);
            alert("Erro ao atualizar turma!");
        } finally {
            setCarregando(false);
        }
    }

    if (carregando) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-blue-100 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">👥</span>
                    Editar Turma
                </h1>
                <form onSubmit={editarTurma} className="flex flex-col gap-7">
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
                    {/* Preview da imagem atual */}
                    {valorInput.fotoUrl && !removerFoto && (
                        <div className="mt-4 flex flex-col items-center">
                            <p className="mb-2 text-blue-700 font-semibold">Foto atual:</p>
                            <Image src={valorInput.fotoUrl} alt="Foto atual" width={128} height={128} className="w-32 h-32 object-cover rounded-xl border-2 border-blue-200 shadow" />
                            <button
                                type="button"
                                onClick={handleRemoverFoto}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow transition-all"
                            >
                                Remover imagem
                            </button>
                        </div>
                    )}
                    {/* Upload de nova imagem */}
                    <div>
                        <label htmlFor="foto" className="block mb-2 text-lg font-semibold text-gray-700">Nova Foto da Turma (opcional)</label>
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
                            disabled={carregando}
                        >
                            {carregando ? <span className="animate-pulse">Salvando...</span> : <span>💾 Salvar Alterações</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}