import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

router.get('/consultar', async (req,res) => {
    try {
        const result = await pool.query('SELECT * FROM Personas');
        res.json(result.rows)
    }catch(error){
        console.error('Error result', error);
        res.status(500).json({error:'Error al obtener los resultados'})
    }
    
});



router.post('/nuevo', async (req, res) => {

    const { nombre, apellidos } = req.body;

    try{
        const result = await pool.query(
            'INSERT INTO Personas (nombre, apellidos) VALUES ($1, $2) RETURNING *',
            [nombre,apellidos]);

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).json({ error: 'Error al insertar la persona' });
    }
})

export default router;