import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadFileCloudinary = async function (localFilePath) {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File is uploaded form the file src " + response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async function (publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
  } catch (error) {
    console.log("Error in the time of deleting form the cloudinary");
    return null;
  }
};
export { uploadFileCloudinary, deleteFromCloudinary };
