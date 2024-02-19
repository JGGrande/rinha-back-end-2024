import express from "express";
import { pool } from "./src/database/connection.js";

const app = express();

app.get('/', ( request, respose ) => {
  return respose.end("Tudo certo")
})

app.listen(8080, () => console.log("server on 8080"))