# NPM Packages Research — CLI Wizard UX Improvements

**Date:** 2026-02-24
**Status:** Complete
**Scope:** Package compatibility, ESM support, integration patterns

---

## 1. Interactive Prompts — `prompts` (terkelg)

### Package Info
- **npm:** `prompts` (terkelg/prompts on GitHub)
- **Size:** Lightweight, minimal dependencies
- **ESM:** Full ESM support (native)
- **Status:** Actively maintained

### API Methods
```javascript
import prompts from 'prompts';

// Text input
await prompts({
  type: 'text',
  name: 'name',
  message: 'Your name?'
});

// Single select
await prompts({
  type: 'select',
  name: 'color',
  message: 'Pick a color',
  choices: [
    { title: 'Red', value: 'red' },
    { title: 'Blue', value: 'blue' }
  ]
});

// Multi-select
await prompts({
  type: 'multiselect',
  name: 'features',
  message: 'Select features',
  choices: [...]
});

// Confirm
await prompts({
  type: 'confirm',
  name: 'proceed',
  message: 'Continue?'
});
```

### Strengths
- **Beautiful UI** with keyboard navigation
- **Batch prompts:** Pass array to ask multiple questions at once
- **Validation & formatting:** Built-in validators
- **Lightweight:** Minimal deps compared to Inquirer.js

### Gotchas
- Newer alternative to legacy Inquirer.js; check project maturity first
- Less plugin ecosystem than Inquirer

---

## 2. Cross-Platform Browser Opening — `open` (sindresorhus)

### Package Info
- **npm:** `open` (sindresorhus/open on GitHub)
- **Size:** Small, zero external dependencies
- **ESM:** **Native ESM only** (no CommonJS export)
- **Status:** Well-maintained, widely used

### API Methods
```javascript
import open from 'open';

// Open URL in default browser
await open('https://example.com');

// Open with specific app (macOS)
await open('https://example.com', { app: 'firefox' });

// Open file/directory
await open('/path/to/file.txt');

// With app arguments
await open('https://example.com', {
  app: { name: 'chrome', arguments: ['--app'] }
});
```

### Platform-Specific Behavior
| OS      | Command    | Details                          |
|---------|-----------|----------------------------------|
| macOS   | `open`    | Native command                   |
| Windows | `start`   | Built-in command                 |
| Linux   | `xdg-open`| Included script (auto-downloaded) |

### Strengths
- **Zero deps:** Lightweight, no external dependencies
- **WSL support:** Handles Windows Subsystem for Linux paths
- **Promise-based:** Async/await friendly
- **Cross-platform:** Handles platform differences automatically

### Gotchas
- **ESM-only:** CommonJS not supported; project must use ES modules
- **Async only:** No synchronous API (good for CLI)

---

## 3. Terminal Spinners — `ora` (sindresorhus)

### Package Info
- **npm:** `ora` (sindresorhus/ora on GitHub)
- **Size:** Small, minimal deps
- **ESM:** Native ESM since v6.0.0 (Aug 2021)
- **Status:** Actively maintained

### API Methods
```javascript
import ora from 'ora';

const spinner = ora('Loading...').start();

// Update text mid-spin
spinner.text = 'Processing...';

// Success state
spinner.succeed('Done!');

// Failure state
spinner.fail('Error occurred');

// Info/warn states
spinner.info('Info message');
spinner.warn('Warning message');

// Stop without symbol
spinner.stop();
```

### Features
- **Multiple spinners:** Handles async writes to stdout automatically
- **Chainable:** Methods return the spinner object
- **Custom symbols:** Customize success/fail/info/warn indicators
- **Color support:** Terminal color customization

### Strengths
- **Single-threaded safe:** Handles stdio coordination for async tasks
- **Minimal:** No heavy dependencies
- **Promise-compatible:** Works with async/await code

### Gotchas
- **CommonJS fork available:** Use `ora-classic` if stuck on CommonJS
- **v6.0.0+ only ESM:** Upgrade required for modern projects

---

## 4. Commander.js Integration with Interactive Prompts

### Async Action Handlers
Commander supports async handlers via `.parseAsync()`:

```javascript
import { Command } from 'commander';
import prompts from 'prompts';

const program = new Command();

program
  .command('setup')
  .description('Interactive setup wizard')
  .action(async () => {
    const answers = await prompts([
      { type: 'text', name: 'projectName', message: 'Project name?' },
      { type: 'select', name: 'framework', message: 'Framework?', choices: [...] }
    ]);
    console.log('Setup complete:', answers);
  });

// Use parseAsync() instead of parse()
await program.parseAsync(process.argv);
```

