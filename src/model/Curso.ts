import Turno from "./Enums/Turno";
import Escola from "./Escola";

export default class Curso {
    id: string;
    idEscola: string;
    turno: string[];
    nome: string;
    escola: Escola;
    fotoUrl: string;

    constructor() {
        this.id = "";
        this.idEscola = "";
        this.turno = [];
        this.nome = "";
        this.escola = new Escola();
        this.fotoUrl = "";
    }
}