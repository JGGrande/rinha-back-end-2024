import pg from "pg";
import { bootstrapDatabaseTables } from "./migration.js";

const URL = process.env.DB_URL || 'postgres://postgres:12345678@localhost:5432/postgres';

export const pool = new pg.Pool({ connectionString: URL,
  max: +process.env.DB_POOL || 200,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000
  });

pool.on('error', connect);

pool.once('connect', () => bootstrapDatabaseTables(pool));

async function connect() {
  try {
    await pool.connect();
  } catch(err){
    setTimeout(() => {
      connect();
      console.error(`Falha ao se conectar ao banco esperando 5 segundos`);
    }, 5000)
  }
}

connect();
