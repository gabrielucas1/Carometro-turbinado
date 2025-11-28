import { db } from "@/firebase/firebase";
import Aluno from "@/model/Aluno";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, documentId } from "firebase/firestore";

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
                idEscola: aluno.idEscola // Salva corretamente o idEscola
            });
            console.log("Aluno inserido com sucesso! ID: ", docRef.id);
            return docRef.id;
        } catch (e) {
            throw new Error('Erro ao inserir aluno!');
        }
    }

    //GETONE
    async getOne(id: string): Promise<Aluno> {
        try {
            console.log("[DEBUG] AlunoDAO.getOne - Buscando aluno com ID:", id);

            if (!id) {
                throw new Error("ID do aluno não fornecido");
            }

            const docRef = doc(db, "aluno", id);
            const querySnapshot = await getDoc(docRef);

            if (!querySnapshot.exists()) {
                console.error(`[ERROR] AlunoDAO.getOne - Aluno não encontrado! ID: ${id}`);
                throw new Error(`Aluno não encontrado! ID: ${id}`);
            }

            const data = querySnapshot.data();
            console.log("[DEBUG] AlunoDAO.getOne - Dados do aluno:", data);

            const aluno = new Aluno();
            aluno.id = querySnapshot.id;
            aluno.idTurma = data.idTurma || "";
            aluno.idEscola = data.idEscola || ""; // Garantir que o idEscola seja carregado
            aluno.nome = data.nome || "";
            aluno.dataNascimento = data.dataNascimento || null;
            aluno.telefone = data.telefone || "";
            aluno.cep = data.cep || "";
            aluno.rua = data.rua || "";
            aluno.bairro = data.bairro || "";
            aluno.numeroEndereco = data.numeroEndereco || "";
            aluno.estado = data.estado || "";
            aluno.cidade = data.cidade || "";
            aluno.complemento = data.complemento || "";
            aluno.fotoUrl = data.fotoUrl || ""; 

            console.log("[DEBUG] AlunoDAO.getOne - Aluno montado:", aluno);
            return aluno;
        } catch (error) {
            console.error("[ERROR] AlunoDAO.getOne - Erro ao buscar aluno:", error);
            throw error;
        }
    }

    async getByTurmaId(idTurma: string): Promise<Aluno[]> {
        console.log(`idTurma: ${idTurma}`);
        // Passo 1: Buscar os documentos de turmaAluno com o idTurma correspondente
        const turmaAlunoRef = collection(db, "turmaAluno");
        const turmaAlunoQuery = query(turmaAlunoRef, where("idTurma", "==", idTurma));
        const turmaAlunoSnapshot = await getDocs(turmaAlunoQuery);
    
        console.log(`QqqqqqqqqqquerySnapshot: ${JSON.stringify(turmaAlunoSnapshot.docs.map(doc => doc.data()))}`);
    
        // Extrair os ids de alunos associados à turma
        const idAlunos = turmaAlunoSnapshot.docs.map(doc => doc.data().idAluno);
    
        console.log(`iddddddddddddAlunos: ${JSON.stringify(idAlunos)}`);
    
        if (idAlunos.length === 0) {
            // Retornar lista vazia se não houver alunos associados
            return [];
        }
    
        // Dividir IDs de alunos em grupos de até 10 para evitar limite do Firestore
        const gruposIdAlunos = [];
        for (let i = 0; i < idAlunos.length; i += 10) {
            gruposIdAlunos.push(idAlunos.slice(i, i + 10));
        }

        console.log(`Grupos de IDs de alunos: ${JSON.stringify(gruposIdAlunos)}`);
        const alunos: Aluno[] = [];
        for (const grupo of gruposIdAlunos) {
            const alunosRef = collection(db, "aluno");
            const alunosQuery = query(alunosRef, where(documentId(), "in", grupo));
            const alunosSnapshot = await getDocs(alunosQuery);
            console.log(`Resultados da consulta para grupo ${JSON.stringify(grupo)}: ${JSON.stringify(alunosSnapshot.docs.map(doc => doc.data()))}`);

            for (const doc of alunosSnapshot.docs) {
                const data = doc.data();
                console.log(`Dados do aluno: ${JSON.stringify(data)}`);
                const aluno: Aluno = new Aluno();
                aluno.id = doc.id;
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
                aluno.fotoUrl = data.fotoUrl; // IMPORTANTE: Incluir fotoUrl
                aluno.idTurma = data.idTurma;
                aluno.idEscola = data.idEscola;
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
            aluno.idEscola = data.idEscola;

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
                idEscola: aluno.idEscola // Salva corretamente o idEscola
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
