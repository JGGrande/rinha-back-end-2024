import { ValidationError } from "yup";

export function validarCorpoRequestMiddleware(corpoRequisicaoEsquema){

    return async function(request, response, next){
      try{
        await corpoRequisicaoEsquema.validate(request.body, { abortEarly: false });
        return next();
      }catch( error ){
        const errors = { }
  
        if(error instanceof ValidationError){
          error.inner.forEach( erro => {
            if(erro.path === undefined) return;
            errors[erro.path] = erro.message;
          })
  
          return response.status(400).json( errors );
        }
  
        return response.sendStatus(400)
      }
    }
  
  }