### No-Flags Commands (Pure Prompts)
Commands can have **zero flags/options** and run purely interactive:

```javascript
program
  .command('wizard')
  .description('Interactive setup wizard')
  .action(async () => {
    const config = await prompts([...]);
    // Process config
  });

// User runs: `sales-iq wizard` (no flags needed)
```

### Integration Patterns

| Pattern | Use Case |
|---------|----------|
| **Fallback prompts** | Ask for missing options if not provided via flags |
| **Pure prompts** | Commands with zero flags, run full prompt wizard |
| **Hybrid** | Accept flags + prompt for missing values |

**Avoid:** `interactive-commander` package (higher-level abstraction; adds overhead for simple cases)

---

## 5. Shell Script Patterns — nvm Installation Detection

### Detection Script
```bash
#!/bin/bash

# Detect nvm installation
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
  echo "nvm found"
else
  echo "nvm not installed"
  # Offer installation
fi

# Detect Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "Node.js $NODE_VERSION found"
else
  echo "Node.js not found"
fi
```

### Cross-Platform Considerations

| Platform | Notes |
|----------|-------|
| **Linux/macOS** | Bash/zsh; source `~/.nvm/nvm.sh` in profile |
| **Windows** | Use nvm-windows (separate tool); PowerShell/cmd-based |
| **WSL2** | Linux environment; same as Linux path |

### curl | bash Pattern
```bash
# Standard nvm installation
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Safer approach (verify + execute)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Flags explained:
# -f : fail on HTTP errors
# -s : silent mode
# -S : show errors
# -L : follow redirects
```

### Shell Profile Updates
nvm installation auto-updates:
- `~/.bashrc` (Linux)
- `~/.zshrc` (macOS/Zsh)
- `~/.profile` (Fallback)

**Detection logic:**
```bash
if [ -z "${NVM_DIR}" ]; then
  export NVM_DIR="$HOME/.nvm"
fi
```

### Gotchas
- **Windows:** nvm-windows is NOT compatible with bash scripts; requires separate setup
- **Shell reload:** Changes take effect after shell restart or `source ~/.bashrc`
- **WSL2:** Can access nvm but requires careful path handling
- **Permission errors:** Install script may need `chmod +x` on some systems

---

## 6. Recommended Stack for sales-iq Wizard

| Component | Package | Reason |
|-----------|---------|--------|
| **Prompts** | `prompts` (terkelg) | Lightweight, beautiful, ESM-native, minimal deps |
| **Browser open** | `open` | Zero deps, ESM, cross-platform, async-only (CLI-friendly) |
| **Spinners** | `ora` | Minimal, ESM-native, excellent stdout handling |
| **CLI framework** | Commander.js | Async support, no-flag commands, async/await ready |

**Total new deps:** 3 (prompts, open, ora) — all ESM, all maintained, all <50KB unpacked

---

## 7. Unresolved Questions / Gotchas

1. **Windows nvm-windows compatibility:** Is the setup script Windows-compatible or CLI-Windows-only?
   - *Impact:* May need separate installation instructions for Windows users
   - *Mitigation:* Test on Windows; consider detecting nvm-windows vs. nvm

2. **Terminal width detection:** Do prompts + ora handle narrow terminal widths gracefully?
   - *Impact:* Mobile SSH or tiny terminal windows
   - *Mitigation:* Test with `tput cols` edge cases

3. **Headless environments:** How do prompts behave in CI/headless (no TTY)?
   - *Impact:* Could break in GitHub Actions, Docker
   - *Mitigation:* Add TTY detection + fallback to env vars or flags

---

## Sources

- [prompts - npm](https://www.npmjs.com/package/prompts)
- [GitHub - terkelg/prompts](https://github.com/terkelg/prompts)
- [open - npm](https://www.npmjs.com/package/open)
- [GitHub - sindresorhus/open](https://github.com/sindresorhus/open)
- [ora - npm](https://www.npmjs.com/package/ora)
- [GitHub - sindresorhus/ora](https://github.com/sindresorhus/ora)
- [interactive-commander - npm](https://www.npmjs.com/package/interactive-commander)
- [GitHub - nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- [Better Stack - Commander.js Guide](https://betterstack.com/community/guides/scaling-nodejs/commander-explained/)
