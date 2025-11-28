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
                idCurso: turma.idCurso,
                idEscola: turma.escola.id,
                nome: turma.nome,
                ano: turma.ano,
                fotoUrl: turma.fotoUrl
            });
            turma.idTurma = docRef.id;
            console.log("Turma inserida com sucesso! IDTurma: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir turma: ", e);
        }
    }

    async getByCursoId(idCurso: string): Promise<Turma[]> {
        const turmasRef = collection(db, "turma");
        const q = query(turmasRef, where("idCurso", "==", idCurso));
        const querySnapshot = await getDocs(q);

        const turmas: Turma[] = [];
        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            const turma: Turma = new Turma();
            turma.idTurma = docSnap.id;
            turma.idCurso = data.idCurso;
            turma.nome = data.nome;
            turma.ano = data.ano;
            turma.fotoUrl = data.fotoUrl || "";
            // turma.curso = await cursoDAO.getOne(data.idCurso); // descomente se necessário
            // turma.escola = turma.curso.escola; // ajuste se necessário
            turmas.push(turma);
        }
        console.log(`QuerySnapshot: ${JSON.stringify(querySnapshot.docs.map(doc => doc.data()))}`);
        console.log(`Turmas: ${JSON.stringify(turmas)}`);
        return turmas;
    }

    //GETALL
    async getAll(): Promise<Turma[]> {
        const querySnapshot = await getDocs(collection(db, "turma"));
        const turmas: Turma[] = [];
        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data();
            const turma: Turma = new Turma();
            turma.idTurma = docSnap.id;
            turma.idCurso = data.idCurso;
            turma.nome = data.nome;
            turma.ano = data.ano;
            turma.fotoUrl = data.fotoUrl || "";
            turmas.push(turma);
        }
        return turmas;
    }

    //UPDATE
    async update(turma: Turma) {
        try {
            await setDoc(doc(db, "turma", turma.idTurma), {
                idCurso: turma.idCurso,
                nome: turma.nome,
                ano: turma.ano,
                fotoUrl: turma.fotoUrl
            });
            console.log("Turma atualizada com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar turma!");
        }
    }

    //GETONE
    async getOne(id: string): Promise<Turma> {
        console.log("[DEBUG] TurmaDAO.getOne - Buscando turma com ID:", id);
        
        if (!id || id === 'undefined') {
            console.error("[ERROR] TurmaDAO.getOne - ID inválido:", id);
            throw new Error('ID da turma inválido');
        }

        try {
            const docRef = doc(db, "turma", id);
            const querySnapshot = await getDoc(docRef);
            
            console.log("[DEBUG] TurmaDAO.getOne - Documento existe?", querySnapshot.exists());
            
            if (querySnapshot.exists()) {
                const data = querySnapshot.data();
                console.log("[DEBUG] TurmaDAO.getOne - Dados do documento:", data);
                
                const turma = new Turma();
                turma.idTurma = querySnapshot.id;
                turma.idCurso = data.idCurso;
                turma.nome = data.nome;
                turma.ano = data.ano;
                turma.fotoUrl = data.fotoUrl || "";

                // Buscar dados do curso associado
                if (data.idCurso) {
                    console.log("[DEBUG] TurmaDAO.getOne - Buscando curso associado:", data.idCurso);
                    try {
                        turma.curso = await cursoDAO.getOne(data.idCurso);
                    } catch (error) {
                        console.warn("[WARN] TurmaDAO.getOne - Erro ao buscar curso:", error);
                    }
                }

                console.log("[DEBUG] TurmaDAO.getOne - Turma completa:", turma);
                return turma;
            } else {
                console.error("[ERROR] TurmaDAO.getOne - Turma não encontrada para ID:", id);
                throw new Error('Turma não encontrada');
            }
        } catch (error) {
            console.error("[ERROR] TurmaDAO.getOne - Erro ao buscar turma:", error);
            throw error;
        }
    }

    //DELETE
    async deletar(id: string): Promise<void> {
        try {
            console.log("[DEBUG] TurmaDAO.deletar - Iniciando exclusão da turma:", id);
            const docRef = doc(db, "turma", id);
            await deleteDoc(docRef);
            console.log("[DEBUG] TurmaDAO.deletar - Turma excluída com sucesso!");
        } catch (error) {
            console.error("[ERROR] TurmaDAO.deletar - Erro ao deletar turma:", error);
            throw new Error("Erro ao deletar turma!");
        }
    }
}

const turmaDAO = new TurmaDAO();
export default turmaDAO;
