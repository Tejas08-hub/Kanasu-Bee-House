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

// Use the full model path to ensure the API finds it
const model = genAI.getGenerativeModel({
    model: "models/gemini-1.5-flash" 
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // Generate content
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("--- Gemini API Error Details ---");
        console.error("Message:", error.message);

        if (error.message.includes("404")) {
            return res.status(404).json({ 
                reply: "The AI hive is still adjusting. Trying to find the right model path..." 
            });
        }
        
        if (error.message.includes("429")) {
            return res.status(429).json({ 
                reply: "The bees are busy! Please wait a moment before asking again." 
            });
        }

        res.status(500).json({ reply: "The hive is a bit smoky right now." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
