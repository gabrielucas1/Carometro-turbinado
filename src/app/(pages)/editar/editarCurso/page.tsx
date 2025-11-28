"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import cursoDAO from "@/DAOs/CursoDAO";
import Curso from "@/model/Curso";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function EditarCurso() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [carregando, setCarregando] = useState(true);


    const [valorInput, setValorInput] = useState({
        nome: "",
        turno: [] as string[],
        escolaNome: "",
        idEscola: "",
        fotoUrl: ""
    });

    const [novaFoto, setNovaFoto] = useState<File | null>(null);
    const [removerFoto, setRemoverFoto] = useState(false);

    useEffect(() => {
        if (id) {
            cursoDAO.getOne(id)
                .then((curso: Curso) => {
                    setValorInput({
                        nome: curso.nome,
                        turno: curso.turno || [],
                        escolaNome: curso.escola?.nome || "",
                        idEscola: curso.escola?.id || "",
                        fotoUrl: curso.fotoUrl || ""
                    });
                })
                .catch((e) => {
                    console.error("Erro ao buscar curso:", e.message);
                    alert("Erro ao carregar dados do curso");
                })
                .finally(() => {
                    setCarregando(false);
                });
        }
    }, [id]);

    function getInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value, type } = event.target;
        setValorInput((prevState) => ({
            ...prevState,
            [id]: type === "select-multiple" ? Array.from((event.target as HTMLSelectElement).selectedOptions, option => option.value) : value,
        }));
    }

    function handleFotoChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            setNovaFoto(event.target.files[0]);
            setRemoverFoto(false); // Se selecionar nova foto, não remover
        }
    }

    function handleRemoverFoto() {
        setRemoverFoto(true);
        setNovaFoto(null);
        setValorInput((prev) => ({ ...prev, fotoUrl: "" }));
    }

    async function editarCurso(e: FormEvent) {
        e.preventDefault();
        setCarregando(true);

        if (!id) {
            alert("ID do curso não encontrado!");
            setCarregando(false);
            return;
        }

        let fotoUrlFinal = valorInput.fotoUrl;

        try {
            if (removerFoto) {
                fotoUrlFinal = "";
            } else if (novaFoto) {
                const storage = getStorage();
                const storageRef = ref(storage, `cursos/${id}/${novaFoto.name}`);
                await uploadBytes(storageRef, novaFoto);
                fotoUrlFinal = await getDownloadURL(storageRef);
            }

            const curso = new Curso();
            curso.id = id;
            curso.nome = valorInput.nome;
            curso.turno = valorInput.turno;
            curso.escola.id = valorInput.idEscola;
            curso.fotoUrl = fotoUrlFinal;

            await cursoDAO.update(id, curso);
            alert("Curso atualizado com sucesso!");
            router.back();
        } catch (e: any) {
            console.error("Erro ao atualizar curso:", e.message);
            alert("Erro ao atualizar curso!");
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
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">📚</span>
                    Editar Curso
                </h1>
                <form onSubmit={editarCurso} className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome do Curso</label>
                        <input
                            onChange={getInput}
                            id="nome"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.nome}
                            required
                            placeholder="Digite o nome do curso"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Foto do Curso</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            className="border border-blue-200 p-2 rounded-xl w-full bg-white text-gray-600 shadow-sm"
                        />
                        {valorInput.fotoUrl && !removerFoto && (
                            <div className="mt-2 flex flex-col items-center">
                                <Image src={valorInput.fotoUrl as string} alt="Foto do curso" width={128} height={128} className="max-h-32 rounded-lg border" />
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
                    <div>
                        <label htmlFor="turno" className="block mb-2 text-lg font-semibold text-gray-700">Turnos</label>
                        <select
                            id="turno"
                            multiple
                            value={valorInput.turno}
                            onChange={getInput}
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                        >
                            <option value="Matutino">Matutino</option>
                            <option value="Vespertino">Vespertino</option>
                            <option value="Noturno">Noturno</option>
                        </select>
                        <p className="text-xs text-blue-500 mt-1">Segure <span className="font-bold">Ctrl</span> para selecionar mais de um turno</p>
                    </div>
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Escola</label>
                        <div className="flex items-center gap-2">
                            <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🏫</span>
                            <input
                                value={valorInput.escolaNome}
                                disabled
                                className="border border-blue-200 p-3 rounded-xl w-full bg-gray-100 text-gray-600 shadow-sm"
                            />
                        </div>
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