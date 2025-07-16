import { Router } from "express";
import pool from "../config/db.js";


import multer from "multer";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/S3.js";
import 'dotenv/config';

const router = Router();


// Consulta personas y obtiene la foto desde S3 si existe fileName
router.get('/consultar', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Personas');
        const personas = await Promise.all(result.rows.map(async persona => {
            if (persona.name_file_foto) {
                try {
                    const getParams = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: persona.name_file_foto
                    };
                    const command = new GetObjectCommand(getParams);
                    const s3Response = await s3.send(command);
                    // Convertir el stream a base64
                    const chunks = [];
                    for await (const chunk of s3Response.Body) {
                        chunks.push(chunk);
                    }
                    const buffer = Buffer.concat(chunks);
                    persona.foto = `data:${s3Response.ContentType};base64,${buffer.toString('base64')}`;
                } catch (err) {
                    persona.foto = null;
                }
            } else {
                persona.foto = null;
            }
            return persona;
        }));
        res.json(personas);
    } catch (error) {
        console.error('Error result', error);
        res.status(500).json({ error: 'Error al obtener los resultados' });
    }
});



// Usar multer en memoria
const upload = multer({ storage: multer.memoryStorage() });


router.post('/nuevo', upload.single('foto'), async (req, res) => {
    const { nombre, apellidos } = req.body;
    let fileName = null;

    if (req.file) {
        // Subir a S3 usando la instancia importada
        fileName = `uploads/${Date.now()}-${req.file.originalname}`;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };
        try {
            await s3.send(new PutObjectCommand(params));
        } catch (err) {
            console.error('Error al subir a S3:', err);
            return res.status(500).json({ error: 'Error al subir la foto a S3' });
        }
    }

    // Si no hay foto, fileName será null
    try {
        const result = await pool.query(
            'INSERT INTO Personas (nombre, apellidos, name_file_foto) VALUES ($1, $2, $3) RETURNING *',
            [nombre, apellidos, fileName]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).json({ error: 'Error al insertar la persona' });
    }
});

export default router;