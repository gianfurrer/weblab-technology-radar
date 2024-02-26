import { DataType, newDb } from 'pg-mem';
import fs from 'fs';
import { v4 } from 'uuid';
import { genSaltSync, hashSync } from 'bcrypt';

export const db = newDb();

db.registerExtension('uuid-ossp', (schema) => {
  schema.registerFunction({
    name: 'uuid_generate_v4',
    returns: DataType.uuid,
    implementation: v4,
    impure: true,
  });
});

db.registerExtension('pgcrypto', (schema) => {
  // Mocking gen_salt function
  schema.registerFunction({
    name: 'gen_salt',
    args: [DataType.text, DataType.integer],
    returns: DataType.text,
    implementation: (type, rounds) => genSaltSync(rounds, 'b'),
    impure: false,
  });

  schema.registerFunction({
    name: 'crypt',
    args: [DataType.text, DataType.text],
    returns: DataType.text,
    implementation: hashSync,
    impure: false,
  });
});
db.public.none(fs.readFileSync('../database/00_schema.sql', 'utf8'));
db.public.none(fs.readFileSync('../database/01_seed.sql', 'utf8'));

const { Pool } = db.adapters.createPg();
export const pool = new Pool();

export async function executeSQL(query: string, ...args) {
  const result = await pool.query(query, args);
  return result.rows;
}
