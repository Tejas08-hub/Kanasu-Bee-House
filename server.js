import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.length > 1000) {
            return res.status(400).json({ error: "Message is required." });
        }

        // We combine the system instruction with the user message 
        // to ensure the AI knows its role without causing a 404.
        const prompt = `Role: You are the Kanasu Bee House assistant. You help beekeepers. Keep answers brief and professional.\n\nUser Question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ reply: "The hive is a bit smoky. Please try again later." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});