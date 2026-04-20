import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render automatically sets the PORT variable
const port = process.env.PORT || 10000;

// Initialize the AI with your Render Environment Variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        // UPDATED FOR APRIL 2026:
        // gemini-1.5 is now retired. We use the Gemini 3.1 series.
        let model;
        try {
            // First choice: The high-speed 3.1 Flash
            model = genAI.getGenerativeModel({ model: "gemini-3.1-flash" });
            const result = await model.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        } catch (err) {
            console.log("Switching to 3.1 Pro fallback due to regional availability...");
            // Fallback: The more powerful 3.1 Pro
            model = genAI.getGenerativeModel({ model: "gemini-3.1-pro" });
            const result = await model.generateContent(message);
            const response = await result.response;
            return res.json({ reply: response.text() });
        }

    } catch (error) {
        console.error("FINAL API ERROR:", error.message);
        res.status(500).json({ 
            reply: "The hive is undergoing a 2026 upgrade. Please try again in 10 seconds!" 
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is live on port ${port}`);
});
