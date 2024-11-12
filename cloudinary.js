const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

dotenv.config({ path: './cloud.env' });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
app.use(express.json());

// Configurar el almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rent-car-images',
    format: async () => 'jpeg',
  },
});

const upload = multer({ storage });

// Ruta para subir imágenes
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.path });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Cloudinary server running on port ${PORT}`));
