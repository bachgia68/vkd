#!/bin/bash
# Setup script for TA Project - macOS/Linux
# Run: bash setup.sh

set -e

echo "🚀 TA Project Setup"

# 1. Check prerequisites
echo -e "\n✓ Checking prerequisites..."
check_cmd() {
    if command -v $1 &> /dev/null; then
        echo "  ✓ $1: $(eval "$1 --version" 2>/dev/null || echo "installed")"
    else
        echo "  ✗ $1: NOT FOUND (install required)"
    fi
}

check_cmd git
check_cmd docker
check_cmd node
check_cmd python3

# 2. Setup .env
echo -e "\n✓ Setting up .env..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "  Created .env (please edit with your tokens)"
else
    echo "  .env already exists"
fi

# 3. Install dependencies
echo -e "\n✓ Installing Node dependencies..."
npm install --legacy-peer-deps
npm install framer-motion shadcn-ui next-intl umami

echo -e "\n✓ Installing Python dependencies..."
pip3 install -q -r requirements.txt 2>/dev/null || echo "  requirements.txt not found (optional)"

# 4. Start Docker services
echo -e "\n✓ Starting Docker services..."
docker-compose up -d
echo "  Waiting for services..."
sleep 10

# 5. Status check
echo -e "\n✓ Service status:"
docker ps --filter "name=ta-" --format "table {{.Names}}\t{{.Status}}"

# 6. Display URLs
echo -e "\n✓ Access URLs:"
echo "  n8n:     http://localhost:5678"
echo "  Strapi:  http://localhost:1337"
echo "  Ollama:  http://localhost:11434"
echo "  Upscayl: http://localhost:7860"

# 7. Next steps
echo -e "\n📋 Next steps:"
echo "  1. Edit .env with your API tokens"
echo "  2. Read TASK_1_SETUP.md for Phase 1 (Images)"
echo "  3. Read TASK_5_SETUP.md for Phase 2 (Chatbot)"
echo "  4. Read PHASE_3_TASKS.md for Phase 3 (Frontend)"
echo "  5. npm run dev (start Next.js)"

echo -e "\n✅ Setup complete!"
