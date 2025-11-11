const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/ai.controller');

// Multer setup for multiple image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

// Allow only up to 3 images
const upload = multer({ storage: storage });

router.post(
  '/get-review',
  upload.array('images', 3),   // ✅ Updated for multiple images
  aiController.getReview
);

module.exports = router;
