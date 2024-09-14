const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp')

const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

const convertToWebp = async (req, res, next) => {
    if (!req.file) return next();

    try {
        // Convertir l'image en format .webp et 600x600px max
        const buffer = await sharp(req.file.buffer).resize({ width: 600, height: 600, fit: "inside" }).webp({ quality: 80 }).toBuffer();

        // Générer un nom de fichier pour l'image .webp
        const name = req.file.originalname.split(" ").join("_");
        const newFilename = name + Date.now() + ".webp";
        const filePath = path.join("images", newFilename);

        fs.writeFileSync(filePath, buffer);

        // Attacher les informations du fichier à l'objet req.file
        req.file.path = filePath;
        req.file.filename = newFilename;
        req.file.mimetype = "image/webp";

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { upload, convertToWebp };