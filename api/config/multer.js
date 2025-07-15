//import path from "path";
//import fs from "fs";
import multer from  "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

import 'dotenv/config'

//import AWS, { S3 } from "aws-sdk";


//const uploadDir = "./uploads";

// if(!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir);
// }

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION
// });

const client =  new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});







const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME, // Reemplaza con el nombre de tu bucket
        acl: 'public-read', // Permite acceso público a los archivos subidos
        key: (req, file, cb) => {
            cb(null, `uploads/${Date.now().toString()}-${file.originalname}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//     }
// });

export default upload;