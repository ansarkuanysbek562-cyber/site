require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro" });

// Serve static files from the current directory
app.use(express.static(__dirname));
app.use(express.json());

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
            return res.status(500).json({ error: 'API key is not configured.' });
        }

        const prompt = `You are a helpful and polite assistant for a plant shop called "Зеленый Оазис" (Green Oasis).
Answer questions about plants, our shop, and provide advice on plant care.
Keep your answers relatively short and friendly.
User message: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'An error occurred while generating response.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
