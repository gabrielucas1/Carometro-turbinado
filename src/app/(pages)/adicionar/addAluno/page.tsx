"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import alunoDAO from "@/DAOs/AlunoDAO";
import turmaDAO from "@/DAOs/TurmaDAO";
import turmaAlunoDAO from "@/DAOs/TurmaAlunoDAO";
import Aluno from "@/model/Aluno";
import TurmaAluno from "@/model/TurmaAluno";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebase";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddAluno() {
    const router = useRouter();
    const searchParams = useSearchParams(); // kook para pegar os parâmetros da URL
    const idTurma = searchParams.get("idTurma"); // Captura o ID da turma da URL

    console.log("ID da turma: ", idTurma);

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

        try {
            let fotoUrl = "";
            if (valorInput.foto) {
                // Upload da foto para o Firebase Storage
                const storageRef = ref(storage, `alunos/${valorInput.foto.name}`);
                await uploadBytes(storageRef, valorInput.foto);
                fotoUrl = await getDownloadURL(storageRef);
            }

            aluno.fotoUrl = fotoUrl; // Adicione a URL da foto ao aluno

            const idAluno = await alunoDAO.inserir(aluno);

            const turma = await turmaDAO.getOne(idTurma);
            if (!turma) {
                alert("Turma não encontrada.");
                return;
            }

            const turmaAluno = new TurmaAluno();
            turmaAluno.aluno = await alunoDAO.getOne(idAluno);
            turmaAluno.turma = turma;

            console.log(`ALUNO ID: ${turmaAluno.aluno.id}`);
            console.log(`TURMA ID: ${turmaAluno.turma.id}`);

            await turmaAlunoDAO.inserir(turmaAluno);

            alert("Aluno adicionado com sucesso!");
            router.push(`/listas/listaAlunos?idTurma=${idTurma}`);
        } catch (e: any) {
            console.log(e.message);
            alert("Erro ao adicionar aluno.");
        }
    }

    return (
        <>
            <h1>Adicionar Aluno</h1>

            <form onSubmit={adicionarAluno} className="flex flex-col px-96 w-full items-center">
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

                <button type="submit" className="w-40 text-lg mt-14 mb-10 bg-[#3579FF] py-2 px-10 text-white rounded-full hover:w-44 transition-all duration-200">
                    Adicionar
                </button>
            </form>
        </>
    );
}