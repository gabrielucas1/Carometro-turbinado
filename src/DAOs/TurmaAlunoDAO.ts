import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import alunoDAO from "./AlunoDAO";
import turmaDAO from "./TurmaDAO";
import TurmaAluno from "@/model/TurmaAluno";
import Aluno from "@/model/Aluno";

class TurmaAlunoDAO {
    // INSERIR
    async inserir(turmaAluno: TurmaAluno) {
        try {
            const docRef = await addDoc(collection(db, "turmaAluno"), {
                idTurma: turmaAluno.turma.idTurma,
                idAluno: turmaAluno.aluno.id
            });
            console.log("TurmaAluno inserido com sucesso! ID: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir TurmaAluno: ", e);
        }
    }

    // GETONE
    async getOne(id: string): Promise<TurmaAluno> {
        const turmaAluno = new TurmaAluno();

        const docRef = doc(db, "turmaAluno", id);
        const querySnapshot = await getDoc(docRef);
        if (querySnapshot.exists()) {
            const data = querySnapshot.data();

            turmaAluno.id = querySnapshot.id;
            turmaAluno.turma = await turmaDAO.getOne(data.idTurma);
            turmaAluno.aluno = await alunoDAO.getOne(data.idAluno);
        } else {
            throw new Error('Erro ao buscar TurmaAluno!');
        }

        return turmaAluno;
    }

    // GETALL
    async getAll(): Promise<TurmaAluno[]> {
        const querySnapshot = await getDocs(collection(db, "turmaAluno"));
        const turmaAlunos: TurmaAluno[] = [];
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const turmaAluno: TurmaAluno = new TurmaAluno();

            turmaAluno.id = doc.id;
            turmaAluno.turma = await turmaDAO.getOne(data.idTurma);
            turmaAluno.aluno = await alunoDAO.getOne(data.idAluno);

            turmaAlunos.push(turmaAluno);
        }

