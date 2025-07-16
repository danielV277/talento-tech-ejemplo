import express from 'express';
import cors from 'cors';
import personasRoutes from './routes/personas.js';
import pool from './config/db.js';


const app = express()

app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
  res.json({mensaje: 'API OK'})
})

app.use('/api/personas',personasRoutes);

const testDBConnection = async () => {
    try {
      await pool.query('SELECT 1');
      console.log(`usuario: ${process.env.USER}, base de datos: ${process.env.DATABASE}, host: ${process.env.HOST}`);
      console.log('✅ Conectado exitosamente a la base de datos PostgreSQL');
    } catch (error) {
      console.log(`usuario: ${process.env.USER}, base de datos: ${process.env.DATABASE}, host: ${process.env.HOST}`);
      console.error('❌ Error al conectar con la base de datos:', error.message);
      process.exit(1); // Opcional: salir si no se puede conectar
    }
};

app.listen(3000, async () => {
    console.log('Servidor corriendo en el puerto 3000')
    await testDBConnection();
})

