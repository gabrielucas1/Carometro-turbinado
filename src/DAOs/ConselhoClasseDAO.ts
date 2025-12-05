import { db } from "@/firebase/firebase";
import { collection, doc, getDocs, getDoc, addDoc, Timestamp } from "firebase/firestore";
import ConselhoClasse from "@/model/ConselhoClasse";

class ConselhoClasseDAO {
  async inserir(conselho: ConselhoClasse) {
    try {
      console.log("[DEBUG] ConselhoClasseDAO.inserir - Iniciando inserção");
      console.log("[DEBUG] ConselhoClasseDAO.inserir - Conselho recebido:", conselho);
      console.log("[DEBUG] ConselhoClasseDAO.inserir - Campo hora:", (conselho as any).hora);
      
      const turmaObj = conselho.turma;
      const conselhoData: any = {
        nome: conselho.nome,
        turma: turmaObj ? { idTurma: turmaObj.idTurma, nome: turmaObj.nome } : null,
        dataCriacao: Timestamp.fromDate(conselho.dataCriacao),
        dataModificacao: Timestamp.fromDate(conselho.dataModificacao),
      };

      // Adicionar hora se existir (propriedade dinâmica)
      if ((conselho as any).hora) {
        conselhoData.hora = (conselho as any).hora;
        console.log("[DEBUG] ConselhoClasseDAO.inserir - Hora adicionada aos dados:", conselhoData.hora);
      }

      console.log("[DEBUG] ConselhoClasseDAO.inserir - Dados a serem salvos:", conselhoData);
      
      const docRef = await addDoc(collection(db, "conselhoClasse"), conselhoData);
      
      console.log("[DEBUG] ConselhoClasseDAO.inserir - Conselho salvo com ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("[ERROR] ConselhoClasseDAO.inserir - Erro:", error);
      throw error;
    }
  }
  async getOne(id: string): Promise<ConselhoClasse> {
    const docRef = doc(db, "conselhoClasse", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) throw new Error("Conselho não encontrado");
    const data = snapshot.data();
        const conselho = new ConselhoClasse();
        conselho.id = id;
        conselho.nome = data.nome;
        console.log("[DEBUG] ConselhoClasseDAO.getOne - data:", data);
        // Log do campo turma
        console.log("[DEBUG] ConselhoClasseDAO.getOne - turma:", data.turma, "typeof:", typeof data.turma);
        // Normalizar campo turma para sempre ser um objeto Turma completo
        const Turma = (await import("@/model/Turma")).default;
        if (typeof data.turma === "string") {
          // Firestore Reference string
          const idTurma = data.turma.split("/").pop();
          conselho.turma = Object.assign(new Turma(), { idTurma });
        } else if (data.turma && typeof data.turma === "object") {
          if (data.turma.idTurma) {
            conselho.turma = Object.assign(new Turma(), { idTurma: data.turma.idTurma, nome: data.turma.nome });
          } else if (data.turma.id) {
            conselho.turma = Object.assign(new Turma(), { idTurma: data.turma.id, nome: data.turma.nome });
          } else if (data.turma.path) {
            const idTurma = data.turma.path.split("/").pop();
            conselho.turma = Object.assign(new Turma(), { idTurma });
          } else {
            conselho.turma = new Turma();
          }
        } else {
          conselho.turma = new Turma();
        }
        conselho.dataCriacao = data.dataCriacao.toDate();
        conselho.dataModificacao = data.dataModificacao.toDate();
        
        // Adicionar hora se existir no documento
        if (data.hora) {
          (conselho as any).hora = data.hora;
        }
        
        return conselho;
  }

  async getAll(): Promise<ConselhoClasse[]> {
    try {
      console.log("[DEBUG] ConselhoClasseDAO.getAll - Iniciando busca");
      const snapshot = await getDocs(collection(db, "conselhoClasse"));
      const conselhos = await Promise.all(snapshot.docs.map(async doc => {
        const data = doc.data();
        console.log("[DEBUG] ConselhoClasseDAO.getAll - Documento:", doc.id, "dados:", data);
        console.log("[DEBUG] ConselhoClasseDAO.getAll - Campo hora no documento:", data.hora);
        
        const conselho = new ConselhoClasse();
        conselho.id = doc.id;
        conselho.nome = data.nome;
        
        // Normalizar campo turma para sempre ser um objeto Turma completo
        const Turma = (await import("@/model/Turma")).default;
        if (typeof data.turma === "string") {
          const idTurma = data.turma.split("/").pop();
          conselho.turma = Object.assign(new Turma(), { idTurma });
        } else if (data.turma && typeof data.turma === "object") {
          if (data.turma.idTurma) {
            conselho.turma = Object.assign(new Turma(), { idTurma: data.turma.idTurma, nome: data.turma.nome });
          } else if (data.turma.id) {
            conselho.turma = Object.assign(new Turma(), { idTurma: data.turma.id, nome: data.turma.nome });
          } else if (data.turma.path) {
            const idTurma = data.turma.path.split("/").pop();
            conselho.turma = Object.assign(new Turma(), { idTurma });
          } else {
            conselho.turma = new Turma();
          }
        } else {
          conselho.turma = new Turma();
        }
        
        conselho.dataCriacao = data.dataCriacao?.toDate ? data.dataCriacao.toDate() : new Date();
        conselho.dataModificacao = data.dataModificacao?.toDate ? data.dataModificacao.toDate() : new Date();
        
        // Adicionar hora se existir no documento
        if (data.hora) {
          (conselho as any).hora = data.hora;
          console.log("[DEBUG] ConselhoClasseDAO.getAll - Hora atribuída ao conselho:", (conselho as any).hora);
        } else {
          console.log("[DEBUG] ConselhoClasseDAO.getAll - Nenhuma hora encontrada para o documento:", doc.id);
        }
        
        return conselho;
      }));
      
      console.log("[DEBUG] ConselhoClasseDAO.getAll - Total de conselhos carregados:", conselhos.length);
      return conselhos;
    } catch (error) {
      console.error("[ERROR] ConselhoClasseDAO.getAll - Erro:", error);
      throw error;
    }
  }
}

const conselhoClasseDAO = new ConselhoClasseDAO();
export default conselhoClasseDAO;