"use client";

import { UserContext } from "@/contexts/UserContext";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function AddFuncionario() {
    const router = useRouter();
    const { usuarioLogado, atualizarUsuarioLogado } = useContext(UserContext);

    const [valorInput, setValorInput] = useState({
        nome: "",
        email: "",
        senha: "",
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
    });

    function getInput(event: React.ChangeEvent<HTMLInputElement>) {
        const { id, value, type, files } = event.target;
        setValorInput((prevState) => ({
            ...prevState,
            [id]: type === "file" ? files?.[0] ?? null : value,
        }));
    }

    async function uploadFoto(file: File): Promise<string> {
        const storage = getStorage();
        const fileRef = ref(storage, `funcionarios/${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }

    async function adicionarFuncionario(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validação dos campos obrigatórios
        if (!valorInput.nome || !valorInput.telefone || !valorInput.cep || !valorInput.email || !valorInput.senha) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (!usuarioLogado || !usuarioLogado.escola || !usuarioLogado.escola.id) {
            console.error("Erro: Usuário logado ou escola não estão definidos.");
            alert("Erro ao capturar a escola do usuário logado. Verifique as configurações.");
            return;
        }

        try {
            // Salva o usuário logado original
            const usuarioOriginal = usuarioLogado;

            // Cria o usuário no Authentication
            const cred = await createUserWithEmailAndPassword(auth, valorInput.email, valorInput.senha);

            const novoFuncionario = new Usuario();
            novoFuncionario.id = cred.user.uid;
            novoFuncionario.nome = valorInput.nome;
            novoFuncionario.email = valorInput.email;
            novoFuncionario.dataNascimento = valorInput.dataNascimento;
            novoFuncionario.celular = valorInput.telefone;
            novoFuncionario.CEP = valorInput.cep;
            novoFuncionario.rua = valorInput.rua;
            novoFuncionario.bairro = valorInput.bairro;
            novoFuncionario.numeroCasa = valorInput.numeroEndereco;
            novoFuncionario.estado = valorInput.estado;
            novoFuncionario.cidade = valorInput.cidade;
            novoFuncionario.complemento = valorInput.complemento;
            novoFuncionario.escola = { id: usuarioOriginal.escola.id };
            novoFuncionario.tipoUsuario = TipoUsuario.FUNCIONARIO;

            let fotoUrl = "";
            if (valorInput.foto) {
                fotoUrl = await uploadFoto(valorInput.foto);
            }
            novoFuncionario.fotoUrl = fotoUrl;

            await usuarioDAO.inserir(novoFuncionario);
            await auth.signOut(); // Faz logout do novo usuário criado
            atualizarUsuarioLogado(usuarioOriginal); // Restaura o contexto do usuário original
            alert("Funcionário adicionado com sucesso!");
            router.push("/listas/listaFuncionarios");
        } catch (error: any) {
            console.error("Erro ao adicionar funcionário:", error);
            alert("Erro ao adicionar funcionário. " + (error?.message || "Tente novamente."));
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white py-8">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-blue-100 animate-fade-in">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
                    <span className="inline-block bg-blue-100 rounded-full p-2 text-blue-600">👨‍🏫</span>
                    Adicionar Funcionário
                </h1>
                <form className="flex flex-col gap-7" onSubmit={adicionarFuncionario}>
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700" htmlFor="nome">Nome</label>
                        <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" id="nome" type="text" required placeholder="Digite o nome do funcionário" />
                    </div>
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700" htmlFor="email">E-mail</label>
                        <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" id="email" type="email" required placeholder="Digite o e-mail do funcionário" />
                    </div>
                    <div>
                        <label className="block mb-2 text-lg font-semibold text-gray-700" htmlFor="senha">Senha</label>
                        <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" id="senha" type="password" required placeholder="Digite uma senha" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="dataNascimento">Data de Nascimento</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="dataNascimento" type="date" placeholder="Data de Nascimento" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="telefone">Telefone</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="telefone" type="text" placeholder="Telefone" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="cep">CEP</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="cep" type="text" placeholder="CEP" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="rua">Rua</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="rua" type="text" placeholder="Rua" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="bairro">Bairro</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="bairro" type="text" placeholder="Bairro" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="numeroEndereco">Número</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="numeroEndereco" type="text" placeholder="Número da casa" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="estado">Estado</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="estado" type="text" placeholder="Estado" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="cidade">Cidade</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="cidade" type="text" placeholder="Cidade" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="complemento">Complemento</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="complemento" type="text" placeholder="Complemento" />
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-700" htmlFor="foto">Foto</label>
                            <input onChange={getInput} className="border border-blue-200 p-3 rounded-xl w-full" id="foto" type="file" />
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
                        >
                            <span>➕ Adicionar</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}