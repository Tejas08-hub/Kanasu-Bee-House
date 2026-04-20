import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// SWITCHED: Using gemini-1.5-pro which has wider availability 
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro" 
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // Generate content with simple text prompt
        const result = await model.generateContent(`System: You are the Kanasu Bee House assistant. Help beekeepers with brief advice.\n\nUser: ${message}`);

        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("--- Gemini API Error Details ---");
        console.error("Full Error Message:", error.message);

        // Specific handling for 404 to provide a clearer user message
        if (error.message.includes("404")) {
            return res.status(404).json({ 
                reply: "The AI hive is still waking up. Please try again in 1 minute." 
            });
        }
        
        if (error.message.includes("429")) {
            return res.status(429).json({ 
                reply: "The bees are busy! (Too many requests). Please wait a moment." 
            });
        }

        res.status(500).json({ reply: "The hive is a bit smoky right now. Try again shortly!" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
