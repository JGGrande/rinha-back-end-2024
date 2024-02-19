export function bootstrapDatabaseTables(pool){
  return pool.query(`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    CREATE TABLE IF NOT EXISTS pessoas (
      id uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
      nome TEXT NOT NULL
    );

  `)
}