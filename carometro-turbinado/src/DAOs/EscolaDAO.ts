import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, QueryOrderByConstraint, setDoc } from "firebase/firestore";
import Escola from "@/model/Escola";

class EscolaDAO {
    //INSERIR
    async inserir(escola: Escola) {
        try {
            const docRef = await addDoc(collection(db, "escola"), {
                nome: escola.nome,
                cep: escola.cep,
                rua: escola.rua,
                bairro: escola.bairro,
                numeroCasa: escola.numeroCasa,
                complemento: escola.complemento,
                telefone: escola.telefone,
                estado: escola.estado,
                cidade: escola.cidade,
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
            const data = querySnapshot.data()

            escola.id = querySnapshot.id
            escola.nome = data.nome
            escola.cep = data.cep
            escola.rua = data.rua
            escola.bairro = data.bairro
            escola.numeroCasa = data.numeroCasa
            escola.complemento = data.complemento
            escola.telefone = data.telefone
            escola.estado = data.estado
            escola.cidade = data.cidade
            escola.rede = data.rede
            escola.tipoEnsino = data.tipoEnsino
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
            const data = doc.data(); // Obtém os dados do documento
            const escola: Escola = new Escola()

            escola.id = doc.id
            escola.nome = data.nome
            escola.cep = data.cep
            escola.rua = data.rua
            escola.bairro = data.bairro
            escola.numeroCasa = data.numeroCasa
            escola.complemento = data.complemento
            escola.telefone = data.telefone
            escola.estado = data.estado
            escola.cidade = data.cidade
            escola.rede = data.rede
            escola.tipoEnsino = data.tipoEnsino

            escolas.push(escola);
        });

        return escolas
    }

    //UPDATE
    async update(id: string, escola: Escola) {
        try {
            await setDoc(doc(db, "escola", id), {
                nome: escola.nome,
                cep: escola.cep,
                rua: escola.rua,
                bairro: escola.bairro,
                numeroCasa: escola.numeroCasa,
                complemento: escola.complemento,
                telefone: escola.telefone,
                estado: escola.estado,
                cidade: escola.cidade,
                rede: escola.rede,
                tipoEnsino: escola.tipoEnsino
            })
            console.log("Escola atualizada com sucesso!")
        } catch (e) {
            throw new Error("Erro ao atualizar escola!")
        }
    }


    //DELETE
    async deletar(id: string) {
        const docRef = doc(db, "escola", id)

        try {
            await deleteDoc(docRef)
            console.log("Escola excluida com sucesso!")
        } catch (e) {
            throw new Error("Erro ao deletar escola!")
        }
    }
}

const escolaDAO = new EscolaDAO();
export default escolaDAO