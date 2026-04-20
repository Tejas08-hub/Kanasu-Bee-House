import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render provides the PORT variable automatically
const port = process.env.PORT || 3000;

// Initialize the AI with the key from Render's environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Use the stable model name
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash" 
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("Chat Error:", error.message);
        res.status(500).json({ reply: "The hive is a bit smoky. Please try again." });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
