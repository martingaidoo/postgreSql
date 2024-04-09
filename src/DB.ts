import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();//carga la variable de entorno

// Configura la conexión a tu base de datos en Azure PostgreSQL
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT as string),
    ssl: {
        rejectUnauthorized: false // Necesario para conexiones SSL con Azure PostgreSQL
    }
});

// Conecta a la base de datos

export default client;

