import { db } from "@/firebase/firebase";
import Curso from "@/model/Curso";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import escolaDAO from "./EscolaDAO";

class CursoDAO {
    //INSERIR
    async inserir(curso: Curso) {
        try {
            const docRef = await addDoc(collection(db, "curso"), {
                idEscola: curso.escola.id,
                nome: curso.nome,
                turno: curso.turno
            });
            console.log("Curso inserido com sucesso! ID: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir curso: ", e);
        }
    }

    //GETONE
    async getOne(id: string): Promise<Curso> {
        const curso = new Curso()

        const docRef = doc(db, "curso", id)
        const querySnapshot = await getDoc(docRef)
        if (querySnapshot.exists()) {
            const data = querySnapshot.data()

            curso.id = querySnapshot.id
            curso.nome = data.nome
            curso.escola = await escolaDAO.getOne(data.idEscola)
            curso.turno = data.turno

        } else {
            throw new Error('Erro ao buscar curso!')
        }

        return curso;
    }

    //GETALL
    async getAll(): Promise<Curso[]> {
        const querySnapshot = await getDocs(collection(db, "curso"));
        const cursos: Curso[] = []
        for(const doc of querySnapshot.docs) {
            // doc.data() is never undefined for query doc snapshots
            const data = doc.data(); // Obtém os dados do documento
            const curso: Curso = new Curso();

            curso.id = doc.id;
            curso.nome = data.nome;
            curso.turno = data.turno;
            curso.escola = await escolaDAO.getOne(data.idEscola);

            cursos.push(curso);
        }

        return cursos
    }

    //UPDATE
    async update(id: string, curso: Curso) {
        try {
            await setDoc(doc(db, "curso", id), {
                nome: curso.nome,
                idEscola: curso.escola.id,
                turno: curso.turno
            })
            console.log("Curso atualizado com sucesso!")
        } catch (e) {
            throw new Error("Erro ao atualizar curso!")
        }
    }


    //DELETE
    async deletar(id: string) {
        const docRef = doc(db, "curso", id)

        try {
            await deleteDoc(docRef)
            console.log("Curso excluido com sucesso!")
        } catch (e) {
            throw new Error("Erro ao deletar curso!")
        }
    }
}

const cursoDAO = new CursoDAO()
export default cursoDAO