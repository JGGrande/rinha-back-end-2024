export function bootstrapDatabaseTables(pool){
  return pool.query(`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    CREATE TABLE IF NOT EXISTS pessoas (
      id SERIAL PRIMARY KEY,
      limite INTEGER NOT NULL,
      saldoInicial INTEGER NOT NULL
    );

    INSERT INTO pessoas (limite, saldoInicial) VALUES (100000, 0);
    INSERT INTO pessoas (limite, saldoInicial) VALUES (80000, 0);
    INSERT INTO pessoas (limite, saldoInicial) VALUES (1000000, 0);
    INSERT INTO pessoas (limite, saldoInicial) VALUES (10000000, 0);
    INSERT INTO pessoas (limite, saldoInicial) VALUES (500000, 0);

    CREATE TABLE IF NOT EXISTS transacoes (
      id SERIAL PRIMARY KEY,
      pessoaId INTEGER NOT NULL,
      valor INTEGER NOT NULL,
      tipo CHAR NOT NULL,
      descricao VARCHAR(10),
      FOREIGN KEY (pessoaId) REFERENCES pessoas(id)
    );  

  `)
}