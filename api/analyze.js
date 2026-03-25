import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const textInput = req.body.input || req.body.poem;
        const prompt = `أنت الخليل بن أحمد وسيبويه، شكل الأبيات التالية، واذكر بحرها، واشرح إعرابها:\n${textInput}`;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ analysis: result.response.text() });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
