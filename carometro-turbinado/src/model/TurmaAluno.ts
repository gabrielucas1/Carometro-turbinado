import Aluno from "./Aluno"
import Turma from "./Turma"

export default class TurmaAluno{
    id: string
    turma: Turma
    aluno: Aluno

    constructor() {
        this.id = "",
        this.turma = new Turma,
        this.aluno = new Aluno
    }
}