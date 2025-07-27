import express from "express";
import path from "path";
import multer from "multer";
const UploadRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const filetype = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  if (filetype.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Image only"), false);
  }
};
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");
UploadRouter.route("/").post((req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image Upload Successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No Image file Provided" });
    }
  });
});
export default UploadRouter;
