import multer from "multer";
const storage = multer.diskStorage({
  // it will have the access of the temp file
  destination: function (req, file, cb) {
    cb(null, "../../public/temp");
  },
  filename: function (req, file, cb) {
    const filePath = `../../public/temp/${file.originalname}`;
    console.log(filePath);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
