import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import UsuarioFBDAO from "./FBAutentication";
import { db } from "@/firebase/firebase";
import Usuario from "@/model/Usuario";
import TipoUsuario from "@/model/Enums/TipoUsuario";
import escolaDAO from "./EscolaDAO";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";

/*
    EXISTEM 2 USUÁRIOS, PORQUE NA AUTENTICAÇÃO DO FIREBASE, SÓ É
    POSSÍVEL GUARDAR EMAIL E SENHA, E EU PRECISAVA DE CAMPOS EXTRAS,
    ENTÃO TIVE QUE CRIAR NO BANCO FIRESTORE UM USUARIO TAMBÉM, COM
    O INTUITO DE ARMAZENAR ESSES ATRIBUTOS EXTRAS
*/
class UsuarioDAO {
    async inserir(usuario: Usuario) {
        try {
            console.log("Dados enviados para o Firestore:", {
                tipoUsuario: usuario.tipoUsuario,
                nome: usuario.nome,
                idEscola: usuario.escola.id,
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

            const docRef = await addDoc(collection(db, "usuario"), {
                tipoUsuario: usuario.tipoUsuario,
                nome: usuario.nome,
                idEscola: usuario.escola.id,
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

            console.log("Usuário inserido com sucesso! ID:", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir o usuário:", e);
            throw new Error("Erro ao inserir o usuário!");
        }
    }

    async getOne(id: string): Promise<Usuario> {
        const usuario = new Usuario();

        try {
            const docRef = doc(db, "usuario", id);
            const querySnapshot = await getDoc(docRef);

            if (querySnapshot.exists()) {
                const data = querySnapshot.data();

                usuario.id = querySnapshot.id;
                usuario.nome = data.nome || "";
                usuario.celular = data.celular || "";
                usuario.tipoUsuario = data.tipoUsuario || "";
                usuario.dataNascimento = data.dataNascimento || "";

                if (data.idEscola && typeof data.idEscola === "string" && data.idEscola.trim() !== "") {
                    usuario.escola = await escolaDAO.getOne(data.idEscola); // Busca os dados completos da escola
                    usuario.escola.id = data.idEscola; // Adiciona o ID da escola ao objeto
                } else {
                    console.warn("Nenhuma escola associada ao usuário ou ID inválido.");
                }
            } else {
                throw new Error("O documento não existe!");
            }

            return usuario;
        } catch (e) {
            console.error(`Erro ao buscar o usuário com ID: ${id}. Detalhes:`, e);
            throw new Error("Erro ao pegar um documento!");
        }
    }

    async getAll(): Promise<Usuario[]> {
        try {
            const querySnapshot = await getDocs(collection(db, "usuario"));
            const usuarios: Usuario[] = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();
                const usuario: Usuario = new Usuario();

                usuario.id = doc.id;
                usuario.nome = data.nome || "";
                usuario.celular = data.celular || "";
                usuario.tipoUsuario = data.tipoUsuario || "";
                usuario.dataNascimento = data.dataNascimento || "";

                if (data.idEscola && typeof data.idEscola === "string" && data.idEscola.trim() !== "") {
                    usuario.escola = await escolaDAO.getOne(data.idEscola);
                    usuario.escola.id = data.idEscola; // Adiciona o ID da escola ao objeto
                }

                usuarios.push(usuario);
            }
            console.log("Usuarios retornados com sucesso!");
            return usuarios;
        } catch (e) {
            throw new Error("Erro ao pegar todos os usuarios");
        }
    }

    async updateTipoUsuario(id: string, tipoUsuario: TipoUsuario) {
        try {
            const docRef = doc(db, "usuario", id);
            await updateDoc(docRef, {
                tipoUsuario: tipoUsuario,
            });
            console.log("Tipo do Usuário atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar o Tipo do Usuário!");
        }
    }

    async updateIdEscola(idFuncionario: string, idEscola: string) {
        try {
            const docRef = doc(db, "usuario", idFuncionario);
            await updateDoc(docRef, {
                idEscola: idEscola,
            });
            console.log("idEscola atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar o idEscola!");
        }
    }

    async deletar(id: string) {
        try {
            const docRef = doc(db, "usuario", id);
            await deleteDoc(docRef);
            console.log("Usuário excluído com sucesso!");
        } catch (e) {
            throw new Error("Erro ao deletar usuário");
        }
    }
}

const usuarioDAO = new UsuarioDAO();
export default usuarioDAO;