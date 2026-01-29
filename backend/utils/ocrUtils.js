import vision from '@google-cloud/vision';

// Initialize the Google Cloud Vision client
const client = new vision.ImageAnnotatorClient();

export const extractTextFromImage = async (imagePath) => {
    try {
        // Perform text detection
        const [result] = await client.textDetection(imagePath);
        const detections = result.textAnnotations;

        if (detections.length > 0) {
            return detections[0].description; // The full text detected
        } else {
            return null; // No text detected
        }
    } catch (error) {
        console.error('Error during OCR:', error.message);
        throw new Error('Failed to extract text from image');
    }
};

export const parseOcrText = (ocrText) => {
    const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line);
    const parsedData = {
        storeName: null,
        totalAmount: null,
        items: [],
    };

    // Extract store name (first line)
    parsedData.storeName = lines[0];

    // Extract total amount (Find the line containing 'TOTAL' and get the next line for the amount)
    const totalIndex = lines.findIndex(line => line.trim().toUpperCase() === 'TOTAL');
    if (totalIndex !== -1) {
        // Look for the first valid numeric value after the "TOTAL" line
        for (let i = totalIndex + 1; i < lines.length; i++) {
            const totalAmountMatch = lines[i].match(/^\d+(\.\d{1,2})?$/); // Match a valid number (e.g., 127.83)
            if (totalAmountMatch) {
                parsedData.totalAmount = parseFloat(totalAmountMatch[0]);
                break; // Stop searching after finding the total amount
            }
        }
    }

    // Extract items with price possibly between N or Y
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip lines that contain store info, addresses, or non-item content (like "ヨ", "N", "Y")
        if (line.includes("TOLEDO") || line.match(/#\d+/) || line.match(/\d{5}/) || /^[ヨ]+$/.test(line)) {
            continue;
        }

        // Match format: "ITEM NAME PRICE N" or "ITEM NAME PRICE Y"
        const itemMatch = line.match(/^(.+?)\s+([\d.]+)\s*[NY]$/);

        if (itemMatch) {
            // Case where item name and price are on the same line
            const itemName = itemMatch[1].trim();
            const itemAmount = parseFloat(itemMatch[2]);
            parsedData.items.push({ itemName, amount: itemAmount });
        } else {
            // Handle case where price is on the next line and ends with N or Y
            const nextLineMatch = lines[i + 1]?.match(/^([\d.]+)\s*[NY]$/);
            if (nextLineMatch) {
                const itemName = line.trim();
                const itemAmount = parseFloat(nextLineMatch[1]);
                parsedData.items.push({ itemName, amount: itemAmount });
                i++; // Skip the next line since we already processed the price
            }
        }
    }

    // Extract tax and add as an item
    const taxLineIndex = lines.findIndex(line => line.toUpperCase().includes('TAX'));
    if (taxLineIndex !== -1 && taxLineIndex + 1 < lines.length) {
        const taxAmountMatch = lines[taxLineIndex + 1].match(/[\d.]+/);
        if (taxAmountMatch) {
            parsedData.items.push({ itemName: 'Tax', amount: parseFloat(taxAmountMatch[0]) });
        }
    }
    return parsedData;
};
