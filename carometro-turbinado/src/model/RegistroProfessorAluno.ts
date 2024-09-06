import Aluno from "./Aluno"
import RegistroProfessorTurma from "./RegistroProfessorTurma"

export default class RegistroProfessorAluno {
    id: string
    registroProfessorTurma: RegistroProfessorTurma
    aluno: Aluno
    observacao: string

    constructor() {
        this.id = ""
        this.registroProfessorTurma = new RegistroProfessorTurma
        this.aluno = new Aluno
        this.observacao = ""
    }
}