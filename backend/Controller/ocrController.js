import { extractTextFromImage, parseOcrText } from '../utils/ocrUtils.js';
import fs from 'fs';

const performOCR = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded!' });
        }

        const imagePath = req.file.path; // Path to the uploaded image

        // Perform OCR
        const extractedText = await extractTextFromImage(imagePath);

        // Delete the uploaded file after processing
        fs.unlinkSync(imagePath);

        if (!extractedText) {
            return res.status(404).json({ message: 'No text detected in the image!' });
        }

        // Parse the OCR text
        const parsedData = parseOcrText(extractedText);
        console.log(extractedText);

        return res.status(200).json({ parseddata: parsedData });
    } catch (error) {
        console.error('Error in OCR:', error.message);
        return res.status(500).json({ message: 'Failed to perform OCR' });
    }
};

export default { performOCR };