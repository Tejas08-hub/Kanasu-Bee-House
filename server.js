import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// 1. FIRST: Initialize the Google AI with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. SECOND: Now that genAI exists, create the model
// We use the full model name string which is often required by the newer SDK
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // Using the most stable request format for Render
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error:", error.message);

        // Detailed error message to help us troubleshoot
        if (error.message.includes("404")) {
            return res.status(500).json({ reply: "Model not found. Please check API settings." });
        }

        res.status(500).json({ reply: "The hive is a bit smoky right now. Please try again." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});