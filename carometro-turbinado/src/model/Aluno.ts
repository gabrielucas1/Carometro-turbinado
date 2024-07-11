import Turma from "./Turma"

export default class Aluno {
    id: string
    nome: string
    dataNascimento: string
    telefone: string
    cep: string
    rua: string
    bairro: string
    numeroEndereco: string
    estado: string
    cidade: string
    complemento: string
    turma: Turma

    constructor() {
        this.id = ""
        this.nome = ""
        this.dataNascimento = ""
        this.telefone = ""
        this.cep = ""
        this.rua = ""
        this.bairro = ""
        this.numeroEndereco = ""
        this.estado = ""
        this.cidade = ""
        this.complemento = ""
        this.turma = new Turma
    }
}
