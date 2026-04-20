import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render uses port 10000 by default
const port = process.env.PORT || 10000;

// Initialize the API with your key from Render Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // APRIL 2026 STABLE CONFIGURATION
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite-preview",
            // This is the instruction that prevents ### and ***
            systemInstruction: "You are the Kanasu Bee House assistant. Provide helpful advice for beekeepers. Use PLAIN TEXT ONLY. Never use bolding, asterisks, hashtags, or markdown formatting. Keep the tone friendly and professional."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        
        // Final cleaning step: This removes any accidental formatting symbols 
        // that the AI might have included despite the instruction.
        let cleanReply = response.text()
            .replace(/\*/g, '')   // Removes all asterisks
            .replace(/#/g, '')    // Removes all hashtags
            .replace(/__/g, '')   // Removes underscores
            .trim();              // Removes extra spaces
        
        res.json({ reply: cleanReply });

    } catch (error) {
        console.error("API ERROR:", error.message);
        res.status(500).json({ 
            reply: "The hive is a bit busy right now. Please try again in 10 seconds! 🐝" 
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is live on port ${port}`);
});
