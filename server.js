import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 10000;

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // TRY MODEL 1 (The newest 2026 stable flash)
        let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        try {
            const result = await model.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        } catch (firstError) {
            console.log("Model 2.5 failed, trying 1.5 Pro fallback...");
            
            // TRY MODEL 2 (The most stable fallback)
            model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        }

    } catch (error) {
        console.error("CRITICAL API ERROR:", error.message);
        res.status(500).json({ reply: "The bees are resting. Please try again in 10 seconds!" });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is live on port ${port}`);
});
