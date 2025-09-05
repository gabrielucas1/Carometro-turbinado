"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import Usuario from "@/model/Usuario";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditarFuncionario() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [carregando, setCarregando] = useState(true);
    const [valorInput, setValorInput] = useState({
        nome: "",
        celular: "",
        tipoUsuario: "",
        fotoUrl: ""
    });

    const [novaFoto, setNovaFoto] = useState<File | null>(null);
    const [removerFoto, setRemoverFoto] = useState(false);

    useEffect(() => {
        if (id) {
            usuarioDAO.getOne(id)
                .then((usuario: Usuario) => {
                    setValorInput({
                        nome: usuario.nome || "",
                        celular: usuario.celular || "",
                        tipoUsuario: usuario.tipoUsuario || "",
                        fotoUrl: usuario.fotoUrl || ""
                    });
                })
                .catch((e) => {
                    console.error("Erro ao buscar funcionário:", e.message);
                    alert("Erro ao carregar dados do funcionário");
                })
                .finally(() => setCarregando(false));
        }
    }, [id]);

    function getInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = event.target;
        setValorInput((prevState) => ({ ...prevState, [id]: value }));
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

    async function editarFuncionario(e: FormEvent) {
        e.preventDefault();
        setCarregando(true);
        if (!id) {
            alert("ID do funcionário não encontrado!");
            setCarregando(false);
            return;
        }
        let fotoUrlFinal = valorInput.fotoUrl;
        try {
            if (removerFoto) {
                fotoUrlFinal = "";
            } else if (novaFoto) {
                const storage = getStorage();
                const storageRef = ref(storage, `usuarios/${id}/${novaFoto.name}`);
                await uploadBytes(storageRef, novaFoto);
                fotoUrlFinal = await getDownloadURL(storageRef);
            }
            const usuario = new Usuario();
            usuario.id = id;
            usuario.nome = valorInput.nome;
            usuario.celular = valorInput.celular;
            usuario.tipoUsuario = valorInput.tipoUsuario as unknown as Usuario["tipoUsuario"];
            usuario.fotoUrl = fotoUrlFinal;
            await Promise.all([
                usuarioDAO.updateTipoUsuario(id, usuario.tipoUsuario),
                usuarioDAO.updateNome(id, usuario.nome),
                usuarioDAO.updateCelular(id, usuario.celular),
                usuarioDAO.updateFotoUrl(id, usuario.fotoUrl)
            ]);
            alert("Funcionário atualizado com sucesso!");
            router.back();
        } catch (e: any) {
            console.error("Erro ao atualizar funcionário:", e.message);
            alert("Erro ao atualizar funcionário!");
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
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">👨‍🏫</span>
                    Editar Funcionário
                </h1>
                <form onSubmit={editarFuncionario} className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome do Funcionário</label>
                        <input
                            onChange={getInput}
                            id="nome"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.nome}
                            required
                            placeholder="Digite o nome do funcionário"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Foto do Funcionário</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            className="border border-blue-200 p-2 rounded-xl w-full bg-white text-gray-600 shadow-sm"
                        />
                        {valorInput.fotoUrl && !removerFoto && (
                            <div className="mt-2 flex flex-col items-center">
                                <img src={valorInput.fotoUrl as string} alt="Foto do funcionário" className="max-h-32 rounded-lg border" />
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
                        <label htmlFor="celular" className="block mb-2 text-lg font-semibold text-gray-700">Celular</label>
                        <input
                            onChange={getInput}
                            id="celular"
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            value={valorInput.celular}
                            required
                            placeholder="Digite o celular"
                        />
                    </div>
                    <div>
                        <label htmlFor="tipoUsuario" className="block mb-2 text-lg font-semibold text-gray-700">Tipo de Usuário</label>
                        <select
                            id="tipoUsuario"
                            value={valorInput.tipoUsuario}
                            onChange={getInput}
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="admEscola">Administrador Escola</option>
                            <option value="funcionario">Funcionário</option>
                        </select>
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