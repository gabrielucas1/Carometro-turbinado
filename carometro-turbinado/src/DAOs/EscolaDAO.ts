import { db } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import Escola from "@/model/Escola";

class EscolaDAO {
    async inserir(escola: Escola) {
        try {
            const docRef = await addDoc(collection(db, "escola"), {
                cidade: escola.cidade,
                endereco: escola.endereco,
                nome: escola.nome,
                rede: escola.rede,
                tipoEnsino: escola.tipoEnsino
            });
            console.log("Escola inserida com sucesso! ID: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir escola: ", e);
        }
    }
}

const escolaDAO = new EscolaDAO();
export default escolaDAO