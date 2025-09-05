// Para observações ESPECÍFICAS de cada aluno
import RegistroProfessorTurma from "./RegistroProfessorTurma"
import Aluno from "./Aluno"

export default class RegistroProfessorDescricao {
    id: string
    registroProfessor: RegistroProfessorTurma
    aluno: Aluno
    conselhoClasse: any // Adicionado campo para referência ao conselho
    observacao: string
    dataCriacao: Date
    dataModificacao: Date

    constructor() {
    this.id = ""
    this.registroProfessor = new RegistroProfessorTurma()
    this.aluno = new Aluno()
    this.conselhoClasse = null
    this.observacao = ""
    this.dataCriacao = new Date()
    this.dataModificacao = new Date()
    }
}