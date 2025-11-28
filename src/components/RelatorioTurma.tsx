import { useEffect, useState } from "react";
import registroVidaAlunoDAO from "@/DAOs/RegistroVidaAlunoDAO";
import RegistroVidaAluno from "@/model/RegistroVidaAluno";

export default function RelatorioTurma({ turmaId }: { turmaId: string }) {
    const [registros, setRegistros] = useState<RegistroVidaAluno[]>([]);

    useEffect(() => {
        registroVidaAlunoDAO.getRegistrosByTurmaId(turmaId)
            .then(setRegistros)
            .catch(() => setRegistros([]));
    }, [turmaId]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Registros dos Alunos</h2>
            {registros.length === 0 ? (
                <p className="text-gray-500">Nenhum registro encontrado.</p>
            ) : (
                <ul className="space-y-4">
                    {registros.map(registro => (
                        <li key={registro.id} className="border p-4 rounded-lg shadow">
                            <p style={{ color: '#000000' }}><strong>Aluno:</strong> {registro.idAluno}</p>
                            <p style={{ color: '#000000' }}><strong>Descrição:</strong> {registro.descricao}</p>
                            <p style={{ color: '#000000' }}><strong>Professor:</strong> {registro.nomeProfessor}</p>
                            <p style={{ color: '#000000' }}><strong>Data:</strong> {registro.data.toString()}</p>
                            <p style={{ color: '#000000' }}><strong>Tipo:</strong> {registro.tipoRegistro}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export {};