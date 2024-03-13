const cloudinary=require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name:process.env.Cloud_name,
  api_key:process.env.API_key,
  api_secret:process.env.API_secret,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_dev',
      allowerdFormats: ["png","jpeg","jpg"], // supports promises as well
    },
  });

  module.exports={cloudinary,storage}