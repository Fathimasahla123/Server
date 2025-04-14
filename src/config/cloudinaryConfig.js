const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "customer-profiles",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const newStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      // cb(null, `${Date.now()}${path.extname(file.originalname)}`);
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
      return cb(null, true);
  } else {
      cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage: newStorage,
  fileFilter: fileFilter,
  limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = { cloudinary, uploadMiddleware, upload };
