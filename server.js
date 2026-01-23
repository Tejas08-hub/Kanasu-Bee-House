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

// FIXED: Using a more stable model configuration for production
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.length > 1000) {
            return res.status(400).json({ error: "Message is required and must be under 1000 characters." });
        }

        // We move system instructions here for better compatibility with the v1beta endpoint on Render
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: message }] }],
            systemInstruction: "You are the Kanasu Bee House assistant. You help beekeepers. Keep your answers brief and professional."
        });

        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error:", error);

        if (error.status === 429) {
            return res.status(429).json({ reply: "I'm a bit busy right now. Please wait a minute before asking again!" });
        }

        // Check for the 404 model error specifically
        if (error.message.includes("404") || error.message.includes("not found")) {
            return res.status(500).json({ reply: "AI Model configuration error. Please check server logs." });
        }

        res.status(500).json({ reply: "The hive is a bit smoky right now. Please try again later." });
    }
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
server.timeout = 10000;