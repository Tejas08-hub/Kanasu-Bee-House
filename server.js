import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// 1. Check if the API Key exists before trying to use it
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from environment variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 2. Using 'gemini-1.5-flash' but with a fallback to 'gemini-pro'
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash" 
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("--- API Error ---", error.message);

        // If 1.5-flash still fails, this usually means the API key 
        // hasn't synced or doesn't have access yet.
        res.status(500).json({ 
            reply: "The hive is waking up. If this persists, please check Render Environment variables." 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
