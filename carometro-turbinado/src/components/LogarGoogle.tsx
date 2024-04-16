import UsuarioDAO from "@/model/UsuarioDAO"
import { useRouter } from 'next/navigation';

export default function LogarGoogle(){
    const router = useRouter()

    function logarGoogle(){
        UsuarioDAO.loginGoogle().then((logado) => {
          if(logado){
            router.push("/bem-vindo")
          }
        })
    }

    return(
        <button onClick={logarGoogle} className="px-12 p-2 mt-8 border-2 border-slate-400 rounded-md">
          Logar com Google
        </button>
    )
}