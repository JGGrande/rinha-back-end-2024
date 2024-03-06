
export class Cliente {

    constructor({ id, saldoInicial, limite  }) {    
        this.id = id;
        this.saldoInicial = saldoInicial;
        this.limite = limite;
    }

    static conectar(repositorio){
        this.repositorio = repositorio;
    }

    async inserir() {
        if(!this.repositorio){
            throw new Error("Repositorio não econtrado");
        }

        const dadosInserir = {
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

        const { saldoInicial, limite } = dados;

        this.saldoInicial = saldoInicial;
        this.limite = limite;
    }

    static async encontrarTodos(){
        if(!this.repositorio){
            throw new Error("Repositorio não econtrado");
        }

        const queryResults = this.repositorio.query(`
            SELECT * 
            FROM pessoas;
        `)

        const [ results ] = queryResults.rows;

        console.log(results)
    }

}