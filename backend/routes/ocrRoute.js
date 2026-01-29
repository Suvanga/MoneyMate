import express from 'express';
import ocrController from '../Controller/ocrController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Route to perform OCR with file upload
router.post('/performOCR', upload.single('image'), ocrController.performOCR);

export default router;