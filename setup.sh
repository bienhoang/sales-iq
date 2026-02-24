#!/bin/bash
set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}  $1${NC}"; }
ok()    { echo -e "${GREEN}  [ok] $1${NC}"; }
warn()  { echo -e "${YELLOW}  [!!] $1${NC}"; }
fail()  { echo -e "${RED}  [error] $1${NC}"; exit 1; }

echo ""
echo -e "${BOLD}  sales-iq — Setup${NC}"
echo -e "  AI-powered sales & marketing toolkit for Claude Code"
echo ""

# --- 1. Detect OS ---
OS="$(uname -s)"
case "$OS" in
  Darwin) OPEN_CMD="open" ;;
  Linux)  OPEN_CMD="xdg-open" ;;
  *)      fail "Unsupported OS: $OS. This script supports macOS and Linux." ;;
esac
ok "Detected: $OS"

# --- 2. Check Node.js ---
NODE_OK=false
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    ok "Node.js v$NODE_VERSION"
    NODE_OK=true
  else
    warn "Node.js v$NODE_VERSION found — need v20+"
  fi
fi

if [ "$NODE_OK" = false ]; then
  info "Installing Node.js via nvm..."

  # Install nvm if missing
  if [ ! -s "$HOME/.nvm/nvm.sh" ]; then
    info "Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  fi

  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  nvm install 20
  nvm use 20
  ok "Node.js $(node -v) installed via nvm"
fi

# --- 3. GitHub PAT ---
NPMRC="$HOME/.npmrc"

if grep -q "@bienhoang:registry=" "$NPMRC" 2>/dev/null; then
  ok "GitHub Packages already configured in ~/.npmrc"
else
  echo ""
  info "You need a GitHub token to download sales-iq."
  info "A browser window will open. Create a token with these settings:"
  echo ""
  echo -e "  ${BOLD}1.${NC} Name: ${CYAN}sales-iq${NC} (or anything you like)"
  echo -e "  ${BOLD}2.${NC} Expiration: ${CYAN}90 days${NC} (or longer)"
  echo -e "  ${BOLD}3.${NC} Scope: check ${CYAN}read:packages${NC} only"
  echo -e "  ${BOLD}4.${NC} Click ${CYAN}Generate token${NC} and copy it"
  echo ""
  read -rp "  Press Enter to open GitHub in your browser..."

  $OPEN_CMD "https://github.com/settings/tokens/new?scopes=read:packages&description=sales-iq" 2>/dev/null || \
    warn "Could not open browser. Go to: https://github.com/settings/tokens/new"

  echo ""
  read -rsp "  Paste your GitHub token here (hidden): " GH_TOKEN
  echo ""

  if [ -z "$GH_TOKEN" ]; then
    fail "No token provided. Run this script again when ready."
  fi

  # Append to ~/.npmrc (preserve existing content)
  {
    echo ""
    echo "# sales-iq (GitHub Packages)"
    echo "@bienhoang:registry=https://npm.pkg.github.com"
    echo "//npm.pkg.github.com/:_authToken=$GH_TOKEN"
  } >> "$NPMRC"
  chmod 600 "$NPMRC"

  ok "Token saved to ~/.npmrc"
fi

# --- 4. Validate token ---
info "Verifying token..."
if ! npm view @bienhoang/sales-iq --registry https://npm.pkg.github.com &>/dev/null; then
  fail "Token validation failed. Check your PAT has read:packages scope."
fi
ok "Token verified"

# --- 5. Run interactive wizard ---
echo ""
info "Starting sales-iq setup wizard..."
echo ""

npx @bienhoang/sales-iq@latest setup

echo ""
ok "All done! Open Claude Code and try: /siq-brand-strategy"
echo ""
