import usuarioDAO from "@/DAOs/UsuarioDAO";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import Escola from "@/model/Escola";
import { useRouter } from "next/navigation";

export default function EscolaCard({ escola, idFuncionario }: { escola: Escola, idFuncionario: string | null }) {
    const router = useRouter()

    function navegarPerfil(idEscola: string) {
        router.push(`/perfil/perfilEscola?id=${idEscola}`)
    }

    async function virarADMEscola(escolaID: string) {
        try {
            await usuarioDAO.updateIdEscola(idFuncionario!, escolaID);
            await usuarioDAO.updateTipoUsuario(idFuncionario!, TipoUsuario.ADMESCOLA)
            router.push("/outrasPaginas/listas/listaADMEscola")
        } catch (e: any) {
            console.log(e.message)
        }
    }

    return(
        <button onClick={idFuncionario != null ? () => { virarADMEscola(escola.id) } : () => navegarPerfil(escola.id)} className="shadow-sm border-gray-900 border-1 bg-gray-50 rounded-lg w-96 h-32 p-3 flex hover:w-[25rem] transition-all cursor-pointer">
                <div className="border-gray-900 border-1 bg-white h-full w-20 flex items-center justify-center rounded-lg">
                    <p className="text-3xl">{escola.nome[0]}</p>
                </div>
                <div className="px-3 flex flex-col gap-3 text-start h-full py-1">
                    <p className="text-xl">{escola.nome}</p>
                    <div className="">
                        <p>{escola.estado}</p>
                        <p>{escola.cidade}</p>
                    </div>
                </div>
        </button>
    )
}