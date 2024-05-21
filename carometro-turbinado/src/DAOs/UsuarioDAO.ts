import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import UsuarioFBDAO from "./FBAutentication";
import { db } from "@/firebase/firebase";
import Usuario from "@/model/Usuario";

/*
    EXISTEM 2 USUÁRIOS, PORQUE NA AUTENTICAÇÃO DO FIREBASE, SÓ É
    POSSÍVEL GUARDAR EMAIL E SENHA, E EU PRECISAVA DE CAMPOS EXTRAS,
    ENTÃO TIVE QUE CRIAR NO BANCO FIRESTORE UM USUARIO TAMBÉM, COM
    O INTUITO DE ARMAZENAR ESSES ATRIBUTOS EXTRAS
*/
export default class UsuarioDAO {
    static async inserir(usuario: Usuario) {
        try {
            const docRef = await addDoc(collection(db, "usuario"), {
                idAuth: UsuarioFBDAO.usuarioAuthLogado.uid,
                tipoUsuario: usuario.tipoUsuario,
            });
            console.log("Usuário inserido com sucesso! ID: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir o usuário: ", e);
        }
    }

    static async getOne(idAuth: string): Promise<Usuario | null> {
        const usuario = new Usuario()
        const q = query(collection(db, "usuario"), where("id", "==", idAuth));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null; // Retorna null se nenhum usuário for encontrado
        }

        const doc = querySnapshot.docs[0]
        usuario.id = doc.id
        usuario.idAuth = doc.data().idAuth
        usuario.tipoUsuario = doc.data().tipoUsuario

        return usuario
    }

    //GETALL

    //UPDATE

    //DELETE
}