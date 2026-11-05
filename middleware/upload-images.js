const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure the Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'my_app_photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// 3. Create the Multer Middleware instance
const upload = multer({ storage: storage });

// 4. Export it for use in other files
module.exports = upload;
