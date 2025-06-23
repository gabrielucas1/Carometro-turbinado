import { db } from "@/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, QueryOrderByConstraint, setDoc } from "firebase/firestore";
import Escola from "@/model/Escola";

class EscolaDAO {
    //INSERIR
    async inserir(escola: Escola) {
        try {
            const docRef = await addDoc(collection(db, "escola"), {
                nome: escola.nome,
                cep: escola.cep,
                rua: escola.rua,
                bairro: escola.bairro,
                numeroCasa: escola.numeroCasa,
                complemento: escola.complemento,
                telefone: escola.telefone,
                estado: escola.estado,
                cidade: escola.cidade,
                rede: escola.rede,
                tipoEnsino: escola.tipoEnsino
            });
            console.log("Escola inserida com sucesso! ID: ", docRef.id);
        } catch (e) {
            console.error("Erro ao inserir escola: ", e);
        }
    }

    //GETONE
async getOne(id: string): Promise<Escola> {
    console.log("Buscando escola com ID:", id); // Log para verificar o ID recebido
    console.log("ID da escola sendo passado para getOne:", id);

    if (!id || id.trim() === "") {
        console.error("ID da escola é inválido ou está vazio!");
        throw new Error("ID da escola é inválido ou está vazio!");
    }

    const escola = new Escola();
    const docRef = doc(db, "escola", id.trim()); // Remove espaços extras
    const querySnapshot = await getDoc(docRef);

    if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        console.log("Dados da escola encontrados:", data); // Log para verificar os dados da escola

        escola.id = querySnapshot.id;
        escola.nome = data.nome;
        escola.cep = data.cep;
        escola.rua = data.rua;
        escola.bairro = data.bairro;
        escola.numeroCasa = data.numeroCasa;
        escola.complemento = data.complemento;
        escola.telefone = data.telefone;
        escola.estado = data.estado;
        escola.cidade = data.cidade;
        escola.rede = data.rede;
        escola.tipoEnsino = data.tipoEnsino;
    } else {
        console.error("Documento não encontrado para o ID:", id); // Log adicional
        throw new Error("Erro ao buscar uma escola!");
    }

    return escola;
}

    //GETALL
    async getAll(): Promise<Escola[]> {
        const querySnapshot = await getDocs(collection(db, "escola"));
        const escolas: Escola[] = [];
        querySnapshot.forEach((doc) => {
            console.log("ID do documento:", doc.id); // Log do ID do documento
            console.log("Dados do documento:", doc.data()); // Log dos dados do documento

            const data = doc.data();
            const escola: Escola = new Escola();

            escola.id = doc.id;
            escola.nome = data.nome;
            escola.cep = data.cep;
            escola.rua = data.rua;
            escola.bairro = data.bairro;
            escola.numeroCasa = data.numeroCasa;
            escola.complemento = data.complemento;
            escola.telefone = data.telefone;
            escola.estado = data.estado;
            escola.cidade = data.cidade;
            escola.rede = data.rede;
            escola.tipoEnsino = data.tipoEnsino;

            console.log("Escola criada:", escola); // Log do objeto escola criado
            escolas.push(escola);
        });

        return escolas;
    }

    //UPDATE
    async update(id: string, escola: Escola) {
        try {
            await setDoc(doc(db, "escola", id), {
                nome: escola.nome,
                cep: escola.cep,
                rua: escola.rua,
                bairro: escola.bairro,
                numeroCasa: escola.numeroCasa,
                complemento: escola.complemento,
                telefone: escola.telefone,
                estado: escola.estado,
                cidade: escola.cidade,
                rede: escola.rede,
                tipoEnsino: escola.tipoEnsino
            })
            console.log("Escola atualizada com sucesso!")
        } catch (e) {
            throw new Error("Erro ao atualizar escola!")
        }
    }


    //DELETE
    async deletar(id: string) {
        const docRef = doc(db, "escola", id)

        try {
            await deleteDoc(docRef)
            console.log("Escola excluida com sucesso!")
        } catch (e) {
            throw new Error("Erro ao deletar escola!")
        }
    }
}

const escolaDAO = new EscolaDAO();
export default escolaDAO