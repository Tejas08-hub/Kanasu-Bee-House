import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Initialize with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use 'gemini-pro' - the most widely compatible model name
const model = genAI.getGenerativeModel({
    model: "gemini-pro" 
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // Simple prompt for maximum compatibility
        const result = await model.generateContent(message);
        const response = await result.response;
        
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("--- Gemini API Error ---");
        console.error(error.message);

        // Friendly error messages for your chatbot UI
        if (error.message.includes("429")) {
            return res.status(429).json({ reply: "The bees are busy. Please wait a minute!" });
        }
        
        res.status(500).json({ reply: "The hive is a bit smoky. Please try again in 30 seconds." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
