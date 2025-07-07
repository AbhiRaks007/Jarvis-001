const express = require('express');
const cors = require('cors');
const path = require('path');

const messageRoutes = require('./routes/message');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/message', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Serve frontend (index.html and static assets)
app.use(express.static(path.join(__dirname, '../')));

// Fallback: always serve index.html for any unknown route (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Jarvis backend running on port ${PORT}`);
});
