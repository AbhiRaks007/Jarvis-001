const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.post('/message', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: userMessage }] }]
      }
    );
    const aiReply = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I have no response.';
    res.json({ reply: aiReply });
  } catch (err) {
    res.json({ reply: 'Error connecting to Gemini AI.' });
  }
});

module.exports = router;
