import TipoUsuario from "./Enums/TipoUsuario"

export default class Usuario {
    id: string;
    tipoUsuario: TipoUsuario;
    escola: any;
    nome: string;
    email: string;
    CEP: string;
    rua: string;
    bairro: string;
    complemento: string;
    numeroCasa: string;
    estado: string;
    cidade: string;
    dataNascimento: string;
    celular: string;
    fotoUrl: string;
    usuario: any;

    constructor() {
        this.id = "";
        this.tipoUsuario = TipoUsuario.VAZIO;
        this.escola = { id: "" };
        this.nome = "";
        this.email = "";
        this.CEP = "";
        this.rua = "";
        this.bairro = "";
        this.complemento = "";
        this.numeroCasa = "";
        this.estado = "";
        this.cidade = "";
        this.dataNascimento = "";
        this.celular = "";
        this.usuario = { id: "", nome: "" };
        this.fotoUrl = "";
    }
}