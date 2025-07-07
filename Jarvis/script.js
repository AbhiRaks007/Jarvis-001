const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const micIcon = document.getElementById('micIcon');
const mediaBtn = document.getElementById('mediaBtn');
const mediaInput = document.getElementById('mediaInput');
const toggleMode = document.getElementById('toggleMode');

let darkMode = true;
const BACKEND_URL = 'http://localhost:5000'; // Change if your backend runs elsewhere

function appendMessage(text, sender = 'user', type = 'text') {
  const msg = document.createElement('div');
  msg.className = `message ${sender} ${type === 'media' ? 'media' : ''}`;
  if (type === 'media') {
    msg.innerHTML = text;
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessageToBackend(text) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    return data.reply || 'Jarvis: (no response)';
  } catch (e) {
    return 'Jarvis: (backend error)';
  }
}

sendBtn.onclick = async () => {
  const text = messageInput.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  messageInput.value = '';
  const reply = await sendMessageToBackend(text);
  appendMessage(reply, 'bot');
};

messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendBtn.onclick();
});

mediaBtn.onclick = () => mediaInput.click();
mediaInput.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('media', file);
  appendMessage('Uploading media...', 'user', 'media');
  try {
    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    let html = '';
    if (data.url && file.type.startsWith('image/')) {
      html = `<img src="${data.url}" alt="media" style="max-width:120px;max-height:120px;border-radius:1rem;" />`;
    } else if (data.url && file.type.startsWith('audio/')) {
      html = `<audio controls src="${data.url}"></audio>`;
    } else if (data.url && file.type.startsWith('video/')) {
      html = `<video controls src="${data.url}" style="max-width:160px;max-height:120px;border-radius:1rem;"></video>`;
    } else {
      html = 'Media uploaded.';
    }
    appendMessage(html, 'user', 'media');
    appendMessage('Jarvis: Media received!', 'bot');
  } catch (e) {
    appendMessage('Jarvis: Media upload failed.', 'bot');
  }
};

// Voice recognition
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    appendMessage(text, 'user');
    const reply = await sendMessageToBackend(text);
    appendMessage(reply, 'bot');
  };
  recognition.onend = () => {
    micIcon.textContent = '🎤';
    voiceBtn.classList.remove('listening');
  };
  recognition.onerror = () => {
    micIcon.textContent = '🎤';
    voiceBtn.classList.remove('listening');
  };
}
voiceBtn.onclick = () => {
  if (!recognition) {
    alert('Voice recognition not supported in this browser.');
    return;
  }
  micIcon.textContent = '🔴';
  voiceBtn.classList.add('listening');
  recognition.start();
};

toggleMode.onclick = () => {
  darkMode = !darkMode;
  if (darkMode) {
    document.body.style.background = 'linear-gradient(135deg, #1a0025 0%, #2d0b4e 100%)';
    document.querySelector('.jarvis-container').style.background = 'rgba(30, 30, 60, 0.85)';
    toggleMode.textContent = '🌙';
  } else {
    document.body.style.background = 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)';
    document.querySelector('.jarvis-container').style.background = 'rgba(255,255,255,0.85)';
    toggleMode.textContent = '☀️';
  }
};

// Responsive: auto dark mode on load
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkMode = true;
  toggleMode.onclick();
}

// Responsive: auto light mode on load if user prefers light
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  darkMode = false;
  toggleMode.onclick();
}
