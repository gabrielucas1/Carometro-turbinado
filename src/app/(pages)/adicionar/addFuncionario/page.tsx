"use client";

import { UserContext } from "@/contexts/UserContext";
import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Usuario from "@/model/Usuario";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddFuncionario() {
    const router = useRouter();
    const { usuarioLogado } = useContext(UserContext); // Captura o usuário logado

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
        if (!valorInput.nome || !valorInput.telefone || !valorInput.cep) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const novoFuncionario = new Usuario();
        novoFuncionario.nome = valorInput.nome;
        novoFuncionario.dataNascimento = valorInput.dataNascimento;
        novoFuncionario.celular = valorInput.telefone;
        novoFuncionario.CEP = valorInput.cep;
        novoFuncionario.rua = valorInput.rua;
        novoFuncionario.bairro = valorInput.bairro;
        novoFuncionario.numeroCasa = valorInput.numeroEndereco;
        novoFuncionario.estado = valorInput.estado;
        novoFuncionario.cidade = valorInput.cidade;
        novoFuncionario.complemento = valorInput.complemento;

        if (!usuarioLogado || !usuarioLogado.escola || !usuarioLogado.escola.id) {
            console.error("Erro: Usuário logado ou escola não estão definidos.");
            alert("Erro ao capturar a escola do usuário logado. Verifique as configurações.");
            return;
        }

        novoFuncionario.escola = { id: usuarioLogado.escola.id }; // Captura o idEscola automaticamente
        novoFuncionario.tipoUsuario = TipoUsuario.FUNCIONARIO;

        try {
            let fotoUrl = "";
            if (valorInput.foto) {
                fotoUrl = await uploadFoto(valorInput.foto);
            }

            //novoFuncionario.foto = fotoUrl;

            console.log("Dados do funcionário antes de inserir:", novoFuncionario);

            await usuarioDAO.inserir(novoFuncionario);
            alert("Funcionário adicionado com sucesso!");
            router.push("/listas/listaFuncionarios");
        } catch (error) {
            console.error("Erro ao adicionar funcionário:", error);
            alert("Erro ao adicionar funcionário. Tente novamente.");
        }
    }

    return (
        <>
            <h1>Adicionar Funcionário</h1>

            <form onSubmit={adicionarFuncionario} className="flex flex-col px-96 w-full items-center">
                <label className="mt-6 self-start" htmlFor="nome">Nome</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="nome" type="text" />

                <label className="mt-4 self-start" htmlFor="dataNascimento">Data de Nascimento</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="dataNascimento" type="text" />

                <label className="mt-4 self-start" htmlFor="telefone">Telefone</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="telefone" type="text" />

                <label className="mt-4 self-start" htmlFor="cep">CEP</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="cep" type="text" />

                <label className="mt-4 self-start" htmlFor="rua">Rua</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="rua" type="text" />

                <label className="mt-4 self-start" htmlFor="bairro">Bairro</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="bairro" type="text" />

                <label className="mt-4 self-start" htmlFor="numeroEndereco">Número do Endereço</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="numeroEndereco" type="text" />

                <label className="mt-4 self-start" htmlFor="estado">Estado</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="estado" type="text" />

                <label className="mt-4 self-start" htmlFor="cidade">Cidade</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="cidade" type="text" />

                <label className="mt-4 self-start" htmlFor="complemento">Complemento</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="complemento" type="text" />

                <label className="mt-4 self-start" htmlFor="foto">Foto</label>
                <input onChange={getInput} className="border-2 w-full rounded h-10" id="foto" type="file" />

                <button
                    type="submit"
                    className="w-40 text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:w-44 transition-all duration-200"
                >
                    Adicionar
                </button>
            </form>
        </>
    );
}