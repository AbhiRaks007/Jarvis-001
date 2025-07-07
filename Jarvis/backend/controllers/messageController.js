// Placeholder for future AI integration
exports.handleMessage = (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  // Echo the message for now
  res.json({ reply: ` ${message}` });
};
