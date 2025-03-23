import { createWorker } from 'tesseract.js';

export const ocrService = {
    extractText: async (file) => {
        try {
            const worker = await createWorker();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            
            // Convert file to image URL
            const imageUrl = URL.createObjectURL(file);
            const result = await worker.recognize(imageUrl);
            await worker.terminate();
            
            // Cleanup
            URL.revokeObjectURL(imageUrl);
            
            return result.data.text;
        } catch (error) {
            console.error('OCR error:', error);
            throw new Error('Failed to extract text from image');
        }
    }
};
