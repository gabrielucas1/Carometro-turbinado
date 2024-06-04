import TipoUsuario from "./Enums/TipoUsuario"
import Escola from "./Escola"

export default class Usuario {
    id: string
    tipoUsuario: TipoUsuario
    escola: Escola
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
        this.tipoUsuario = TipoUsuario.VAZIO
        this.escola = new Escola()
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