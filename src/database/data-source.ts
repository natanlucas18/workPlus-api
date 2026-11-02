import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,

  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],

  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],

  synchronize: false,
});
