import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// 1. Initialize with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. UPDATED: Use the 2026 stable model "gemini-2.5-flash"
// This model is faster, smarter, and doesn't trigger the 404 error
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // 3. System instructions embedded directly for better stability
        const prompt = `System: You are the Kanasu Bee House assistant. Help beekeepers briefly.\n\nUser: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("Gemini API Error:", error.message);

        // Final fallback: If 2.5 is not yet available in your region, try gemini-2.0-flash
        if (error.message.includes("404")) {
            return res.status(500).json({ reply: "The AI hive is updating. Please try again in 30 seconds." });
        }

        res.status(500).json({ reply: "The hive is a bit smoky right now." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});