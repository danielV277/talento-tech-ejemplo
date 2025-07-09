import express from 'express';
import cors from 'cors';
import personasRoutes from './routes/personas.js';
import pool from './config/db.js';
import multer from 'multer';

const app = express()
const upload = multer();

app.use(cors())
app.use(express.json())

app.use('/api/personas',personasRoutes);

app.get('/api', (req, res) => {
    res.json({mensaje: 'API OK'})
})


const testDBConnection = async () => {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Conectado exitosamente a la base de datos PostgreSQL');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error.message);
      process.exit(1); // Opcional: salir si no se puede conectar
    }
};

app.listen(3000, async () => {
    console.log('Servidor corriendo en el puerto 3000')
    await testDBConnection();
})

