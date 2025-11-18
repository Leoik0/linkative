// Configuração do Multer para upload de imagens
const multer = require("multer");
const path = require("path");
const { MAX_FILE_SIZE, ERRORS } = require("../config/constants");

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtro de tipo de arquivo
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error(ERRORS.INVALID_FILE_TYPE), false);
  }
};

// Configuração completa do Multer
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
