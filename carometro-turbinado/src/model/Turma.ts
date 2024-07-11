import Curso from "./Curso"

export default class Turma{
    id: string
    nome: string
    curso: Curso
    ano: string

    constructor() {
        this.id = ""
        this.nome = ""
        this.curso = new Curso
        this.ano = ""
    }
}