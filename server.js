import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render uses port 10000; this line handles it automatically
const port = process.env.PORT || 10000;

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // APRIL 2026 CONFIGURATION: Using Gemini 3.1 Flash Lite
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite-preview",
            // This instruction stops the AI from using Markdown
            systemInstruction: "You are the Kanasu Bee House assistant. Use PLAIN TEXT ONLY. Never use bolding, asterisks (**), hashtags (#), or bulleted lists. Keep answers concise and friendly for beekeepers."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        
        // Final cleaning step: Remove any accidental symbols the AI might include
        let cleanReply = response.text()
            .replace(/\*/g, '')   // Removes all asterisks
            .replace(/#/g, '')    // Removes all hashtags
            .replace(/__/g, '')   // Removes underscores
            .replace(/---/g, '')  // Removes horizontal lines
            .trim();              // Removes extra whitespace
        
        res.json({ reply: cleanReply });

    } catch (error) {
        console.error("API ERROR:", error.message);
        res.status(500).json({ 
            reply: "The bees are busy collecting nectar. Please try again in a few seconds! 🐝" 
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is live on port ${port}`);
});
