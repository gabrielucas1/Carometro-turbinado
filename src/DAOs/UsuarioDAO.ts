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
    /**
     * Retorna um objeto pronto para salvar no localStorage, incluindo idEscola direto no objeto.
     * Use após login/cadastro para garantir que o filtro funcione corretamente.
     */
    async getUsuarioComIdEscola(id: string) {
        const usuario = await this.getOne(id);
        // Log para depuração
        console.log('[getUsuarioComIdEscola] Usuario carregado:', usuario);
        const usuarioLocalStorage = {
            id: usuario.id,
            nome: usuario.nome,
            celular: usuario.celular,
            tipoUsuario: usuario.tipoUsuario,
            dataNascimento: usuario.dataNascimento,
            fotoUrl: usuario.fotoUrl,
            idEscola: usuario.escola?.id || '',
        };
        console.log('[getUsuarioComIdEscola] Objeto para localStorage:', usuarioLocalStorage);
        return usuarioLocalStorage;
    }
    async updateFotoUrl(id: string, fotoUrl: string) {
        try {
            const docRef = doc(db, "usuario", id);
            await updateDoc(docRef, { fotoUrl });
            console.log("Foto do usuário atualizada com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar a foto do usuário!");
        }
    }
    async updateNome(id: string, nome: string) {
        try {
            const docRef = doc(db, "usuario", id);
            await updateDoc(docRef, { nome });
            console.log("Nome atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar o nome!");
        }
    }

    async updateCelular(id: string, celular: string) {
        try {
            const docRef = doc(db, "usuario", id);
            await updateDoc(docRef, { celular });
            console.log("Celular atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar o celular!");
        }
    }
    async inserir(usuario: Usuario) {
        try {
            console.log("Dados enviados para o Firestore:", {
                tipoUsuario: usuario.tipoUsuario,
                nome: usuario.nome,
                email: usuario.email,
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
                fotoUrl: usuario.fotoUrl,
            });

            await setDoc(doc(db, "usuario", usuario.id), {
                tipoUsuario: usuario.tipoUsuario,
                nome: usuario.nome,
                email: usuario.email,
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
                fotoUrl: usuario.fotoUrl,
            });
            console.log("Usuário inserido com sucesso! ID:", usuario.id);
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
                usuario.fotoUrl = data.fotoUrl || "";

                // Log para depuração
                console.log('[getOne] Dados do Firestore:', data);

                if (data.idEscola && typeof data.idEscola === "string" && data.idEscola.trim() !== "") {
                    usuario.escola = await escolaDAO.getOne(data.idEscola); // Busca os dados completos da escola
                    usuario.escola.id = data.idEscola; // Adiciona o ID da escola ao objeto
                    console.log('[getOne] idEscola atribuído:', usuario.escola.id);
                } else {
                    console.warn("Nenhuma escola associada ao usuário ou ID inválido.");
                }
            } else {
                throw new Error("O documento não existe!");
            }

            // Log final do usuário retornado
            console.log('[getOne] Usuario retornado:', usuario);
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
                usuario.fotoUrl = data.fotoUrl || "";


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