import express from "express";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const UploadRouter = express.Router();

// // ✅ Configure Cloudinary (add your .env variables)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// ✅ Multer (in-memory)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetype = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetype.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// ✅ Upload Route
UploadRouter.post("/", (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    try {
      // Upload image buffer to Cloudinary
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      res.status(200).json({
        message: "Image uploaded successfully ✅",
        imageUrl: result.secure_url,
      });
    } catch (uploadError) {
      res.status(500).json({ message: uploadError.message });
    }
  });
});

export default UploadRouter;
