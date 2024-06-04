import { auth, provider, db } from "@/firebase/firebase";
import Usuario from "@/model/Usuario";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";

/*
    UsuarioAuthDAO É A CLASSE RESPONSAVEL PELO FIREBASE AUTENTICATION,
    EXISTE OUTRA CLASSE USUÁRIO, POIS NO FIREBASE AUTENTICATION, SO É
    POSSÍVEL SALVAR EMAIL E SENHA, E EU PRECISAVA DE CAMPOS A MAIS, 
    QUE EU COLOQUEI NO BANCO FIRESTORE, POR ISSO O OUTRO USUARIO
*/
export default class FBAutentication {
    static usuarioLogado: Usuario = new Usuario();

    //RETORNO PROMISSE, PORQUE O FIREBASE USA THEN-CATCH AQUI POR PADRÃO
    static async login(email: string, password: string) {

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            this.usuarioLogado.id = userCredential.user.uid
        } catch (erro) {
            throw new Error("Erro no Login!")
        }

        /*
        return new Promise((resolve) => {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    //USUÁRIO LOGADO
                    this.usuarioAuthLogado = userCredential.user;
                    resolve(true)
                })
                .catch((error) => {
                    console.log("Login falhou!" + error)
                });
        })
        */
    }

    static async cadastro(email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            this.usuarioLogado.id = userCredential.user.uid
        } catch (erro) {
            throw new Error("Erro no Cadastro!")
        }
    }

    static loginGoogle() {
        return new Promise((resolve) => {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    // The signed-in user info.
                    //this.usuarioAuthLogado = result.user;
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                    resolve(true)
                }).catch((erro) => {
                    // Handle Errors here.
                    const errorCode = erro.code;
                    const errorMessage = erro.message;
                    // The email of the user's account used.
                    const email = erro.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(erro);
                    // ...
                });
        })
    }


}