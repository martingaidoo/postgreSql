import express, { Request, Response } from 'express';
import client from './src/DB';  

const app = express();
const PORT = 3000;

app.use(express.json());

let connected = false; // Variable to track the connection status

// Connect to the database when the application starts
client.connect()
    .then(() => {
        console.log('Conexión exitosa a la base de datos');
        connected = true; // Mark the connection as open
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos', err);
        process.exit(1); // Exit the application if the connection fails
    });

app.use((req, res, next) => {
    if (!connected) { // Check if the connection is not yet open
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    } else {
        next(); // If the connection is already open, simply pass to the next middleware
    }
});

// Routes to get all records from the price list
app.get('/listado_precios', async (req: Request, res: Response) => {
    try {
        const result = await client.query('SELECT * FROM listado_precios');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener los registros del listado de precios:', err);
        res.status(500).json({ error: 'Error al obtener los registros del listado de precios' });
    }
});

app.get('/listado_precios/:codigo', async (req: Request, res: Response) => {
    try {
        const codigo = req.params.codigo;
        const result = await client.query('SELECT * FROM listado_precios WHERE codigo = $1', [codigo]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró ningún registro con ese código' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el registro del listado de precios por código:', err);
        res.status(500).json({ error: 'Error al obtener el registro del listado de precios por código' });
    }
});

app.post('/listado_precios', async (req: Request, res: Response) => {
    try {
        const { nombre, precio_lista, fecha_actualizacion } = req.body;
        console.log(req.body)
        // Execute a query to insert a new record into the listado_precios table
        const result = await client.query('INSERT INTO listado_precios (nombre, precio_lista, fecha_actualizacion) VALUES ($1, $2, $3) RETURNING *', [nombre, precio_lista, fecha_actualizacion]);
        // Return the newly created record in JSON format
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating a new record in the listado_precios:', err);
        res.status(500).json({ error: 'Error creating a new record in the listado_precios' });
    }
});

// Listen on the port
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});