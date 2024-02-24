import { number, object, string } from "yup";

export class Cliente {

    constructor({ id, nome, saldoInicial, limite  }) {    
        this.id = id;
        this.nome = nome;
        this.saldoInicial = saldoInicial;
        this.limite = limite;
    }

    conectar(repositorio){
        this.repositorio = repositorio;
    }

    async inserir() {
        if(!this.repositorio){
            throw new Error("Repositorio não econtrado");
        }

        const dadosInserir = {
            nome: this.nome,
            saldoInicial: this.saldoInicial,
            limite: this.limite
        };

        const dados = await this.repositorio.query(dadosInserir);

        const { id } = dados;

        this.id = id;
    }

    async encontrarPorId(){
        if(!this.id){
            throw new Error("Id não informado no objeto");
        }

        const dados = await this.repositorio.query({ id: this.id });

        if(!dados){
            return null;
        }

        const { nome, saldoInicial, limite } = dados;

        this.nome = nome;
        this.saldoInicial = saldoInicial;
        this.limite = limite;

    }

}