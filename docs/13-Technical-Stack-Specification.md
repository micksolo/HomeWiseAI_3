# HomeWise AI — Technical Stack Specification

## 1. Frontend Stack

### Core Framework
- **React 18.2+**
  - Modern concurrent features
  - Better performance
  - Improved suspense support

### UI Components
- **MUI (Material-UI) v5**
  - Comprehensive component library
  - Built-in accessibility
  - Customizable theming
  - TypeScript support

### Supporting Libraries
- **react-query**: Data fetching and caching
- **react-window**: Virtualized lists
- **react-dropzone**: File upload handling
- **recharts**: Performance visualization

### Development
- **TypeScript 5.0+**
  - Strict mode enabled
  - Full type safety
  - ESLint + typescript-eslint
  - Prettier formatting

## 2. Desktop Framework

### Tauri
- Chosen over Electron for:
  - Smaller bundle size
  - Better performance
  - Rust-based security
  - Native OS integration
  - Resource efficiency

## 3. Backend Stack

### Core Engine (Rust)
- **Rust 1.70+**
  - Memory safety
  - High performance
  - Cross-platform support
  - Native Tauri integration

### Model Integration
- **llama.cpp** with Rust bindings
  - Quantization support
  - CPU/GPU compatibility
  - Support for all target models
  - Active community maintenance

### Vector Database
- **FAISS** with Rust bindings
  - Local embedding search
  - Memory efficient
  - CPU/GPU support
  - Proven scalability

### Document Processing
- **rust-pdf**: PDF handling
- **calamine**: Excel processing
- **lopdf**: PDF manipulation
- **zip-rs**: Office formats

## 4. Storage Solutions

### Local Database
- **SQLite** with **rusqlite**
  - Zero configuration
  - Single file database
  - Proven reliability
  - Native encryption support

### File System
- Native OS APIs via Tauri
- AES-256 encryption layer

## 5. Dependency Versions

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@tanstack/react-query": "^4.29.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "@vitejs/plugin-react-swc": "^3.3.0",
    "@tauri-apps/api": "^1.4.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

### Backend Dependencies
```toml
[dependencies]
tauri = "1.4"
tokio = { version = "1.32", features = ["full"] }
llm = "0.1.1"
faiss = "0.11"
rusqlite = { version = "0.29", features = ["bundled"] }
serde = { version = "1.0", features = ["derive"] }
aes-gcm = "0.10"
```

## 6. Development Environment

### Required Tools
- Node.js 18+ LTS
- Rust 1.70+
- VS Code with extensions:
  - rust-analyzer
  - TypeScript and JavaScript
  - ESLint
  - Prettier
  - Tauri

### Project Structure
```
homewise-ai/
├── src-tauri/          # Rust backend
│   ├── src/
│   └── Cargo.toml
├── src/                # React frontend
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Development Commands
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "tauri": "tauri",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write src"
  }
}
```

### Environment Configuration
```typescript
// config.ts
export const config = {
  development: {
    modelPath: './models',
    maxRAM: '4GB',
    debugLogging: true
  },
  production: {
    modelPath: '%APPDATA%/HomeWise/models',
    maxRAM: 'auto',
    debugLogging: false
  }
}
```

## 7. Development Workflow

### Git Workflow
- Conventional commits
- Pre-commit hooks for linting/formatting
- GitHub Actions for CI/CD
- Branch protection rules

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Automated testing with vitest

### Documentation
- Inline documentation
- API documentation
- Component documentation
- Architecture documentation updates 