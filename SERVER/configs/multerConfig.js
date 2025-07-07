const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        // Extrai a extensão do arquivo a partir do mimetype
        const ext = getFileExtension(file.mimetype);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nome do arquivo
    }
});

// Função para extrair a extensão do arquivo a partir do mimetype
const getFileExtension = (mimetype) => {
    switch (mimetype) {
        case 'image/jpeg':
            return '.jpg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        default:
            return '.jpg';
    }
};

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
