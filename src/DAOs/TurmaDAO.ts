import { db } from "@/firebase/firebase";
import Curso from "@/model/Curso";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
                ano: turma.ano,
                fotoUrl: turma.fotoUrl
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
            turma.ano = data.ano
            turma.escola = turma.curso.escola // Adiciona o campo escola
            turma.fotoUrl = data.fotoUrl || ""
            console.log("[DEBUG] TurmaDAO.getOne - turma:", turma);
        } else {
            throw new Error('Erro ao buscar turma!')
        }

        return turma;
    }

    async getByCursoId(idCurso: string): Promise<Turma[]> {
        const turmasRef = collection(db, "turma");
        const q = query(turmasRef, where("idCurso", "==", idCurso));
        const querySnapshot = await getDocs(q);
    
        const turmas: Turma[] = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const turma: Turma = new Turma();
    
            turma.id = doc.id;
            turma.nome = data.nome;
            turma.ano = data.ano;
            turma.curso = await cursoDAO.getOne(data.idCurso);
            turma.escola = turma.curso.escola ;// Adicione esta linha
            turma.fotoUrl = data.fotoUrl || "";
    
            turmas.push(turma);
        }
        console.log(`QuerySnapshot: ${JSON.stringify(querySnapshot.docs.map(doc => doc.data()))}`);
        console.log(`Turmas: ${JSON.stringify(turmas)}`);
    
        return turmas;
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
            turma.ano = data.ano
            turma.curso = await cursoDAO.getOne(data.idCurso)
            turma.escola = turma.curso.escola;
            turma.fotoUrl = data.fotoUrl || "";


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
                ano: turma.ano,
                fotoUrl: turma.fotoUrl
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
