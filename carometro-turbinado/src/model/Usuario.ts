import TipoUsuario from "./Enums/TipoUsuario"

export default class Usuario {
    id: string
    idAuth: string
    tipoUsuario: TipoUsuario

    constructor() {
        this.id = ""
        this.idAuth = ""
        this.tipoUsuario = TipoUsuario.VAZIO
    }
}