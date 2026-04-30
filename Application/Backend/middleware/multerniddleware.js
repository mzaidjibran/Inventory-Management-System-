import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "image/");
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
