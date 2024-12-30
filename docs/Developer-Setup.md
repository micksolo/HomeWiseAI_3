# Developer Setup Guide

## Prerequisites

### Required Software

- Node.js 18+ and npm 9+
- Rust 1.70+ and Cargo
- Git 2.3+
- Visual Studio Code (recommended)

### Platform-Specific Requirements

#### macOS

- Xcode Command Line Tools
- Homebrew (recommended)
- Metal SDK (for GPU acceleration)

#### Windows

- Visual Studio Build Tools 2019+
- Windows 10/11 SDK
- CUDA Toolkit 11.8+ (for GPU acceleration)

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/HomeWiseAI.git
cd HomeWiseAI
```

### 2. Install Dependencies

#### Frontend Dependencies

```bash
# Install npm packages
npm install

# Install development tools
npm install -g typescript@5.0
npm install -g @tauri-apps/cli
```

#### Backend Dependencies

```bash
# Install Rust dependencies
rustup update
rustup target add aarch64-apple-darwin x86_64-apple-darwin # for macOS
rustup target add x86_64-pc-windows-msvc # for Windows

# Install additional tools
cargo install cargo-watch
cargo install cargo-edit
```

## Development Environment

### VS Code Setup

#### Required Extensions

```json
{
  "recommendations": [
    "rust-lang.rust-analyzer",
    "tauri-apps.tauri-vscode",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

#### Workspace Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "rust-analyzer.checkOnSave.command": "clippy",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Project Structure

```
HomeWiseAI/
├── src/                 # Frontend source
├── src-tauri/          # Rust backend
├── public/             # Static assets
├── docs/               # Documentation
└── scripts/            # Development scripts
```

## Development Workflow

### 1. Start Development Server

```bash
# Terminal 1: Start frontend dev server
npm run dev

# Terminal 2: Start Tauri development
npm run tauri dev
```

### 2. Running Tests

```bash
# Run frontend tests
npm test

# Run backend tests
cd src-tauri && cargo test
```

### 3. Building for Production

```bash
# Production build
npm run build
npm run tauri build
```

## AI Model Development

### Local Model Setup

```bash
# Create models directory
mkdir -p src-tauri/models

# Download development models
./scripts/download-dev-models.sh
```

### Model Configuration

```toml
# src-tauri/Config.toml
[models]
default = "HomeWise-7B"
formats = ["gguf", "onnx"]
max_memory = "8GB"
```

## Document Processing Setup

### Required Libraries

```bash
# macOS
brew install poppler tesseract

# Windows
choco install poppler tesseract
```

### Testing Documents

```bash
# Copy test documents
cp -r test/documents src-tauri/test-data/
```

## Debugging

### Frontend Debugging

1. Open Chrome DevTools in Tauri window (Cmd/Ctrl + Shift + I)
2. Use VS Code debugger with provided launch configurations

### Backend Debugging

1. Use `rust-analyzer` in VS Code
2. Add logging with `tracing` crate
3. Use VS Code's Debug Console

## Common Issues

### Build Issues

```bash
# Clean build artifacts
npm run clean
cd src-tauri && cargo clean

# Rebuild
npm run build
```

### Model Issues

```bash
# Reset model state
rm -rf src-tauri/models/*
./scripts/reset-models.sh
```

## Performance Profiling

### Frontend Profiling

```bash
# Enable React profiler
npm run dev -- --profile

# Run Lighthouse
npm run lighthouse
```

### Backend Profiling

```bash
# CPU profiling
cargo install flamegraph
cargo flamegraph

# Memory profiling
cargo install heaptrack
cargo heaptrack run
```

## Git Workflow

### Branch Naming

- feature/name-of-feature
- fix/issue-description
- docs/documentation-update

### Commit Messages

```
type(scope): description

- feat: new feature
- fix: bug fix
- docs: documentation
- refactor: code refactoring
- test: adding tests
- chore: maintenance
```

## Support

- Check [Troubleshooting.md](Troubleshooting.md) for common issues
- Submit issues on GitHub
- Join our Discord community
