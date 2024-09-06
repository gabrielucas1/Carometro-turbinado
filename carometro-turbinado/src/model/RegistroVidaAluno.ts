import TipoRegistro from "./Enums/TipoRegistro";

export default class RegistroVidaAluno{
    id: string;
    tipoRegistro: TipoRegistro;
    descricao: string;
    idAluno: string

    constructor() {
        this.id = ""
        this.tipoRegistro = TipoRegistro.VAZIO
        this.descricao = ""
        this.idAluno = ""
    }
}