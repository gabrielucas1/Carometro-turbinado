import FBAutentication from "@/DAOs/FBAutentication"
import UsuarioDAO from "@/DAOs/UsuarioDAO";
import { useRouter } from 'next/navigation';

export default function LogarGoogle() {
  const router = useRouter()

  function logarGoogle() {
    FBAutentication.loginGoogle().then((logado) => {
      if (logado) {
        if (UsuarioDAO.getOne(FBAutentication.usuarioAuthLogado.uid) == null) {
          router.push("/outrasPaginas/tipoUsuario")
        } else {
          router.push("/outrasPaginas/menuPrincipal")
        }
      }
    })
  }

  return (
    <button onClick={logarGoogle} className="px-12 p-2 mt-8 border-2 border-slate-400 rounded-md">
      Logar com Google
    </button>
  )
}