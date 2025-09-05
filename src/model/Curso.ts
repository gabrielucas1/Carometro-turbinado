import Turno from "./Enums/Turno";
import Escola from "./Escola";

export default class Curso{
    id: string
    turno: string[]
    nome: string
    escola:  Escola
    fotoUrl: string;

    constructor() {
        this.id = ""
        this.turno = []
        this.nome = ""
        this.escola = new Escola()
        this.fotoUrl = ""
    }
}