import { DataSource } from "typeorm";

process.loadEnvFile();

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*entity.js'],
    migrations: ['dist/database/migrations/*.js']
})