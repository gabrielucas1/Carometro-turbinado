import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import RegistroProfessorTurma from "@/model/RegistroProfessorTurma";

class RegistroProfessorTurmaDAO {
    // INSERIR
    async inserir(registro: RegistroProfessorTurma): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, "registroProfessorTurma"), {
                usuario: {
                    id: registro.usuario.id,
                    nome: registro.usuario.nome,
                    email: registro.usuario.email
                },
                disciplina: registro.disciplina,
                periodo: registro.periodo,
                idTurma: registro.turma.idTurma, // Corrigido: usando idTurma em vez de idCurso
                turma: {
                    id: registro.turma.idTurma,
                    nome: registro.turma.nome || ""
                },
                revisaoGeral: registro.revisaoGeral,
                data: Timestamp.fromDate(registro.data)
            });
            console.log("Registro do professor na turma inserido com sucesso! ID: ", docRef.id);
            return docRef.id;
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
            registro.usuario = data.usuario || { id: "", nome: "", email: "" };
            registro.disciplina = data.disciplina;
            registro.periodo = data.periodo;
            registro.turma.idCurso = data.idTurma;
            registro.revisaoGeral = data.revisaoGeral;
            registro.data = data.data.toDate();
        } else {
            throw new Error('Erro ao buscar registro do professor na turma!');
        }

        return registro;
    }

    // GETALL
    async getAll(): Promise<RegistroProfessorTurma[]> {
        try {
            console.log("[DEBUG] RegistroProfessorTurmaDAO.getAll - Iniciando busca de registros");
            const querySnapshot = await getDocs(collection(db, "registroProfessorTurma"));
            const registros: RegistroProfessorTurma[] = [];

            console.log("[DEBUG] RegistroProfessorTurmaDAO.getAll - Total de registros encontrados:", querySnapshot.docs.length);

            for (const docItem of querySnapshot.docs) {
                const data = docItem.data();
                console.log("[DEBUG] RegistroProfessorTurmaDAO.getAll - Dados do registro:", data);
                
                const registro = new RegistroProfessorTurma();
                registro.id = docItem.id;
                registro.usuario = data.usuario || { id: "", nome: "", email: "" };
                registro.disciplina = data.disciplina || "";
                registro.periodo = data.periodo || "";
                
                // Corrigido: usando campo turma corretamente
                if (data.turma) {
                    registro.turma.idTurma = data.turma.id || data.idTurma || "";
                    registro.turma.nome = data.turma.nome || "";
                } else {
                    registro.turma.idTurma = data.idTurma || "";
                }
                
                registro.revisaoGeral = data.revisaoGeral || "";
                registro.data = data.data ? data.data.toDate() : new Date();
                
                console.log("[DEBUG] RegistroProfessorTurmaDAO.getAll - Registro processado:", registro);
                registros.push(registro);
            }

            return registros;
        } catch (error: unknown) {
            console.error("[ERROR] RegistroProfessorTurmaDAO.getAll - Erro ao buscar registros:", error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Erro ao buscar registros: ${message}`);
        }
    }

    // UPDATE
    async update(registro: RegistroProfessorTurma, id: string) {
        try {
            console.log("[DEBUG] RegistroProfessorTurmaDAO.update - Atualizando registro:", { id, registro });
            
            await setDoc(doc(db, "registroProfessorTurma", id), {
                usuario: {
                    id: registro.usuario.id,
                    nome: registro.usuario.nome,
                    email: registro.usuario.email
                },
                disciplina: registro.disciplina,
                periodo: registro.periodo,
                idTurma: registro.turma.idTurma, // Corrigido: usando idTurma em vez de idCurso
                turma: {
                    id: registro.turma.idTurma,
                    nome: registro.turma.nome || ""
                },
                revisaoGeral: registro.revisaoGeral,
                data: Timestamp.fromDate(registro.data)
            });
            console.log("[DEBUG] RegistroProfessorTurmaDAO.update - Registro atualizado com sucesso!");
        } catch (error: unknown) {
            console.error("[ERROR] RegistroProfessorTurmaDAO.update - Erro ao atualizar:", error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Erro ao atualizar registro do professor na turma: ${message}`);
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
