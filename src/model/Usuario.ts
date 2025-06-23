import TipoUsuario from "./Enums/TipoUsuario"

export default class Usuario {
    id: string;
    tipoUsuario: TipoUsuario;
    escola: { id: string; nome?: string }; // Apenas o ID da escola
    nome: string;
    CEP: string;
    rua: string;
    bairro: string;
    complemento: string;
    numeroCasa: string;
    estado: string;
    cidade: string;
    dataNascimento: string;
    celular: string;
    usuario: { id: string; nome: string };

    constructor() {
        this.id = "";
        this.tipoUsuario = TipoUsuario.VAZIO;
        this.escola = { id: "" }; // Inicializa com apenas o ID
        this.nome = "";
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
    }
}