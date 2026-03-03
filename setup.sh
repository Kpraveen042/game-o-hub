#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  GAME-O-HUB — One-command setup script (macOS / Linux)
#  Usage: bash setup.sh
# ─────────────────────────────────────────────────────────────────

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${RESET}"
echo -e "${CYAN}║        GAME-O-HUB  SETUP             ║${RESET}"
echo -e "${CYAN}╚══════════════════════════════════════╝${RESET}"
echo ""

# ── Frontend ────────────────────────────────────────────────────
echo -e "${YELLOW}[1/3] Installing frontend dependencies...${RESET}"
cd frontend
npm install
cd ..
echo -e "${GREEN}✔  Frontend ready${RESET}"

# ── Python check ────────────────────────────────────────────────
echo -e "${YELLOW}[2/3] Checking Python...${RESET}"
if command -v python3 &>/dev/null; then
    PYTHON=python3
elif command -v python &>/dev/null; then
    PYTHON=python
else
    echo "⚠  Python not found. Install from https://python.org then run:"
    echo "   pip install -r ai-games/requirements.txt"
    PYTHON=""
fi

if [ -n "$PYTHON" ]; then
    PY_VER=$($PYTHON --version 2>&1)
    echo -e "${GREEN}✔  Found $PY_VER${RESET}"
fi

# ── AI Games deps ───────────────────────────────────────────────
if [ -n "$PYTHON" ]; then
    echo -e "${YELLOW}[3/3] Installing AI game dependencies...${RESET}"
    echo "    (This may take a few minutes on first run)"
    pip install -r ai-games/requirements.txt
    echo -e "${GREEN}✔  AI games ready${RESET}"
    echo ""
    echo -e "${YELLOW}Note: pyaudio (for Voice Command mic) needs a separate step:${RESET}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "    brew install portaudio && pip install pyaudio"
    else
        echo "    sudo apt install python3-pyaudio && pip install pyaudio"
    fi
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║         SETUP COMPLETE! 🎮            ║${RESET}"
echo -e "${GREEN}╚══════════════════════════════════════╝${RESET}"
echo ""
echo "  Start the website:    cd frontend && npm run dev"
echo "  Emotion game:         cd ai-games && python emotion/emotion_game.py"
echo "  Voice game:           cd ai-games && python voice/voice_game.py"
echo ""
