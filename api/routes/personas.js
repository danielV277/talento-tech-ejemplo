import { Router } from "express";
import pool from "../config/db.js";

import upload from "../config/multer.js";

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


// Cambiar a upload.single('foto') para recibir una foto
router.post('/nuevo', upload.single('foto'), async (req, res) => {


    const { nombre, apellidos } = req.body;
    // Guardar la URL de la foto subida a S3
    const urlfoto = req.file ? req.file.location : null;

    try{


        // Guardar la URL de la foto en la columna urlfoto
        const result = await pool.query(
            'INSERT INTO Personas (nombre, apellidos, urlfoto) VALUES ($1, $2, $3) RETURNING *',
            [nombre, apellidos, urlfoto]);

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).json({ error: 'Error al insertar la persona' });
    }
})

export default router;