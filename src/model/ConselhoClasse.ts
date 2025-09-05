// src/model/ConselhoClasse.ts
import Turma from "./Turma";

export default class ConselhoClasse {
    id: string = ""
    nome: string = "" // ex: "1º Trimestre 2024"
    turma: Turma = new Turma()
    dataCriacao: Date = new Date()
    dataModificacao: Date = new Date()

    constructor(){
        this.id = ""
        this.nome = ""
        this.turma = new Turma()
        this.dataCriacao = new Date()
        this.dataModificacao = new Date()
    }
}