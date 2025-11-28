"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import alunoDAO from "@/DAOs/AlunoDAO";
import Aluno from "@/model/Aluno";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function EditAluno() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [carregando, setCarregando] = useState(true);
    const [alunoOriginal, setAlunoOriginal] = useState<Aluno | null>(null);

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
        foto: null as File | null,
        fotoUrl: ""
    });


    useEffect(() => {
        if (id) {
            alunoDAO.getOne(id)
                .then((aluno) => {
                    setAlunoOriginal(aluno);
                    setValorInput({
                        nome: aluno.nome,
                        dataNascimento: aluno.dataNascimento,
                        telefone: aluno.telefone,
                        cep: aluno.cep,
                        rua: aluno.rua,
                        bairro: aluno.bairro,
                        numeroEndereco: aluno.numeroEndereco,
                        estado: aluno.estado,
                        cidade: aluno.cidade,
                        complemento: aluno.complemento,
                        foto: null,
                        fotoUrl: aluno.fotoUrl
                    });
                })
                .catch((e) => {
                    console.error("Erro ao buscar aluno:", e.message);
                    alert("Erro ao carregar dados do aluno");
                })
                .finally(() => {
                    setCarregando(false);
                });
        }
    }, [id]);

    function getInput(event: ChangeEvent<HTMLInputElement>) {
        const { id, value, type, files } = event.target;

        setValorInput((prevState) => ({
            ...prevState,
            [id]: type === "file" ? files?.[0] ?? null : value,
        }));
    }

    async function editarAluno(e: FormEvent) {
        e.preventDefault();
        setCarregando(true);

        if (!id) {
            alert("ID do aluno não encontrado!");
            return;
        }

        try {
            if (!alunoOriginal) {
                alert("Dados do aluno não carregados!");
                return;
            }

            const aluno = new Aluno();
            aluno.id = id;
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
            // Preservar campos importantes do aluno original
            aluno.idTurma = alunoOriginal.idTurma;
            aluno.idEscola = alunoOriginal.idEscola;

            // Se uma nova foto foi selecionada, fazer upload
            if (valorInput.foto) {
                const storageRef = ref(storage, `alunos/${valorInput.foto.name}`);
                await uploadBytes(storageRef, valorInput.foto);
                aluno.fotoUrl = await getDownloadURL(storageRef);
            } else {
                // Manter a foto atual
                aluno.fotoUrl = valorInput.fotoUrl;
            }

            await alunoDAO.update(aluno);
            alert("Aluno atualizado com sucesso!");
            router.back(); // Volta para a página anterior
        } catch (e: any) {
            console.error("Erro ao atualizar aluno:", e.message);
            alert("Erro ao atualizar aluno!");
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
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🧑‍🎓</span>
                    Editar Aluno
                </h1>
                <form onSubmit={editarAluno} className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome</label>
                        <input
                            onChange={getInput}
                            id="nome"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.nome}
                            required
                            placeholder="Digite o nome do aluno"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cep" className="block mb-2 text-lg font-semibold text-gray-700">CEP</label>
                            <input
                                onChange={getInput}
                                id="cep"
                                className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                value={valorInput.cep}
                                required
                                placeholder="CEP"
                            />
                        </div>
                        <div>
                            <label htmlFor="numeroEndereco" className="block mb-2 text-lg font-semibold text-gray-700">Número</label>
                            <input
                                onChange={getInput}
                                id="numeroEndereco"
                                className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                value={valorInput.numeroEndereco}
                                required
                                placeholder="Número"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="rua" className="block mb-2 text-lg font-semibold text-gray-700">Rua</label>
                            <input
                                onChange={getInput}
                                id="rua"
                                className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                value={valorInput.rua}
                                required
                                placeholder="Rua"
                            />
                        </div>
                        <div>
                            <label htmlFor="bairro" className="block mb-2 text-lg font-semibold text-gray-700">Bairro</label>
                            <input
                                onChange={getInput}
                                id="bairro"
                                className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                value={valorInput.bairro}
                                required
                                placeholder="Bairro"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="estado" className="block mb-2 text-lg font-semibold text-gray-700">Estado</label>
                            <input
                                onChange={getInput}
                                id="estado"
                                className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                value={valorInput.estado}
                                required
                                placeholder="Estado"
                            />
                        </div>
                        <div>
                            <label htmlFor="cidade" className="block mb-2 text-lg font-semibold text-gray-700">Cidade</label>
                            <input
                                onChange={getInput}
                                id="cidade"
                                className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                                value={valorInput.cidade}
                                required
                                placeholder="Cidade"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="complemento" className="block mb-2 text-lg font-semibold text-gray-700">Complemento</label>
                        <input
                            onChange={getInput}
                            id="complemento"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.complemento}
                            placeholder="Complemento"
                        />
                    </div>
                    <div>
                        <label htmlFor="telefone" className="block mb-2 text-lg font-semibold text-gray-700">Telefone</label>
                        <input
                            onChange={getInput}
                            id="telefone"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.telefone}
                            required
                            placeholder="Telefone"
                        />
                    </div>
                    <div>
                        <label htmlFor="dataNascimento" className="block mb-2 text-lg font-semibold text-gray-700">Data de Nascimento</label>
                        <input
                            onChange={getInput}
                            id="dataNascimento"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.dataNascimento}
                            placeholder="DD/MM/AAAA"
                        />
                    </div>
                    {valorInput.fotoUrl && (
                        <div className="mt-4 flex flex-col items-center">
                            <p className="mb-2 text-blue-700 font-semibold">Foto atual:</p>
                            <img src={valorInput.fotoUrl} alt="Foto atual" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-200 shadow" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="foto" className="block mb-2 text-lg font-semibold text-gray-700">Nova Foto (opcional)</label>
                        <input
                            onChange={getInput}
                            id="foto"
                            type="file"
                            accept="image/*"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-4 justify-end mt-6">
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