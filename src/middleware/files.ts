import multer, { diskStorage } from "multer";
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const fileUploader = multer({
    storage: diskStorage({
        destination: "storage/",
        filename: (req, file, callback) => {
            callback(null, Date.now() + "-" + file.originalname);
        },
    }),
    fileFilter(req, file, callback) {
        const mimetype = file.mimetype;

        if (!allowedImageTypes.includes(mimetype)) {
            callback(new Error("File format is incorrect"));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 10000000,
    },
});

export const uploadImage = fileUploader.single("my-file");

export default fileUploader;
