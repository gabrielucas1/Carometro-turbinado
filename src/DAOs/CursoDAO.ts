import { db } from "@/firebase/firebase";
import Curso from "@/model/Curso";
import Escola from "@/model/Escola";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import escolaDAO from "./EscolaDAO";

class CursoDAO {
    //INSERIR
    async inserir(curso: Curso) {
        try {
            const docRef = await addDoc(collection(db, "curso"), {
                idEscola: curso.escola.id,
                nome: curso.nome,
                turno: curso.turno,
                fotoUrl: curso.fotoUrl
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
            console.log("Dados do curso encontrados:", data); // Log para verificar os dados do curso

            curso.id = querySnapshot.id
            curso.nome = data.nome
            curso.fotoUrl = data.fotoUrl || "";
            if(data.idEscola && typeof data.idEscola === "string") {
                curso.escola = await escolaDAO.getOne(data.idEscola)
             curso.escola.id = data.idEscola; // Adiciona o ID da escola ao objeto

            }
            else{
            console.error("Campo idEscola não encontrado no curso!");
            throw new Error("Erro ao buscar a escola associada ao curso!");

            }
            curso.turno = data.turno

        } else {
            throw new Error('Erro ao buscar curso!')
        }

        return curso;
    }

    //GETALL
    async getAll(): Promise<Curso[]> {
        const querySnapshot = await getDocs(collection(db, "curso"));
        const escolasSnapshot = await getDocs(collection(db, "escola")); // Carrega todas as escolas de uma vez

        const escolasMap: { [key: string]: Escola } = {};
        escolasSnapshot.forEach((doc) => {
            const data = doc.data();
            const escola = new Escola();
            escola.id = doc.id;
            escola.nome = data.nome;
            escolasMap[doc.id] = escola; // Mapeia o ID da escola para o objeto escola
        });

        const cursos: Curso[] = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            console.log("Dados do curso:", data);

            const curso: Curso = new Curso();
            curso.id = doc.id;
            curso.nome = data.nome;
            curso.turno = data.turno;
            curso.fotoUrl = data.fotoUrl; // fiz certo?

            if (data.idEscola && escolasMap[data.idEscola]) {
                curso.escola = escolasMap[data.idEscola]; // Usa o mapa de escolas
            } else {
                console.error("Campo idEscola não encontrado ou inválido!");
                throw new Error("Erro ao buscar a escola associada ao curso!");
            }

            cursos.push(curso);
        }

        return cursos;
    }

    //UPDATE
    async update(id: string, curso: Curso) {
        try {
            await setDoc(doc(db, "curso", id), {
                nome: curso.nome,
                idEscola: curso.escola.id,
                turno: curso.turno,
                fotoUrl: curso.fotoUrl
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