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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // APRIL 2026 STABLE MODELS
        // We use gemini-3.1-flash-lite-preview as it is the most reliable current model
        let model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

        try {
            const result = await model.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        } catch (err) {
            console.log("3.1 Lite failed, trying 3.1 Pro fallback...");
            // Fallback to the 3.1 Pro preview if Lite is busy
            model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });
            const result = await model.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        }

    } catch (error) {
        console.error("API ERROR:", error.message);
        res.status(500).json({ 
            reply: "The hive is busy with the spring bloom. Please try again in a few seconds! 🐝" 
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is live on port ${port}`);
});
