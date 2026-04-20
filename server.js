import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render uses port 10000 by default, this line handles that
const port = process.env.PORT || 10000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Using 'gemini-1.5-flash' - ensure this matches exactly
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
        console.error("Chat Error:", error.message);
        // If you see '429' in logs, it means you've hit the free limit for the day
        res.status(500).json({ reply: "The hive is a bit smoky. Please try again in a moment." });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
