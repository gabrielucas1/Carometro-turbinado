import { db } from "@/firebase/firebase";
import Curso from "@/model/Curso";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import escolaDAO from "./EscolaDAO";
import Turma from "@/model/Turma";
import cursoDAO from "./CursoDAO";

class TurmaDAO {
    //INSERIR
    async inserir(turma: Turma) {
        try {
            const docRef = await addDoc(collection(db, "turma"), {
                idCurso: turma.curso.id,
                nome: turma.nome,
            });
            console.log("Turma inserida com sucesso! ID: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir turma: ", e);
        }
    }

    //GETONE
    async getOne(id: string): Promise<Turma> {
        const turma = new Turma()

        const docRef = doc(db, "turma", id)
        const querySnapshot = await getDoc(docRef)
        if (querySnapshot.exists()) {
            const data = querySnapshot.data()

            turma.id = querySnapshot.id
            turma.nome = data.nome
            turma.curso = await cursoDAO.getOne(data.idCurso)
        } else {
            throw new Error('Erro ao buscar turma!')
        }

        return turma;
    }

    //GETALL
    async getAll(): Promise<Turma[]> {
        const querySnapshot = await getDocs(collection(db, "turma"));
        const turmas: Turma[] = []
        for (const doc of querySnapshot.docs) {
            // doc.data() is never undefined for query doc snapshots
            const data = doc.data(); // Obtém os dados do documento
            const turma: Turma = new Turma();

            turma.id = doc.id
            turma.nome = data.nome
            turma.curso = await cursoDAO.getOne(data.idCurso)

            turmas.push(turma);
        }

        return turmas
    }

    //UPDATE
    async update(turma: Turma) {
        try {
            await setDoc(doc(db, "turma", turma.id), {
                idCurso: turma.curso.id,
                nome: turma.nome,
            })
            console.log("Turma atualizada com sucesso!")
        } catch (e) {
            throw new Error("Erro ao atualizar turma!")
        }
    }


    //DELETE
    async deletar(id: string) {
        const docRef = doc(db, "turma", id)

        try {
            await deleteDoc(docRef)
            console.log("turma excluida com sucesso!")
        } catch (e) {
            throw new Error("Erro ao deletar turma!")
        }
    }
}

const turmaDAO = new TurmaDAO
export default turmaDAO
