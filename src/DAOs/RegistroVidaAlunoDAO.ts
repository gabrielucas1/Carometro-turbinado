import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import RegistroVidaAluno from "@/model/RegistroVidaAluno";
import TipoRegistro from "@/model/Enums/TipoRegistro";

class RegistroVidaAlunoDAO {
    // INSERIR
    async inserir(registro: RegistroVidaAluno) {
        try {
            const docRef = await addDoc(collection(db, "registroVidaAluno"), {
                tipoRegistro: registro.tipoRegistro,
                descricao: registro.descricao,
                idAluno: registro.idAluno,
                nomeProfessor: registro.nomeProfessor,
                data: Timestamp.fromDate(registro.data),
            });
            console.log("Registro de vida de aluno inserido com sucesso! ID: ", docRef.id);
        } catch (e) {
            throw new Error("Erro ao inserir registro de vida de aluno: " + e);
        }
    }

    //GETONE NÃO EXISTE, POIS NÃO HÁ NECESSIDADE

    // GETALL
    async getAll(idAluno: String): Promise<RegistroVidaAluno[]> {
        const querySnapshot = await getDocs(collection(db, "registroVidaAluno"));
        const registros: RegistroVidaAluno[] = [];
        for (const doc of querySnapshot.docs) {
            if (doc.data().idAluno === idAluno) {
                const data = doc.data();
                const registro = new RegistroVidaAluno();

                registro.id = doc.id
                registro.tipoRegistro = data.tipoRegistro as TipoRegistro;
                registro.descricao = data.descricao;
                registro.idAluno = data.idAluno;
                registro.nomeProfessor = data.nomeProfessor
                registro.data = data.data.toDate()

                registros.push(registro);
            }
        }

        return registros;
    }

    // UPDATE
    async update(registro: RegistroVidaAluno, id: string) {
        try {
            await setDoc(doc(db, "registroVidaAluno", id), {
                tipoRegistro: registro.tipoRegistro,
                descricao: registro.descricao,
                idAluno: registro.idAluno,
                nomeProfessor: registro.nomeProfessor,
                data: Timestamp.fromDate(registro.data),
            });
            console.log("Registro de vida de aluno atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar registro de vida de aluno!");
        }
    }

    // DELETE
    async deletar(id: string) {
        const docRef = doc(db, "registroVidaAluno", id);
        try {
            await deleteDoc(docRef);
            console.log("Registro de vida de aluno excluído com sucesso!");
        } catch (e) {
            throw new Error("Erro ao deletar registro de vida de aluno!");
        }
    }
}

const registroVidaAlunoDAO = new RegistroVidaAlunoDAO();
export default registroVidaAlunoDAO;
