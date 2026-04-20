import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render uses port 10000; this line detects it automatically
const port = process.env.PORT || 10000;

// Initialize the AI with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // APRIL 2026 UPDATE: gemini-1.5 is retired.
        // We now use the "gemini-3.1-flash-lite-preview" or "gemini-3-flash-preview"
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("API Error:", error.message);
        
        // If the 3-flash model fails, try the absolute newest 3.1-flash-lite
        try {
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
            const result = await fallbackModel.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        } catch (fallbackError) {
            res.status(500).json({ reply: "The hive is undergoing a 2026 upgrade. Please try again in a moment!" });
        }
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is live on port ${port}`);
});
