import { db } from "@/firebase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import RegistroProfessorDescricao from "@/model/RegistroProfessorDescricao";

class RegistroProfessorDescricaoDAO {
  async getByAluno(idAluno: string): Promise<RegistroProfessorDescricao[]> {
    const q = query(collection(db, "registroProfessorDescricao"), where("aluno.id", "==", idAluno));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const registro = new RegistroProfessorDescricao();
      registro.id = doc.id;
      registro.observacao = data.observacao;
      registro.dataCriacao = data.dataCriacao.toDate();
      registro.dataModificacao = data.dataModificacao.toDate();
      registro.aluno = data.aluno;
      registro.registroProfessor = data.registroProfessor;
      return registro;
    });
  }

  async inserir(registro: any) {
    try {
      console.log("[DEBUG] Dados enviados para Firestore:", {
        aluno: registro.aluno,
        registroProfessor: registro.registroProfessor,
        conselhoClasse: registro.conselhoClasse,
        observacao: registro.observacao,
        dataCriacao: registro.dataCriacao,
        dataModificacao: registro.dataModificacao,
      });
      await addDoc(collection(db, "registroProfessorDescricao"), {
        aluno: registro.aluno,
        registroProfessor: registro.registroProfessor,
        conselhoClasse: registro.conselhoClasse,
        observacao: registro.observacao,
        dataCriacao: registro.dataCriacao,
        dataModificacao: registro.dataModificacao,
      });
      console.log("[DEBUG] Comentário salvo com sucesso!");
    } catch (err) {
      console.error("[ERRO] Firestore ao salvar comentário:", err);
      throw err;
    }
  }
}
const registroProfessorDescricaoDAO = new RegistroProfessorDescricaoDAO();
export default registroProfessorDescricaoDAO;
