"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import Usuario from "@/model/Usuario";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import escolaDAO from "@/DAOs/EscolaDAO";
import Escola from "@/model/Escola";

export default function AddADMEscola() {
    const router = useRouter();

    const [valorInput, setValorInput] = useState({
        nome: "",
        celular: "",
        email: "",
        senha: "",
        foto: null as File | null,
        escolaId: "",
        CEP: "",
        rua: "",
        bairro: "",
        complemento: "",
        numeroCasa: "",
        estado: "",
        cidade: "",
        dataNascimento: ""
    });

    const [escolas, setEscolas] = useState<Escola[]>([]);

    useEffect(() => {
        // Busca todas as escolas para o select
        escolaDAO.getAll().then((escolas) => setEscolas(escolas));
    }, []);

    function getInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const { id, value } = target;
        if (target instanceof HTMLInputElement && target.type === "file") {
            setValorInput((prevState) => ({
                ...prevState,
                [id]: target.files?.[0] ?? null,
            }));
        } else {
            setValorInput((prevState) => ({
                ...prevState,
                [id]: value,
            }));
        }
    }

    async function adicionarADM(e: FormEvent) {
        e.preventDefault();
        try {
            // Cria o usuário no Authentication
            const cred = await createUserWithEmailAndPassword(auth, valorInput.email, valorInput.senha);

            const usuario = new Usuario();
            usuario.id = cred.user.uid; // Usa o UID do Auth

            usuario.nome = valorInput.nome;
            usuario.celular = valorInput.celular;
            usuario.email = valorInput.email;
            usuario.tipoUsuario = TipoUsuario.ADMESCOLA;
            usuario.escola = { id: valorInput.escolaId };
            usuario.CEP = valorInput.CEP;
            usuario.rua = valorInput.rua;
            usuario.bairro = valorInput.bairro;
            usuario.complemento = valorInput.complemento;
            usuario.numeroCasa = valorInput.numeroCasa;
            usuario.estado = valorInput.estado;
            usuario.cidade = valorInput.cidade;
            usuario.dataNascimento = valorInput.dataNascimento;

            let fotoUrl = "";
            if (valorInput.foto) {
                const storageRef = ref(storage, `usuarios/${valorInput.foto.name}`);
                await uploadBytes(storageRef, valorInput.foto);
                fotoUrl = await getDownloadURL(storageRef);
            }
            usuario.fotoUrl = fotoUrl;

            await usuarioDAO.inserir(usuario);
            alert("Administrador de escola adicionado com sucesso!");
            router.push("/listas/listaADMEscola");
        } catch (e: any) {
            console.log(e.message);
            alert("Erro ao adicionar administrador: " + e.message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-blue-100 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">🏫</span>
                    Adicionar Administrador de Escola
                </h1>
                <form onSubmit={adicionarADM} className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-lg font-semibold text-gray-700">Nome</label>
                        <input onChange={getInput} id="nome" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required placeholder="Digite o nome do administrador" />
                    </div>
                    <div>
                        <label htmlFor="celular" className="block mb-2 text-lg font-semibold text-gray-700">Celular</label>
                        <input onChange={getInput} id="celular" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required placeholder="(99) 99999-9999" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-lg font-semibold text-gray-700">E-mail</label>
                        <input onChange={getInput} id="email" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="email" required placeholder="Digite o e-mail do administrador" />
                    </div>
                    <div>
                        <label htmlFor="senha" className="block mb-2 text-lg font-semibold text-gray-700">Senha</label>
                        <input onChange={getInput} id="senha" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="password" required placeholder="Digite uma senha" />
                    </div>
                    <div>
                        <label htmlFor="escolaId" className="block mb-2 text-lg font-semibold text-gray-700">Escola</label>
                        <select
                            id="escolaId"
                            value={valorInput.escolaId}
                            onChange={getInput}
                            className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
                            required
                        >
                            <option value="">Selecione a escola</option>
                            {escolas.map((escola) => (
                                <option key={escola.id} value={escola.id}>{escola.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dataNascimento" className="block mb-2 text-lg font-semibold text-gray-700">Data de Nascimento</label>
                        <input onChange={getInput} id="dataNascimento" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="date" required />
                    </div>
                    <div>
                        <label htmlFor="CEP" className="block mb-2 text-lg font-semibold text-gray-700">CEP</label>
                        <input onChange={getInput} id="CEP" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required placeholder="00000-000" />
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
                        <label htmlFor="numeroCasa" className="block mb-2 text-lg font-semibold text-gray-700">Número</label>
                        <input onChange={getInput} id="numeroCasa" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="complemento" className="block mb-2 text-lg font-semibold text-gray-700">Complemento</label>
                        <input onChange={getInput} id="complemento" className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" type="text" />
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
                        <label htmlFor="foto" className="block mb-2 text-lg font-semibold text-gray-700">Foto do Administrador (opcional)</label>
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