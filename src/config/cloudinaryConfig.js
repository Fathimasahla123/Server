const cloudinary = require("cloudinary").v2;
const {cloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new cloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "images",
        allowedFormats: ["jpg", "png", "jpeg"],
        transformation: [{ width:500, height:500, crop:"limit"}],
    },
});

const uploadMiddleware = multer({ storage: storage,
    limits:{ fileSize: 5*1024*1024}
});

module.exports = {cloudinary, uploadMiddleware};

