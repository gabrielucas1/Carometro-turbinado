import { db } from "@/firebase/firebase";
import Aluno from "@/model/Aluno";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

class AlunoDAO {
    //INSERIR
    async inserir(aluno: Aluno): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, "aluno"), {
                nome: aluno.nome,
                dataNascimento: aluno.dataNascimento,
                telefone: aluno.telefone,
                cep: aluno.cep,
                rua: aluno.rua,
                bairro: aluno.bairro,
                numeroEndereco: aluno.numeroEndereco,
                estado: aluno.estado,
                cidade: aluno.cidade,
                complemento: aluno.complemento,
                fotoUrl: aluno.fotoUrl, 
                idTurma: aluno.idTurma,
            });
            console.log("Aluno inserido com sucesso! ID: ", docRef.id);
            return docRef.id;
        } catch (e) {
            throw new Error('Erro ao inserir aluno!');
        }
    }

    //GETONE
    async getOne(id: string): Promise<Aluno> {
        const aluno = new Aluno();

        const docRef = doc(db, "aluno", id);
        const querySnapshot = await getDoc(docRef);
        if (querySnapshot.exists()) {
            const data = querySnapshot.data();

            aluno.id = querySnapshot.id;
            aluno.idTurma = data.idTurma;
            aluno.nome = data.nome;
            aluno.dataNascimento = data.dataNascimento;
            aluno.telefone = data.telefone;
            aluno.cep = data.cep;
            aluno.rua = data.rua;
            aluno.bairro = data.bairro;
            aluno.numeroEndereco = data.numeroEndereco;
            aluno.estado = data.estado;
            aluno.cidade = data.cidade;
            aluno.complemento = data.complemento;
            aluno.fotoUrl = data.fotoUrl; // Adicionar fotoUrl
            
        } else {
            throw new Error('Erro ao buscar aluno!');
        }

        return aluno;
    }

    async getByTurmaId(idTurma: string): Promise<Aluno[]> {
        console.log(`idTurma: ${idTurma}`);
        // Passo 1: Buscar os documentos de turmaAluno com o idTurma correspondente
        const turmaAlunoRef = collection(db, "turmaAluno");
        const turmaAlunoQuery = query(turmaAlunoRef, where("idTurma", "==", idTurma));
        const turmaAlunoSnapshot = await getDocs(turmaAlunoQuery);
    
        // Extrair os ids de alunos associados à turma
        const idAlunos = turmaAlunoSnapshot.docs.map(doc => doc.data().idAluno);
    
        if (idAlunos.length === 0) {
            // Retornar lista vazia se não houver alunos associados
            return [];
        }
    
        // Passo 2: Buscar os dados dos alunos com base nos ids obtidos
        const alunos: Aluno[] = [];
        for (const idAluno of idAlunos) {
            const alunoDocRef = doc(db, "aluno", idAluno);
            const alunoSnapshot = await getDoc(alunoDocRef);
    
            if (alunoSnapshot.exists()) {
                const data = alunoSnapshot.data();
                const aluno: Aluno = new Aluno();
    
                aluno.id = alunoSnapshot.id;
                aluno.idTurma = data.idTurma;
                aluno.nome = data.nome;
                aluno.dataNascimento = data.dataNascimento;
                aluno.telefone = data.telefone;
                aluno.cep = data.cep;
                aluno.rua = data.rua;
                aluno.bairro = data.bairro;
                aluno.numeroEndereco = data.numeroEndereco;
                aluno.estado = data.estado;
                aluno.cidade = data.cidade;
                aluno.complemento = data.complemento;
                aluno.fotoUrl = data.fotoUrl;
    
                alunos.push(aluno);
            }
        }
    
        return alunos;
    }    

    //GETALL
    async getAll(): Promise<Aluno[]> {
        const querySnapshot = await getDocs(collection(db, "aluno"));
        const alunos: Aluno[] = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data(); // Obtém os dados do documento
            const aluno: Aluno = new Aluno();

            aluno.id = doc.id;
            aluno.idTurma = data.idTurma; 
            aluno.nome = data.nome;
            aluno.dataNascimento = data.dataNascimento;
            aluno.telefone = data.telefone;
            aluno.cep = data.cep;
            aluno.rua = data.rua;
            aluno.bairro = data.bairro;
            aluno.numeroEndereco = data.numeroEndereco;
            aluno.estado = data.estado;
            aluno.cidade = data.cidade;
            aluno.complemento = data.complemento;
            aluno.fotoUrl = data.fotoUrl; // Adicionar fotoUrl

            alunos.push(aluno);
        }

        return alunos;
    }

    //UPDATE
    async update(aluno: Aluno) {
        try {
            await setDoc(doc(db, "aluno", aluno.id), {
                nome: aluno.nome,
                dataNascimento: aluno.dataNascimento,
                telefone: aluno.telefone,
                cep: aluno.cep,
                rua: aluno.rua,
                bairro: aluno.bairro,
                numeroEndereco: aluno.numeroEndereco,
                estado: aluno.estado,
                cidade: aluno.cidade,
                complemento: aluno.complemento,
                fotoUrl: aluno.fotoUrl, // Adicionar fotoUrl
                idTurma: aluno.idTurma,
            });
            console.log("Aluno atualizado com sucesso!");
        } catch (e) {
            throw new Error("Erro ao atualizar aluno!");
        }
    }

    //DELETE
    async deletar(id: string) {
        const docRef = doc(db, "aluno", id);

        try {
            await deleteDoc(docRef);
            console.log("Aluno excluído com sucesso!");
        } catch (e) {
            throw new Error("Erro ao deletar aluno!");
        }
    }
}

const alunoDAO = new AlunoDAO();
export default alunoDAO;