        return turmaAlunos;
    }

    //PEGAR ALUNOS DA TURMA
    async getAlunos(id: string): Promise<Aluno[]> {
        try {
            console.log('[DEBUG] TurmaAlunoDAO.getAlunos - Iniciando busca de alunos para turma:', id);
            
            if (!id) {
                throw new Error("ID da turma não fornecido");
            }

            // Primeiro, buscar as relações turma-aluno
            console.log('[DEBUG] TurmaAlunoDAO.getAlunos - Buscando relações turma-aluno');
            const q = query(collection(db, "turmaAluno"), where("idTurma", "==", id));
            const querySnapshot = await getDocs(q);
            
            console.log('[DEBUG] TurmaAlunoDAO.getAlunos - Total de relações encontradas:', querySnapshot.docs.length);
            console.log('[DEBUG] TurmaAlunoDAO.getAlunos - Dados das relações:', 
                querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            );

            const alunos: Aluno[] = [];
            const erros: Array<{id: string, erro: string}> = [];

            // Buscar cada aluno individualmente
            for (const doc of querySnapshot.docs) {
                const data = doc.data();
                try {
                    console.log('[DEBUG] TurmaAlunoDAO.getAlunos - Buscando aluno:', data.idAluno);
                    const aluno: Aluno = await alunoDAO.getOne(data.idAluno);
                    console.log('[DEBUG] TurmaAlunoDAO.getAlunos - Aluno encontrado:', aluno);
                    alunos.push(aluno);
                } catch (err) {
                    console.error(`[ERROR] TurmaAlunoDAO.getAlunos - Erro ao buscar aluno ${data.idAluno}:`, err);
                    const erroMsg = err instanceof Error ? err.message : String(err);
                    erros.push({ id: data.idAluno, erro: erroMsg });
                }
            }

            if (erros.length > 0) {
                console.error('[ERROR] TurmaAlunoDAO.getAlunos - Alguns alunos não foram encontrados:', erros);
            }

            console.log('[DEBUG] TurmaAlunoDAO.getAlunos - Total de alunos encontrados:', alunos.length);
            return alunos;
        } catch (error) {
            console.error('[ERROR] TurmaAlunoDAO.getAlunos - Erro ao buscar alunos:', error);
            throw error;
        }
    }

    // UPDATE
    async update(turmaAluno: TurmaAluno) {
        try {
            if (!turmaAluno.id) {
                throw new Error("ID do TurmaAluno não fornecido");
            }

            if (!turmaAluno.turma?.idTurma) {
                throw new Error("ID da turma não fornecido");
            }

            if (!turmaAluno.aluno?.id) {
                throw new Error("ID do aluno não fornecido");
            }

            console.log('[DEBUG] TurmaAlunoDAO.update - Atualizando relação:', {
                id: turmaAluno.id,
                turmaId: turmaAluno.turma.idTurma,
                alunoId: turmaAluno.aluno.id
            });

            await setDoc(doc(db, "turmaAluno", turmaAluno.id), {
                idTurma: turmaAluno.turma.idTurma,
                idAluno: turmaAluno.aluno.id
            });
            
            console.log("[DEBUG] TurmaAlunoDAO.update - TurmaAluno atualizado com sucesso!");
        } catch (error) {
            console.error("[ERROR] TurmaAlunoDAO.update - Erro ao atualizar TurmaAluno:", error);
            const msg = error instanceof Error ? error.message : String(error);
            throw new Error(`Erro ao atualizar TurmaAluno: ${msg}`);
        }
    }

    // DELETE
    async deletar(id: string) {
        const docRef = doc(db, "turmaAluno", id);

        try {
            await deleteDoc(docRef);
            console.log("TurmaAluno excluído com sucesso!");
        } catch (e) {
            throw new Error("Erro ao deletar TurmaAluno!");
        }
    }

    // TRANSFERIR ALUNO ENTRE TURMAS
    async transferirAluno(idAluno: string, idTurmaOrigem: string, idTurmaDestino: string) {
        try {
            console.log('[DEBUG] TurmaAlunoDAO.transferirAluno - Iniciando transferência:', {
                idAluno,
                idTurmaOrigem,
                idTurmaDestino
            });

            // Validações
            if (!idAluno || !idTurmaOrigem || !idTurmaDestino) {
                throw new Error("IDs do aluno, turma origem e turma destino são obrigatórios");
            }

            if (idTurmaOrigem === idTurmaDestino) {
                throw new Error("A turma de origem não pode ser igual à turma de destino");
            }

            // Verificar se o aluno está na turma de origem
            const q = query(
                collection(db, "turmaAluno"), 
                where("idAluno", "==", idAluno),
                where("idTurma", "==", idTurmaOrigem)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("Aluno não encontrado na turma de origem");
            }

            if (querySnapshot.docs.length > 1) {
                console.warn('[WARN] TurmaAlunoDAO.transferirAluno - Múltiplas relações encontradas para o mesmo aluno e turma');
            }

            // Verificar se o aluno já está na turma de destino
            const qDestino = query(
                collection(db, "turmaAluno"),
                where("idAluno", "==", idAluno),
                where("idTurma", "==", idTurmaDestino)
            );
            const querySnapshotDestino = await getDocs(qDestino);

            if (!querySnapshotDestino.empty) {
                throw new Error("Aluno já está na turma de destino");
            }

            // Verificar se as turmas existem
            try {
                await turmaDAO.getOne(idTurmaOrigem);
                await turmaDAO.getOne(idTurmaDestino);
            } catch (error) {
                throw new Error("Uma das turmas especificadas não existe");
            }

            // Remover da turma origem
            const docParaRemover = querySnapshot.docs[0];
            await deleteDoc(doc(db, "turmaAluno", docParaRemover.id));
            console.log('[DEBUG] TurmaAlunoDAO.transferirAluno - Removido da turma origem');

            // Adicionar na turma destino
            await addDoc(collection(db, "turmaAluno"), {
                idAluno: idAluno,
                idTurma: idTurmaDestino
            });
            console.log('[DEBUG] TurmaAlunoDAO.transferirAluno - Adicionado na turma destino');

            console.log('[DEBUG] TurmaAlunoDAO.transferirAluno - Transferência concluída com sucesso');
            
        } catch (error) {
            console.error('[ERROR] TurmaAlunoDAO.transferirAluno - Erro durante transferência:', error);
            const msg = error instanceof Error ? error.message : String(error);
            throw new Error(`Erro ao transferir aluno: ${msg}`);
        }
    }

    // BUSCAR TURMA ATUAL DO ALUNO
    async getTurmaAtualDoAluno(idAluno: string): Promise<string | null> {
        try {
            console.log('[DEBUG] TurmaAlunoDAO.getTurmaAtualDoAluno - Buscando turma do aluno:', idAluno);
            
            const q = query(
                collection(db, "turmaAluno"),
                where("idAluno", "==", idAluno)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('[DEBUG] TurmaAlunoDAO.getTurmaAtualDoAluno - Aluno não está em nenhuma turma');
                return null;
            }

            if (querySnapshot.docs.length > 1) {
                console.warn('[WARN] TurmaAlunoDAO.getTurmaAtualDoAluno - Aluno está em múltiplas turmas, retornando a primeira');
            }

            const turmaId = querySnapshot.docs[0].data().idTurma;
            console.log('[DEBUG] TurmaAlunoDAO.getTurmaAtualDoAluno - Turma encontrada:', turmaId);
            return turmaId;

        } catch (error) {
            console.error('[ERROR] TurmaAlunoDAO.getTurmaAtualDoAluno - Erro ao buscar turma:', error);
            throw error;
        }
    }
}

const turmaAlunoDAO = new TurmaAlunoDAO();
export default turmaAlunoDAO;
