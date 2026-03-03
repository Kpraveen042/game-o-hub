# 🎮 GAME-O-HUB

> **Play. Compete. Win.** — Classic browser games meet AI-powered experiences.

A full-stack game hub with 5 playable browser games and 2 standalone AI games (facial emotion recognition + voice command maze). Built with React + Vite on the frontend and Python on the AI side.

---

## 🗂️ Project Structure

```
game-o-hub/
├── frontend/                  # React + Vite web app
│   ├── src/
│   │   ├── App.jsx            # Main app (all games + UI)
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── ai-games/                  # Standalone Python games
│   ├── emotion/
│   │   └── emotion_game.py    # Webcam emotion recognition
│   ├── voice/
│   │   └── voice_game.py      # Microphone voice maze
│   └── requirements.txt
│
├── setup.sh                   # One-command setup (macOS/Linux)
├── setup.bat                  # One-command setup (Windows)
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org) |
| **npm** | comes with Node | — |
| **Python** *(AI games only)* | 3.10 or 3.11 | [python.org](https://python.org) |
| **Git** | any | [git-scm.com](https://git-scm.com) |

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/game-o-hub.git
cd game-o-hub
```

---

### 2a. Automated setup (recommended)

**macOS / Linux:**
```bash
bash setup.sh
```

**Windows:**
```bat
setup.bat
```

---

### 2b. Manual setup

**Frontend:**
```bash
cd frontend
npm install
```

**AI games (optional):**
```bash
cd ai-games
pip install -r requirements.txt
```

For the **Voice Command** game, `pyaudio` needs an extra step:

| OS | Command |
|----|---------|
| Windows | `pip install pipwin && pipwin install pyaudio` |
| macOS | `brew install portaudio && pip install pyaudio` |
| Linux | `sudo apt install python3-pyaudio && pip install pyaudio` |

---

### 3. Run the website

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser. ✅

---

### 4. Run AI games (optional)

Open a second terminal, then:

```bash
cd ai-games

# Emotion Recognition (webcam)
python emotion/emotion_game.py

# Voice Command Maze (microphone)
python voice/voice_game.py
```

---

## 🕹️ Games

### Browser Games (play at localhost:5173)

| Game | Description | Difficulty |
|------|-------------|------------|
| ⭕ **Tic Tac Toe** | Classic 3×3 — beat the minimax AI or a friend locally | Easy |
| ⌨️ **Typing Game** | 60 seconds, type as many words as possible | Medium |
| 🍽️ **Swipe the Plate** | Click plates before they disappear — test reflexes | Medium |
| ⚔️ **Menja** | Slash falling objects with your mouse | Hard |
| 🧩 **Puzzle** | Slide numbered tiles into order | Medium |

### AI Games (standalone Python apps)

| Game | Hardware | Fallback |
|------|----------|---------|
| 😄 **Emotion Recognition** | Webcam | Simulation mode (random emotions) |
| 🎙️ **Voice Command Maze** | Microphone | Keyboard mode (WASD / arrow keys) |

> **No webcam or mic?** Both AI games have fallback modes — you can play them even without hardware.

---

## 📦 Available Scripts

### Frontend (`/frontend`)

```bash
npm run dev       # Start dev server at localhost:5173
npm run build     # Build for production → /frontend/dist
npm run preview   # Preview the production build locally
```

### AI Games (`/ai-games`)

```bash
python emotion/emotion_game.py                          # Basic run
python emotion/emotion_game.py --token YOUR_JWT_TOKEN   # With score saving

python voice/voice_game.py                              # Basic run
python voice/voice_game.py --token YOUR_JWT_TOKEN       # With score saving
```

---

## 🌐 Deploying

### Frontend (Netlify / Vercel / GitHub Pages)

1. Build the project:
   ```bash
   cd frontend && npm run build
   ```
2. Deploy the `frontend/dist/` folder to any static host.

**Netlify** (one-click):
```
Base directory:   frontend
Build command:    npm run build
Publish dir:      frontend/dist
```

**Vercel** (one-click):
```
Framework:        Vite
Root dir:         frontend
Build command:    npm run build
Output dir:       dist
```

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm: command not found` | Install Node.js from https://nodejs.org |
| `vite: not found` | Run `npm install` inside the `frontend/` folder |
| `ModuleNotFoundError: pygame` | `pip install pygame` |
| `ModuleNotFoundError: cv2` | `pip install opencv-python` |
| `ModuleNotFoundError: deepface` | `pip install deepface tf-keras` |
| Emotion game shows "simulation" | deepface is installed but no webcam found |
| Voice game shows "KEYBOARD MODE" | Install `SpeechRecognition` + `pyaudio`, then rerun |
| `OSError: [Errno -9996]` PyAudio | Set your default mic in OS sound settings |
| First emotion game run is slow | DeepFace downloads models (~500 MB) on first use |
| Port 5173 already in use | `npm run dev -- --port 3000` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 |
| Build tool | Vite 5 |
| Styling | CSS-in-JS (injected `<style>` tag) |
| Fonts | Orbitron, Barlow Condensed, JetBrains Mono (Google Fonts) |
| AI — face detection | DeepFace + OpenCV |
| AI — speech recognition | SpeechRecognition + Google Web Speech API |
| Game rendering | Pygame (Python) |

---

## 📄 License

MIT — free to use, modify and distribute.

---

<div align="center">
  Made with ❤️ · <strong>GAME-O-HUB</strong> · Play. Compete. Win.
</div>
