import Usuario from "@/model/Usuario"
import { useRouter } from "next/navigation"

export default function FuncionarioCard({funcionario}: {funcionario: Usuario}) {
    const router = useRouter()

    console.log(`Funcionario: ${funcionario.dataNascimento}`)
    function navegarPerfil(idFuncionario: string) {
        router.push(`/perfil/perfilFuncionario?id=${idFuncionario}`)
    }
    
    return(
        <button onClick={() => navegarPerfil(funcionario.id)} key={funcionario.id} className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer">
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                    <p className="text-3xl">{funcionario.nome[0]}</p>
                </div>
                <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                    <p className="text-xl">{funcionario.nome}</p>
                    <div className="">
                        <p>{funcionario.dataNascimento}</p>
                    </div>
                </div>
        </button>
    )
}