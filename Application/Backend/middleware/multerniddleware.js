import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "..", "image");

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (request, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/[:.]/g, "-") +
        path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage });
export default upload;
