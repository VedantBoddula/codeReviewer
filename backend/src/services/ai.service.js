const { GoogleGenAI } = require("@google/genai");
const fs = require("fs").promises; // For reading image files

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDuXVJmqjxAygUa5MZu3XbB6RB3t7lzAfE",
});

async function generateContent(input) {
  const { code, imagePaths = [] } = input;

  let contents = [];

  // ✅ Add code text
  if (code) {
    contents.push({ text: code });
  }

  // ✅ Add multiple images
  if (imagePaths.length > 0) {
    for (const imagePath of imagePaths) {
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString("base64");

      contents.push({
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg", // You may detect actual mime type later
        },
      });
    }
  }

  // ✅ No content provided
  if (contents.length === 0) {
    throw new Error("No content provided");
  }

  // ✅ Send to Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    systemInstruction: `
You are a senior software engineer with 7+ years of experience.
You are skilled in understanding programming code and analyzing code-related images.

Review the given code and/or images and provide feedback in three clear sections:
1. **Mistakes:** Short bullet points listing issues.
2. **Solutions:** Clear and simple fixes.
3. **Recommendations:** Tips to improve code quality and readability.

Guidelines:
- Keep responses short and beginner-friendly.
- Use bullet points only.
- Tone should be polite and professional.
    `,
  });

  return response.text;
}

module.exports = generateContent;
