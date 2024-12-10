import Turma from "@/model/Turma"
import { useRouter } from "next/navigation"

export default function TurmaCard({turma} : {turma: Turma}) {
    const router = useRouter()

    function navegarAlunos(idTurma: string) {
        router.push(`/listas/listaAlunos?idTurma=${idTurma}`)
    }

    return(
        <button onClick={() => navegarAlunos(turma.id)} key={turma.id} className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer">
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                    <p className="text-3xl">{turma.nome[0]}</p>
                </div>
                <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                    <p className="text-xl">{turma.nome}</p>
                    <div className="">
                        <p>{turma.ano}</p>
                    </div>
                </div>
        </button>
    )
}