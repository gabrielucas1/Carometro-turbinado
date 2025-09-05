import Curso from "./Curso"

export default class Turma{
    id: string
    nome: string
    curso: Curso
    ano: string
    escola: { id: string; nome?: string } // Adicione esta linha
    fotoUrl: string

    constructor() {
        this.id = ""
        this.nome = ""
        this.curso = new Curso
        this.ano = ""
        this.escola = { id: "" } // Inicialize aqui também
        this.fotoUrl = ""
    }
}