import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve("./public/temp"); // absolute path

    // ✅ Auto-create the folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log("Created missing folder:", uploadPath);
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    console.log("Saving file as:", file.originalname);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
