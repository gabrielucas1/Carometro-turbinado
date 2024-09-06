import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import RegistroProfessorAluno from "@/model/RegistroProfessorAluno";

class RegistroProfessorAlunoDAO {
    // INSERIR
    async inserir(registro: RegistroProfessorAluno) {
        try {
            const docRef = await addDoc(collection(db, "registroProfessorAluno"), {
                idRegistroProfessorTurma: registro.registroProfessorTurma.id,
                idAluno: registro.aluno.id,
                observacao: registro.observacao,
            });
            console.log("Registro do professor para aluno inserido com sucesso! ID: ", docRef.id);
        } catch (e) {
            throw new Error("Erro ao inserir registro do professor para aluno: " + e);
        }
    }

    // GETONE
    async getOne(id: string): Promise<RegistroProfessorAluno> {
        const registro = new RegistroProfessorAluno();

        const docRef = doc(db, "registroProfessorAluno", id);
        const querySnapshot = await getDoc(docRef);
        if (querySnapshot.exists()) {
            const data = querySnapshot.data();

            registro.id = querySnapshot.id;
            registro.registroProfessorTurma.id = data.idRegistroProfessorTurma;
            registro.aluno.id = data.idAluno;
            registro.observacao = data.observacao;
        } else {
            throw new Error('Erro ao buscar registro do professor para aluno!');
        }

        return registro;
    }

    // GETALL
    async getAll(): Promise<RegistroProfessorAluno[]> {
        const querySnapshot = await getDocs(collection(db, "registroProfessorAluno"));
        const registros: RegistroProfessorAluno[] = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const registro = new RegistroProfessorAluno();

            registro.id = doc.id;
            registro.registroProfessorTurma.id = data.idRegistroProfessorTurma;
            registro.aluno.id = data.idAluno;
            registro.observacao = data.observacao;

            registros.push(registro);
        }

        return registros;
    }

    // UPDATE
    async update(registro: RegistroProfessorAluno, id: string) {
        try {
            await setDoc(doc(db, "registroProfessorAluno", id), {
                idRegistroProfessorTurma: registro.registroProfessorTurma.id,
                idAluno: registro.aluno.id,
                observacao: registro.observacao,
            });
            console.log("Registro do professor para aluno atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar registro do professor para aluno!");
        }
    }

    // DELETE
    async deletar(id: string) {
        const docRef = doc(db, "registroProfessorAluno", id);

        try {
            await deleteDoc(docRef);
            console.log("Registro do professor para aluno excluído com sucesso!");
        } catch (e) {
            throw new Error("Erro ao deletar registro do professor para aluno!");
        }
    }
}

const registroProfessorAlunoDAO = new RegistroProfessorAlunoDAO();
export default registroProfessorAlunoDAO;
