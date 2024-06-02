import TipoUsuario from "./Enums/TipoUsuario"

export default class Usuario {
    id: string
    idAuth: string
    tipoUsuario: TipoUsuario
    nome: string
    CEP: string
    rua: string
    bairro: string
    complemento: string
    numeroCasa: string
    estado: string
    cidade: string
    dataNascimento: string
    celular: string

    constructor() {
        this.id = ""
        this.idAuth = ""
        this.tipoUsuario = TipoUsuario.VAZIO
        this.nome = ""
        this.CEP = ""
        this.rua = ""
        this.bairro = ""
        this.complemento = ""
        this.numeroCasa = ""
        this.estado = ""
        this.cidade = ""
        this.dataNascimento = ""
        this.celular = ""
    }
}