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
      const { aluno, registroProfessor, conselhoClasse, ...dadosRegistro } = registro;

      // Transforma aluno em objeto simples
      const alunoObj = {
        id: aluno.id,
        nome: aluno.nome,
        // outros campos simples que quiser salvar
      };

      // Transforma conselhoClasse em objeto simples
      const conselhoClasseObj = {
        id: conselhoClasse.id,
        nome: conselhoClasse.nome,
        // outros campos simples que quiser salvar
      };

      // Transforma registroProfessor em objeto simples
      const registroProfessorObj = {
        id: registroProfessor.id,
        disciplina: registroProfessor.disciplina,
        periodo: registroProfessor.periodo,
        turma: registroProfessor.turma ? {
          id: registroProfessor.turma.id ?? "",
          nome: registroProfessor.turma.nome ?? "",
          // outros campos simples de turma
        } : null,
        usuario: registroProfessor.usuario ? {
          id: registroProfessor.usuario.id,
          nome: registroProfessor.usuario.nome,
          // outros campos simples de usuario
        } : null,
        tipoRegistro: registroProfessor.tipoRegistro,
        revisaoGeral: registroProfessor.revisaoGeral,
        data: registroProfessor.data,
        conselhoClasse: registroProfessor.conselhoClasse ? {
          id: registroProfessor.conselhoClasse.id,
          nome: registroProfessor.conselhoClasse.nome,
          // outros campos simples
        } : null,
        // outros campos simples que quiser salvar
      };

      console.log("[DEBUG] Dados enviados para Firestore:", {
        aluno: alunoObj,
        registroProfessor: registroProfessorObj,
        conselhoClasse: conselhoClasseObj,
        observacao: registro.observacao,
        dataCriacao: registro.dataCriacao,
        dataModificacao: registro.dataModificacao,
      });

      await addDoc(collection(db, "registroProfessorDescricao"), {
        aluno: alunoObj,
        registroProfessor: registroProfessorObj,
        conselhoClasse: conselhoClasseObj,
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
