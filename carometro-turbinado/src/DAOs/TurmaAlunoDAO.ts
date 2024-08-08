import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import alunoDAO from "./AlunoDAO";
import turmaDAO from "./TurmaDAO";
import TurmaAluno from "@/model/TurmaAluno";
import Aluno from "@/model/Aluno";

class TurmaAlunoDAO {
    // INSERIR
    async inserir(turmaAluno: TurmaAluno) {
        try {
            const docRef = await addDoc(collection(db, "turmaAluno"), {
                idTurma: turmaAluno.turma.id,
                idAluno: turmaAluno.aluno.id
            });
            console.log("TurmaAluno inserido com sucesso! ID: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir TurmaAluno: ", e);
        }
    }

    // GETONE
    async getOne(id: string): Promise<TurmaAluno> {
        const turmaAluno = new TurmaAluno();

        const docRef = doc(db, "turmaAluno", id);
        const querySnapshot = await getDoc(docRef);
        if (querySnapshot.exists()) {
            const data = querySnapshot.data();

            turmaAluno.id = querySnapshot.id;
            turmaAluno.turma = await turmaDAO.getOne(data.idTurma);
            turmaAluno.aluno = await alunoDAO.getOne(data.idAluno);
        } else {
            throw new Error('Erro ao buscar TurmaAluno!');
        }

        return turmaAluno;
    }

    // GETALL
    async getAll(): Promise<TurmaAluno[]> {
        const querySnapshot = await getDocs(collection(db, "turmaAluno"));
        const turmaAlunos: TurmaAluno[] = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const turmaAluno: TurmaAluno = new TurmaAluno();

            turmaAluno.id = doc.id;
            turmaAluno.turma = await turmaDAO.getOne(data.idTurma);
            turmaAluno.aluno = await alunoDAO.getOne(data.idAluno);

            turmaAlunos.push(turmaAluno);
        }

        return turmaAlunos;
    }

    //PEGAR ALUNOS DA TURMA
    async getAlunos(id: string): Promise<Aluno[]> {
        const querySnapshot = await getDocs(collection(db, "turmaAluno"));
        const alunos: Aluno[] = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();

            if (data.idTurma == id) {
                const aluno: Aluno = await alunoDAO.getOne(data.idAluno);
                alunos.push(aluno);
            } 
        }

        return alunos;
    }

    // UPDATE
    async update(turmaAluno: TurmaAluno) {
        try {
            await setDoc(doc(db, "turmaAluno", turmaAluno.id), {
                idTurma: turmaAluno.turma.id,
                idAluno: turmaAluno.aluno.id
            });
            console.log("TurmaAluno atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar TurmaAluno!");
        }
    }

    // DELETE
    async deletar(id: string) {
        const docRef = doc(db, "turmaAluno", id);

        try {
            await deleteDoc(docRef);
            console.log("TurmaAluno excluído com sucesso!");
        } catch (e) {
            throw new Error("Erro ao deletar TurmaAluno!");
        }
    }
}

const turmaAlunoDAO = new TurmaAlunoDAO();
export default turmaAlunoDAO;
