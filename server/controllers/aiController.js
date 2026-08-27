const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the explicit API key provided by the user via environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
  try {
    const { history, message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Ensure history is in the correct format for Gemini
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Provide context if this is the start of a conversation
    let prompt = message;
    if (formattedHistory.length === 0) {
      prompt = `You are a helpful dental AI assistant for the 'SmileAura' platform. Answer the user's query.\n\nUser: ${message}`;
    }

    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to communicate with AI." });
  }
};
