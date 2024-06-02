import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import UsuarioFBDAO from "./FBAutentication";
import { db } from "@/firebase/firebase";
import Usuario from "@/model/Usuario";
import TipoUsuario from "@/model/Enums/TipoUsuario";

/*
    EXISTEM 2 USUÁRIOS, PORQUE NA AUTENTICAÇÃO DO FIREBASE, SÓ É
    POSSÍVEL GUARDAR EMAIL E SENHA, E EU PRECISAVA DE CAMPOS EXTRAS,
    ENTÃO TIVE QUE CRIAR NO BANCO FIRESTORE UM USUARIO TAMBÉM, COM
    O INTUITO DE ARMAZENAR ESSES ATRIBUTOS EXTRAS
*/
class UsuarioDAO {
    async inserir(usuario: Usuario) {
        try {
            //UTILIZO O MESMO ID DA AUTENTICATION PARA LIGAR O DOCUMENTO USUÁRIO DO
            //FIRESTORE COM O USUARIO LOGADO NO AUTENTICATION
            const idDoc = UsuarioFBDAO.usuarioAuthLogado.uid

            await setDoc(doc(db, "usuario", idDoc), {
                tipoUsuario: usuario.tipoUsuario,
                nome: usuario.nome,
                CEP: usuario.CEP,
                rua: usuario.rua,
                bairro: usuario.bairro,
                complemento: usuario.complemento,
                numeroCasa: usuario.numeroCasa,
                estado: usuario.estado,
                cidade: usuario.cidade,
                dataNascimento: usuario.dataNascimento,
                celular: usuario.celular,
            });
            console.log("Usuário inserido com sucesso!")
        } catch (e) {
            throw new Error("Erro ao inserir o usuário!")
        }
    }

    async getOne(id: string): Promise<Usuario> {
        const usuario = new Usuario()

        try {
            const docRef = doc(db, "usuario", id)

            const querySnapshot = await getDoc(docRef)

            if (querySnapshot.exists()) {
                usuario.id = querySnapshot.id
                usuario.nome = querySnapshot.data().nome
                usuario.celular = querySnapshot.data().celular
                usuario.tipoUsuario = querySnapshot.data().tipoUsuario
            } else {
                throw new Error("O documento não existe!")
            }

            return usuario
        } catch (e) {
            throw new Error("Erro ao pegar um documento!")
        }
    }

    //GETALL
    async getAll(): Promise<Usuario[]> {
        try {
            const querySnapshot = await getDocs(collection(db, "usuario"));
            const usuarios: Usuario[] = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const usuarioData = doc.data(); // Obtém os dados do documento
                const usuario: Usuario = new Usuario()

                usuario.id = doc.id
                usuario.idAuth = usuarioData.idAuth
                usuario.nome = usuarioData.nome
                usuario.celular = usuarioData.celular

                usuarios.push(usuario);
            });

            return usuarios
        } catch (e) {
            throw new Error("Erro ao pegar todas as escolas")
        }
    }

    //UPDATE
    async updateTipoUsuario(id: string, tipoUsuario: TipoUsuario) {
        try {
            const docRef = doc(db, "usuario", id)
            await updateDoc(docRef, {
                tipoUsuario: tipoUsuario
            })
            console.log("Tipo do Usuário atualizado com sucesso!")
        } catch (e) {
            throw new Error("Erro ao atualizar o Tipo do Usuário!")
        }
    }

    //DELETE
    async deletar(id: string) {
        try {
            const docRef = doc(db, "usuario", id)
            await deleteDoc(docRef)
            console.log("usuário excluido com sucesso!")
        } catch (e) {
            throw new Error("Erro ao deletar usuário")
        }
    }
}

const usuarioDAO = new UsuarioDAO()
export default usuarioDAO