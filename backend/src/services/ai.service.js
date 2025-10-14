const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyDuXVJmqjxAygUa5MZu3XbB6RB3t7lzAfE" });

async function generateContent(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    systemInstruction: `
You are a senior software engineer with 7+ years of experience.
You are capable of understanding and explaining any Programming langauges.


Review the given code and reply in three short sections:
1. **Mistakes:** Briefly list the issues in the code.
2. **Solutions:** Give short, clear fixes for each issue.
3. **Recommendations:** Add a few extra quick tips to improve quality or performance.

Guidelines:
- Keep answers short and easy to understand.
- Use bullet points.
- Avoid long explanations.
- Be polite and professional.
`


  });
  return response.text;
}

module.exports = generateContent;