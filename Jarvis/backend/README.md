# Jarvis Backend

This is a Node.js Express backend for the Jarvis bot. It provides REST API endpoints for chat, media uploads (images/audio/video), and is ready for future AI integration.

## Features
- RESTful chat API
- Media upload endpoint (images, audio, video)
- CORS enabled
- Modern JavaScript (ES6+)
- Clear folder structure for routes, controllers, uploads

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   node index.js
   ```

## Endpoints
- `POST /api/message` — Send a chat message
- `POST /api/upload` — Upload media (image/audio/video)

Uploads are stored in the `uploads/` directory.
