import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the file path/url
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 