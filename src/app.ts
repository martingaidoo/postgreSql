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
client.connect()
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos', err));


client.query("SELECT * FROM usuarios")
    .then(result => console.table(result.rows))
    .catch(err => console.error('Error al ejecutar la consulta', err))
    .finally(() => client.end()); // Cierra la conexión a la base de datos
