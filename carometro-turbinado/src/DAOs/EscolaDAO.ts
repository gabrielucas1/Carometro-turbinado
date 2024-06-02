import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import Escola from "@/model/Escola";

class EscolaDAO {
    //INSERIR
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

    //GETONE
    async getOne(id: string): Promise<Escola> {
        const escola = new Escola()

        const docRef = doc(db, "escola", id)
        const querySnapshot = await getDoc(docRef)
        if (querySnapshot.exists()) {
            escola.nome = querySnapshot.data().nome
            escola.endereco = querySnapshot.data().nome
        } else {
            throw new Error('Erro ao buscar uma escola!')
        }

        return escola;
    }

    //GETALL
    async getAll(): Promise<Escola[]> {
        const querySnapshot = await getDocs(collection(db, "escola"));
        const escolas: Escola[] = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const escolaData = doc.data(); // Obtém os dados do documento
            const escola: Escola = new Escola()

            escola.id = doc.id
            escola.nome = escolaData.nome
            escola.endereco = escolaData.endereco
            escola.cidade = escolaData.cidade
            escola.rede = escolaData.rede
            escola.tipoEnsino = escolaData.tipoEnsino

            escolas.push(escola);
        });

        return escolas
    }

    //UPDATE
    


    //DELETE
    async deletar(id: string) {
        const docRef = doc(db, "escola", id)

        try {
            await deleteDoc(docRef)
        } catch (e) {
            throw new Error("Erro ao deletar escola!")
        }
    }
}

const escolaDAO = new EscolaDAO();
export default escolaDAO