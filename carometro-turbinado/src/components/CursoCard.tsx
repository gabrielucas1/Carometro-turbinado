import Curso from "@/model/Curso"
import { useRouter } from "next/navigation"

export default function CursoCard({curso} : {curso: Curso}) {
    const router = useRouter()

    function navegarTurmas(idCurso: string) {
        router.push(`/listas/listaTurmas?id=${idCurso}`)
    }

    return(
        <button className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer" onClick={() => navegarTurmas(curso.id)} key={curso.id}>
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                    <p className="text-3xl">{curso.nome[0]}</p>
                </div>
                <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                    <p className="text-xl">{curso.nome}</p>
                    <div className="">
                        {curso.turno.map((turno) => <p className="p-0 m-0" key={turno}>{`${turno}`}</p>)}
                    </div>
                </div>
        </button>

    )
}