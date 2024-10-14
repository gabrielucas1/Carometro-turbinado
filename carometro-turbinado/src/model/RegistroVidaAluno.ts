import { Timestamp } from "firebase/firestore";
import TipoRegistro from "./Enums/TipoRegistro";

export default class RegistroVidaAluno {
    id: string;
    tipoRegistro: TipoRegistro;
    descricao: string;
    idAluno: string;
    nomeProfessor: string
    data: Date;

    constructor() {
        this.id = ""
        this.tipoRegistro = TipoRegistro.VAZIO
        this.descricao = ""
        this.idAluno = ""
        this.nomeProfessor = ""
        this.data = new Date
    }
}