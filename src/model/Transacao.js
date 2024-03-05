export class Transacao {
  constructor({ valor, tipo, descricao, }){
    this.valor = valor;
    this.tipo = tipo;
    this.descricao = descricao;
  }

  conectar(repositorio){
    this.repositorio = repositorio;
  }

  async salvar() {
    if(!this.repositorio){
      throw new Error("Repositorio não econtrado");
    }

    const dadosInserir = {
      valor: this.valor,
      tipo: this.tipo,
      descricao: this.descricao
    }

    const dados = await this.repositorio.query(dadosInserir);

    const { id } = dados;

    this.id = id;
  }

}