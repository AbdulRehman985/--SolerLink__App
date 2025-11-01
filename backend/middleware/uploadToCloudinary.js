import cloudinary from "../config/CloudineryConfig.js";

export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "Soler-Link pics",
    });

    req.cloudinaryResult = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Cloudinary upload failed", error });
  }
};
