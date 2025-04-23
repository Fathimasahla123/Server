const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to handle file cleanup
const removeTempFile = (filePath) => {
    try {
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(`Error removing temp file: ${filePath}`, err);
    }
};

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        // // Ensure file path is properly constructed
        // const tempFilePath = path.join(__dirname, '..', 'uploads', req.file.filename);

            // Get the correct file path
    const filePath = path.join(__dirname, '../uploads', req.file.filename);

    // Verify file exists before uploading to Cloudinary
    if (!fs.existsSync(filePath)) {
      throw new Error('Temporary file not found');
    }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "products"
        });

        // removeTempFile(tempFilePath);
         // Delete temporary file
    fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error("Upload error:", error);
        // console.error("Image upload error:", error);
        // if (req.file) {
        //     removeTempFile(path.join(__dirname, '..', 'uploads', req.file.filename));
        // }
        if (req.file) {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
        res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: error.message
        });
    }
};

exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No image files provided"
            });
        }

        const uploadPromises = req.files.map(file => {
            const tempFilePath = path.join(__dirname, '..', 'uploads', file.filename);
            return cloudinary.uploader.upload(tempFilePath, {
                folder: "products"
            })
            .then(result => {
                removeTempFile(tempFilePath);
                return result.secure_url;
            })
            .catch(err => {
                removeTempFile(tempFilePath);
                throw err;
            });
        });

        const imageUrls = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            imageUrls
        });
    } catch (error) {
        console.error("Multiple image upload error:", error);
        if (req.files) {
            req.files.forEach(file => {
                removeTempFile(path.join(__dirname, '..', 'uploads', file.filename));
            });
        }
        res.status(500).json({
            success: false,
            message: "Multiple image upload failed",
            error: error.message
        });
    }
};