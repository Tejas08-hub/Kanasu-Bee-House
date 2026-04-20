import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
   model: "gemini-1.5-flash-latest",
    apiVersion: "v1"
});

app.post('/chat', async(req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        const prompt = `System: You are the Kanasu Bee House assistant. You only help with beekeeping topics. Answer briefly and helpfully.\n\nUser: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ reply: "The hive is a bit smoky right now. Please try again!" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
