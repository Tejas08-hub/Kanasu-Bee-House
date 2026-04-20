import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Initialize Google Generative AI with your Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// FIX: Use the stable model name 'gemini-1.5-flash' 
// This avoids the 404 error seen in your logs.
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash" 
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        // System context to keep the bot focused on beekeeping
        const prompt = `System: You are the Kanasu Bee House assistant. Help beekeepers with brief, helpful advice.\n\nUser: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("--- Gemini API Error Details ---");
        console.error("Message:", error.message);

        // Handle specific error types for better debugging on Render
        if (error.message.includes("429")) {
            return res.status(429).json({ 
                reply: "The bees are a bit overwhelmed (Rate Limit). Please try again in a minute!" 
            });
        }

        if (error.message.includes("404")) {
            return res.status(404).json({ 
                reply: "The AI hive is currently moving. Please check the model name in server.js." 
            });
        }

        res.status(500).json({ reply: "The hive is a bit smoky right now. Try again shortly!" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
