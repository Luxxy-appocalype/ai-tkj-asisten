const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // API KEY diambil dari Environment Variables di Dashboard Vercel
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-09-2025",
      systemInstruction: "Anda adalah AI Assistant TKJ SMKN 1 Mojokerto. Anda ahli dalam MikroTik, Cisco, Linux Server, dan Troubleshooting. Jawablah dengan teknis namun mudah dimengerti siswa SMK. Gunakan bahasa Indonesia yang ramah."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
