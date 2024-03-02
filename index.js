import express from "express";
// import { pool } from "./src/database/connection.js";
import { Cliente } from "./src/model/Cliente.js";
import { ValidationError, number, object, string } from "yup";
import { validarCorpoRequestMiddleware } from "./src/middleware/validarCorpoRequisicao.js";
import bodyParser from "body-parser";
import { TipoTransacoes } from "./src/model/TipoTransacoes.js";

const repositorioEmMemoria = {
  clientes: [],
  async query({ id, nome, saldoInicial, limite }) {

    if(id){
      const cliente = this.clientes.find( cliente => cliente.id === id );
      
      if(!cliente){
        return null
      }
      
      return cliente
    }

    const dadosParInserir = { 
      id: this.clientes.length + 1,
      nome, 
      saldoInicial, 
      limite
    }

    this.clientes.push(dadosParInserir);

    return dadosParInserir;
  }
}

const app = express();

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', "*");
  res.setHeader('Access-Control-Allow-Headers', "*");
  next();
});

app.get('/', ( request, respose ) => {
  return respose.end("Tudo certo")
})

app.get('/:id/transacoes', async ( request, respose ) => {

  // const idParametro = object({
  //   id: string()
  //     .test('eh-numero', 'Id deve ser um numero', id => {
  //       const valorTransformado = parseInt(id);
  //       return !isNaN(valorTransformado) && isFinite(valorTransformado) && valorTransformado > 0
  //     })
  //     .transform( id => parseInt(id) )
  // })

  // const { id } = idParametro.validateSync(request.params)

  const id = +request.params.id;

  if(!id) {
    return respose.status(400).json({ menssage: "Id inválido" })
  }

  const cliente = new Cliente({ id });

  cliente.conectar(repositorioEmMemoria);

  const clienteExistente = await cliente.encontrarPorId();

  if(clienteExistente === null){
    return respose.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  return respose.json({
    id: cliente.id,
    name: cliente.name,
    saldoInicial: cliente.saldoInicial,
    limite: cliente.limite
  });


});

const criarTransacaoCorpoSchema = object().shape({
  valor: number().positive().required(),
  tipo : string().oneOf([ TipoTransacoes.credito,TipoTransacoes.debito ]).required(),
  descricao : string().min(1).max(10).required()
});

app.post("/clientes/:id/transacoes", validarCorpoRequestMiddleware(criarTransacaoCorpoSchema), ( request, response ) => {
  const id = parseInt(request.params.id); 

  if(!id || isNaN(id) || id < 1 ) {
    return response.sendStatus(400)
  }

  const { valor, tipo, descricao } = request.body;

  const cliente = new Cliente({ id });

  if(!cliente){
    return response.sendStatus(404)
  }

  if(tipo === TipoTransacoes.credito){
    cliente.limite -= valor;
  }

  if(tipo === TipoTransacoes.debito){  
    cliente.saldoInicial -= valor;
  }

  if(tipo === TipoTransacoes.debito && cliente.saldoInicial < cliente.limite){
    return response.sendStatus(422)
  }

  return response.status(200).json({
    limite: cliente.limite,
    saldo: cliente.saldoInicial
  });
});


const criarClienteEsquema = object().shape({
  nome: string().max(255).required(),
  limite: number().moreThan(-1).required(),
  saldoInicial: number().moreThan(-1).required()
});


app.post('/clientes', validarCorpoRequestMiddleware(criarClienteEsquema), async ( request, respose ) => {

  const { nome, saldoInicial, limite } = request.body;

  const cliente = new Cliente({ nome, saldoInicial, limite });

  cliente.conectar(repositorioEmMemoria);

  await cliente.inserir();

  return respose.status(201).json({ id: cliente.id, nome, saldoInicial, limite });
});

app.listen(8080, () => console.log("server on 8080"))