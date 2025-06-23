"use client"

import { ChangeEvent, useState } from "react";

interface Student {
    nome: string;
    dataNascimento: string;
    telefone: string;
    cep: string;
    rua: string;
    bairro: string;
    numeroEndereco: string;
    estado: string;
    cidade: string;
    complemento: string;
    turma: string;
}

export default function ImportarAluno() {
    const [fileName, setFileName] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [student, setStudent] = useState<Student | null>(null);

    async function submitArquivo(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files![0];
        const formData = new FormData();

        formData.append("file", file);
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setFileContent(content);
            const data = content.split(',');

            if (data.length >= 11) {
                const newStudent: Student = {
                    nome: data[0].trim(),
                    dataNascimento: data[1].trim(),
                    telefone: data[2].trim(),
                    cep: data[3].trim(),
                    rua: data[4].trim(),
                    bairro: data[5].trim(),
                    numeroEndereco: data[6].trim(),
                    estado: data[7].trim(),
                    cidade: data[8].trim(),
                    complemento: data[9].trim(),
                    turma: data[10].trim(),
                };
                setStudent(newStudent);
            }
        };
        reader.readAsText(file);
    }

    return (
        <>
            <h1 className="text-xl mt-4">Importar Aluno</h1>
            <div className="fixed bottom-4 flex flex-col items-center">
                {student && (
                    <div className="mt-2 mb-28">
                        <p>Nome: {student.nome}</p>
                        <p>Data de Nascimento: {student.dataNascimento}</p>
                        <p>Telefone: {student.telefone}</p>
                        <p>CEP: {student.cep}</p>
                        <p>Rua: {student.rua}</p>
                        <p>Bairro: {student.bairro}</p>
                        <p>Número: {student.numeroEndereco}</p>
                        <p>Estado: {student.estado}</p>
                        <p>Cidade: {student.cidade}</p>
                        <p>Complemento: {student.complemento}</p>
                        <p>Turma: {student.turma}</p>
                    </div>
                )}
                <button
                    className="bg-[#4514a3] flex items-center justify-center gap-4 font-bold py-4 px-20 text-white text-xl rounded-md shadow-md hover:bg-[#3b0f8c] transition-colors duration-300 cursor-pointer"
                    onClick={() => document.getElementById('file-upload')!.click()}
                >
                    <p className="text-2xl text-medium text-white">Enviar Arquivo</p>
                    <input id="file-upload" type="file" accept=".txt" onChange={submitArquivo} className="hidden" />
                </button>

                {fileName && <p className="mt-2">Arquivo enviado: {fileName}</p>}

                
            </div>
        </>
    );
}
