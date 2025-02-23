import Aluno from "@/model/Aluno";
import { useRouter } from "next/navigation";
import Image from 'next/image'

export default function AlunoCard({ aluno }: { aluno: Aluno }) {
    const router = useRouter()

    console.log("ALUNO1:", aluno);

    function navegarPerfilAluno(idTurma: string) {
        router.push(`/perfil/perfilAluno?id=${idTurma}`)
    }

    return (
        <button className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer" onClick={() => navegarPerfilAluno(aluno.id)} key={aluno.id}>
            <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                <img src={aluno.fotoUrl} width={150} className="rounded-lg shadow-sm" alt={`Foto do Aluno ${aluno.nome}`} />
            </div>
            <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                <p className="text-xl">{aluno.nome}</p>
                <div className="">
                    <p>{aluno.dataNascimento}</p>
                </div>
            </div>
        </button>
    )
}