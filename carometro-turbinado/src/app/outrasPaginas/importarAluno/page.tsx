"use client"

import { ChangeEvent, useState } from "react";

export default function ImportarAluno() {
    const [fileName, setFileName] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [studentName, setStudentName] = useState("");

    async function submitArquivo(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files![0];
        const formData = new FormData();

        formData.append("file", file);
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setFileContent(content);
            const regex = /nome:\s*(.*)/i;
            const match = content.match(regex);
            if (match) {
                setStudentName(match[1]);
            }
        };
        reader.readAsText(file);
    }

    return (
        <>
            <h1>Importar Aluno</h1>
            <div className="fixed bottom-4 flex flex-col items-center">
                <button
                    className="bg-[#4514a3] flex items-center justify-center gap-4 font-bold py-4 px-20 text-white text-xl rounded-md shadow-md hover:bg-[#3b0f8c] transition-colors duration-300 cursor-pointer"
                    onClick={() => document.getElementById('file-upload')!.click()}
                >
                    <p className="text-2xl text-medium text-white">Enviar Arquivo</p>
                    <input id="file-upload" type="file" accept=".txt" onChange={submitArquivo} className="hidden" />
                </button>

                {fileName && <p className="mt-2">Arquivo enviado: {fileName}</p>}

                {studentName && <p className="mt-2">Nome extraído: {studentName}</p>}
            </div>
        </>
    );
}
