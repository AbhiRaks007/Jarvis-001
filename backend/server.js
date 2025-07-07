const express = require('express');
const app = express();
const messageRoute = require('./routes/message');
const uploadRoute = require('./routes/upload');
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use('/api', messageRoute);
app.use('/api', uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Optionally serve frontend static files if needed
// app.use(express.static(path.join(__dirname, '../Jarvis')));

app.listen(5000, () => console.log('Server running on port 5000'));
