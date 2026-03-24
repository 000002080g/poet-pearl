import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const { action, input, context } = req.body;
        let prompt = "";

        if (action === 'grammar') prompt = `أنت سيبويه، شكل الأبيات واشرح إعرابها:\n${input}`;
        else if (action === 'prosody') prompt = `أنت الخليل بن أحمد، قطع الأبيات واذكر البحر:\n${input}`;
        else if (action === 'lexicon') prompt = `أنت ابن منظور، اشرح كلمة "${input}" في سياق: ${context}`;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ success: true, output: result.response.text() });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
