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

// Initialize the AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // Fail-safe: Try the 1.5-flash model first
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("API Error:", error.message);
        
        // If the API key is missing or wrong, we'll see it in the Render logs
        res.status(500).json({ 
            reply: "The bees are still waking up. Please try again in a few seconds!" 
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is live on port ${port}`);
});
