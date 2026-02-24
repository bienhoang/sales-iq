# Phase 4: setup.sh Shell Script

## Context Links
- [Brainstorm — Path A](../reports/brainstorm-260224-1042-ux-improvements-nontech-users.md) -- zero-to-hero flow
- [NPM Packages Research — Shell Patterns](research/researcher-02-npm-packages.md) -- nvm detection, curl|bash

## Overview
- **Priority:** P1
- **Status:** complete
- **Effort:** 1h
- **Description:** Curl-pipe-bash installer script that takes a non-tech user from zero to running the interactive wizard. Handles Node.js, GitHub PAT, npmrc, then delegates to `npx @bienhoang/sales-iq setup`.

## Key Insights
- Target user has never opened a terminal before -- every message must be plain English
- Script must be idempotent (safe to run multiple times)
- Detect existing Node.js first before installing nvm (avoid conflicts)
- GitHub PAT creation is manual (no API for it) -- open browser + explain what to click
- `open` command (macOS) opens browser; `xdg-open` (Linux) -- handle both
- Script hosted at raw.githubusercontent.com for `curl | bash` pattern

## Requirements

### Functional
- Detect macOS or Linux (exit with message on unsupported OS)
- Check if Node.js 20+ installed; if not, install via nvm
- Open browser to GitHub PAT creation page
- Prompt user to paste token
- Write ~/.npmrc with @bienhoang registry + token
- Run `npx @bienhoang/sales-iq setup`

### Non-Functional
- Single file, no dependencies beyond bash/curl
- Idempotent: skip steps already completed
- Plain-English messages (no jargon)
- Exit cleanly on any error with helpful message

## Architecture

```
setup.sh  -- repo root, committed to main branch
```

**Flow:**
```
detect OS → check Node.js → install nvm if needed → source nvm →
install Node 20 → open browser → prompt for PAT → write npmrc →
npx @bienhoang/sales-iq setup
```

## Related Code Files

### New Files
- `setup.sh` (repo root, ~120 lines)

### Unchanged
- Phase 1 setup command (called via npx at end of script)

## Implementation Steps

### Step 1: Create setup.sh

File: `setup.sh` (repo root)

```bash
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

  ok "Token saved to ~/.npmrc"
fi

# --- 4. Run interactive wizard ---
echo ""
info "Starting sales-iq setup wizard..."
echo ""

npx @bienhoang/sales-iq@latest setup

echo ""
ok "All done! Open Claude Code and try: /siq-brand-strategy"
echo ""
```

### Step 2: Make executable and test

```bash
chmod +x setup.sh
# Test locally:
bash setup.sh
```

### Step 3: Verify curl pattern works

After pushing to main:
```bash
curl -fsSL https://raw.githubusercontent.com/bienhoang/sales-iq/main/setup.sh | bash
```

## Todo List

- [ ] Create `setup.sh` at repo root
- [ ] `chmod +x setup.sh`
- [ ] Test on macOS: full flow (Node exists)
- [ ] Test on macOS: nvm install path (rename node temporarily)
- [ ] Test idempotency: run twice (should skip completed steps)
- [ ] Test Ctrl+C at token prompt (clean exit)
- [ ] Test empty token input (fail with message)
- [ ] Verify curl|bash works after push to main

## Success Criteria
- Single command from zero to working install
- Idempotent: re-running skips completed steps
- Plain English messages at every step
- Browser opens to pre-filled GitHub PAT page
- Token input is hidden (read -s)
- Delegates to `npx @bienhoang/sales-iq setup` for the interactive wizard
- Clean error messages on failure

## Risk Assessment
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| curl pipe bash security concerns | Low | Open-source repo, documented URL, user can inspect first |
| nvm install fails (corporate proxy) | Medium | Script exits with clear error; user can install Node manually |
| xdg-open not available on headless Linux | Low | Fallback: print URL if open fails |
| GitHub PAT page changes layout | Low | Instructions generic enough to survive minor UI changes |
| Token pasted with whitespace | Low | Could add trim; v1 accepts as-is since npmrc tolerates it |

## Security Considerations
- Token input hidden with `read -s` (not echoed to terminal)
- Token written to ~/.npmrc (standard npm auth location)
- Script never sends token anywhere except writing to local file
- `set -euo pipefail` ensures script stops on any error
- No sudo required -- everything runs in user space

## Next Steps
- Phase 5: README leads with `curl -fsSL ... | bash` one-liner
- Consider: Windows support via PowerShell script (future, not YAGNI now)
