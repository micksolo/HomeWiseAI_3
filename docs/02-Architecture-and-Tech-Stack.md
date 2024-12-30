# HomeWise AI — Architecture and Tech Stack

## 1. High-Level Architecture

1. **Frontend (UI)**
   - Built with React 18.2+ and TypeScript 5.0+
   - MUI v5 component library for UI elements
   - Wrapped in Tauri for desktop integration
   - See `13-Technical-Stack-Specification.md` for detailed frontend stack

2. **Backend (Local Service)**
   - Rust 1.70+ for core backend services
   - Orchestrates operations (model inference, document indexing)
   - Offers local APIs via Tauri IPC
   - See `13-Technical-Stack-Specification.md` for complete backend stack

3. **Local LLM Engine**
   - llama.cpp with Rust bindings for model inference
   - Runs entirely offline
   - Must accommodate older hardware: smaller or quantized models are crucial
   - See `12-Technical-Specifications.md` for hardware requirements and performance targets

4. **Local Storage and Indexing**
   - SQLite with rusqlite for structured data
   - FAISS for vector database search
   - Native file system access via Tauri
   - AES-256 encryption for sensitive data

## 2. Model Selection & Licensing

### Open Source / Royalty-Free Models
- **GPT-NeoX, GPT-Neo/J** from EleutherAI  
- **Falcon** (by TII)  
- **MPT** (by MosaicML)  
- **LLaMA 2** (Meta) — commonly used, but ensure compliance with Meta's license

### Model Tiers
- Small Model (4GB RAM, 3B parameters)
- Medium Model (8GB RAM, 7B parameters)
- Large Model (16GB+ RAM, 13B parameters)
Detailed specifications in `12-Technical-Specifications.md`

### Dynamic Model Selection
- During installation or first run, detect hardware specs
- Propose small, medium, or large model to match the user's system
- Support CPU-only inference with optional GPU acceleration

## 3. File Format Support

1. **PDF, DOCX, TXT, CSV, Markdown** (baseline)
2. **Excel (XLS, XLSX)** for table-based data
3. **Apple iWork (Pages, Numbers, Keynote)** — requires a converter or library to extract text
4. **OpenDocument Formats (ODT, ODS)** for open-source office suite compatibility
5. **ePub** (potentially, if user needs ebook support)

File size limits and processing targets defined in `12-Technical-Specifications.md`

## 4. Frontend/Backend Integration

- Tauri IPC for frontend-backend communication
- TypeScript interfaces for type safety
- React Query for data fetching and caching
- See `13-Technical-Stack-Specification.md` for detailed integration patterns

## 5. Privacy & Security

- Strictly offline for inference and embedding generation
- AES-256 encryption at rest for user data
- Minimal logs, stored locally only if needed
- Detailed security implementation in `12-Technical-Specifications.md`

## 6. Development Environment

- VS Code with recommended extensions
- Node.js 18+ LTS and Rust 1.70+
- Automated testing with vitest
- Conventional commits and GitHub Actions
- Complete setup instructions in `13-Technical-Stack-Specification.md`
