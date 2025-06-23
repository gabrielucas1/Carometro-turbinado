import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import RegistroProfessorTurma from "@/model/RegistroProfessorTurma";

class RegistroProfessorTurmaDAO {
    // INSERIR
    async inserir(registro: RegistroProfessorTurma): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, "registroProfessorTurma"), {
                idUsuario: registro.usuario.id,  // Armazenando apenas o ID do usuário
                disciplina: registro.disciplina,
                periodo: registro.periodo,
                idTurma: registro.turma.id,  // Armazenando apenas o ID da turma
                revisaoGeral: registro.revisaoGeral,
                data: Timestamp.fromDate(registro.data)
            });
            console.log("Registro do professor na turma inserido com sucesso! ID: ", docRef.id);
            return docRef.id; // Retornando o ID do documento recém-criado
        } catch (e) {
            throw new Error("Erro ao inserir registro do professor na turma: " + e);
        }
    }


    // GETONE
    async getOne(id: string): Promise<RegistroProfessorTurma> {
        const registro = new RegistroProfessorTurma();

        const docRef = doc(db, "registroProfessorTurma", id);
        const querySnapshot = await getDoc(docRef);
        if (querySnapshot.exists()) {
            const data = querySnapshot.data();

            registro.id = querySnapshot.id;
            registro.usuario.id = data.idUsuario;  // Atribuindo o ID do usuário
            registro.disciplina = data.disciplina;
            registro.periodo = data.periodo;
            registro.turma.id = data.idTurma;  // Atribuindo o ID da turma
            registro.revisaoGeral = data.revisaoGeral;
            registro.data = data.data.toDate();
        } else {
            throw new Error('Erro ao buscar registro do professor na turma!');
        }

        return registro;
    }

    // GETALL
    async getAll(): Promise<RegistroProfessorTurma[]> {
        const querySnapshot = await getDocs(collection(db, "registroProfessorTurma"));
        const registros: RegistroProfessorTurma[] = [];
                    console.log("Registro do professor na turma: ", registros);

        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const registro = new RegistroProfessorTurma();

            registro.id = doc.id;
            registro.usuario.id = data.idUsuario;  // Atribuindo o ID do usuário
            registro.disciplina = data.disciplina;
            registro.periodo = data.periodo;
            registro.turma.id = data.idTurma;  // Atribuindo o ID da turma
            registro.revisaoGeral = data.revisaoGeral;
            registro.data = data.data.toDate();
            console.log("Registro do professor na turma: ", registro);

            registros.push(registro);
        }

        return registros;
    }

    // UPDATE
    async update(registro: RegistroProfessorTurma, id: string) {
        try {
            await setDoc(doc(db, "registroProfessorTurma", id), {
                idUsuario: registro.usuario.id,
                disciplina: registro.disciplina,
                periodo: registro.periodo,
                idTurma: registro.turma.id,
                revisaoGeral: registro.revisaoGeral,
                data: Timestamp.fromDate(registro.data)
            });
            console.log("Registro do professor na turma atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar registro do professor na turma!");
        }
    }

    // DELETE
    async deletar(id: string) {
        const docRef = doc(db, "registroProfessorTurma", id);

        try {
            await deleteDoc(docRef);
            console.log("Registro do professor na turma excluído com sucesso!");
        } catch (e) {
            throw new Error("Erro ao deletar registro do professor na turma!");
        }
    }
}

const registroProfessorTurmaDAO = new RegistroProfessorTurmaDAO();
export default registroProfessorTurmaDAO;
