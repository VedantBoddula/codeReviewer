const aiService = require('../services/ai.service');

module.exports.getReview = async (req, res) => {
  const code = req.body.code || "";
  const images = req.files || []; // ✅ multiple images

  // If no code AND no images
  if (!code && images.length === 0) {
    return res.status(400).send("Code or images are required");
  }

  try {
    let imagePaths = [];

    // ✅ Extract paths of uploaded images
    if (images.length > 0) {
      imagePaths = images.map(file => `uploads/${file.filename}`);
    }

    // ✅ Always send object to service
    const response = await aiService({
      code,
      imagePaths, // ✅ array of paths (empty if none)
    });

    res.send(response);

  } catch (error) {
    res.status(500).send("Error processing review: " + error.message);
  }
};
