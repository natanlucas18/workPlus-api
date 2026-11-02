import { registerAs } from '@nestjs/config';

export default registerAs('global', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: String(process.env.DATABASE_USERNAME),
    password: String(process.env.DATABASE_PASSWORD),
    database: String(process.env.DATABASE_DATABASE),
    autoLoadEntities: Boolean(process.env.AUTO_LOAD_ENTITIES),
    synchronize: Boolean(process.env.SYNCHRONIZE),
  },
}));
