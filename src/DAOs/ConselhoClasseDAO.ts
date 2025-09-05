import { db } from "@/firebase/firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import ConselhoClasse from "@/model/ConselhoClasse";

class ConselhoClasseDAO {
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
        if (data.turma && typeof data.turma === "object" && data.turma.path) {
          // Firestore Reference
          conselho.turma = data.turma.path;
          console.log("[DEBUG] ConselhoClasseDAO.getOne - turma.path:", data.turma.path);
        } else {
          conselho.turma = data.turma;
        }
        conselho.dataCriacao = data.dataCriacao.toDate();
        conselho.dataModificacao = data.dataModificacao.toDate();
        return conselho;
  }

  async getAll(): Promise<ConselhoClasse[]> {
    const snapshot = await getDocs(collection(db, "conselhoClasse"));
    return snapshot.docs.map(doc => {
      const data = doc.data();
          const conselho = new ConselhoClasse();
          conselho.id = doc.id;
          conselho.nome = data.nome;
          console.log("[DEBUG] ConselhoClasseDAO.getAll - data:", data);
          // Log do campo turma
          console.log("[DEBUG] ConselhoClasseDAO.getAll - turma:", data.turma, "typeof:", typeof data.turma);
          if (data.turma && typeof data.turma === "object" && data.turma.path) {
            conselho.turma = data.turma.path;
            console.log("[DEBUG] ConselhoClasseDAO.getAll - turma.path:", data.turma.path);
          } else {
            conselho.turma = data.turma;
          }
          conselho.dataCriacao = data.dataCriacao?.toDate ? data.dataCriacao.toDate() : new Date();
          conselho.dataModificacao = data.dataModificacao?.toDate ? data.dataModificacao.toDate() : new Date();
          return conselho;
    });
  }
}

const conselhoClasseDAO = new ConselhoClasseDAO();
export default conselhoClasseDAO;