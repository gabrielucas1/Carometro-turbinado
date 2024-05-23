import { auth, provider, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";

/*
    UsuarioAuthDAO É A CLASSE RESPONSAVEL PELO FIREBASE AUTENTICATION,
    EXISTE OUTRA CLASSE USUÁRIO, POIS NO FIREBASE AUTENTICATION, SO É
    POSSÍVEL SALVAR EMAIL E SENHA, E EU PRECISAVA DE CAMPOS A MAIS, 
    QUE EU COLOQUEI NO BANCO FIRESTORE, POR ISSO O OUTRO USUARIO
*/
export default class FBAutentication {
    static usuarioAuthLogado: User;

    //RETORNO PROMISSE, PORQUE O FIREBASE USA THEN-CATCH AQUI POR PADRÃO
    static login(email: string, password: string): Promise<boolean> {
        return new Promise((resolve) => {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    //USUÁRIO LOGADO
                    this.usuarioAuthLogado = userCredential.user;
                    resolve(true)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        })
    }

    static cadastro(email: string, password: string): Promise<boolean> {
        return new Promise((resolve) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    this.usuarioAuthLogado = userCredential.user;
                    resolve(true)
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        })
    }

    static loginGoogle() {
        return new Promise((resolve) => {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    // The signed-in user info.
                    this.usuarioAuthLogado = result.user;
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                    resolve(true)
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                });
        })
    }


}