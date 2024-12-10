import Turma from "./Turma"
import Usuario from "./Usuario"

export default class RegistroProfessorTurma{
    id: string
    usuario: Usuario
    disciplina: string
    periodo: string
    turma: Turma
    revisaoGeral: String
    data: Date

    constructor() {
        this.id = ""
        this.usuario = new Usuario
        this.disciplina = ""
        this.periodo = ""
        this.turma = new Turma
        this.revisaoGeral = ""
        this.data = new Date()
    }
}