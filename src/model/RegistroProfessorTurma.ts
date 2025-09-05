import Turma from "./Turma"
import Usuario from "./Usuario"
import ConselhoClasse from "./ConselhoClasse"

export default class RegistroProfessorTurma{
    id: string
    usuario: Usuario
    disciplina: string
    periodo: string
    turma: Turma
    tipoRegistro: string
    revisaoGeral: String
    data: Date
    conselhoClasse: ConselhoClasse

    constructor() {
        this.id = ""
        this.usuario = new Usuario
        this.disciplina = ""
        this.periodo = ""
        this.turma = new Turma
        this.tipoRegistro = ""
        this.revisaoGeral = ""
        this.data = new Date()
        this.conselhoClasse = new ConselhoClasse()
    }
}