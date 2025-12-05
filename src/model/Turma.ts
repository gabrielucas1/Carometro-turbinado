import Curso from "./Curso"

export default class Turma{
    idCurso: string
    idTurma: string
    nome: string
    curso: Curso
    ano: string
    escola: { id: string; nome?: string } // Adicione esta linha
    fotoUrl: string

    constructor() {
        this.idCurso = ""
         this.idTurma = ""
        this.nome = ""
        this.curso = new Curso
        this.ano = ""
        this.escola = { id: "" } // Inicialize aqui também
        this.fotoUrl = ""
    }
}