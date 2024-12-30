# HomeWise AI Architecture

## Overview

HomeWise AI is a desktop application built with Tauri, combining a Rust backend with a React frontend.

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│              User Interface             │
│    (React + TypeScript + Material-UI)   │
├─────────────────────────────────────────┤
│           IPC Communication             │
│         (Tauri Commands/Events)         │
├─────────────────────────────────────────┤
│            Rust Backend                 │
├───────────────┬─────────────┬──────────┤
│  File System  │   SQLite    │   LLM    │
│  Operations   │  Database   │ Service  │
└───────────────┴─────────────┴──────────┘
```

## Frontend Architecture

### Technology Stack

- React 18.2+
- TypeScript 5.0+
- Material-UI v5
- Vite build system

### Directory Structure

```
src/
├── components/    # React components
├── hooks/         # Custom React hooks
├── services/      # Frontend services
├── utils/         # Utility functions
├── types/         # TypeScript types
└── styles/        # CSS/SCSS styles
```

### State Management

- React Context for global state
- Local component state where appropriate
- Custom hooks for shared logic

## Backend Architecture

### Technology Stack

- Rust (latest stable)
- SQLite for storage
- Tauri for desktop integration

### Core Services

1. File System Service

   - Local file operations
   - File indexing
   - File watching

2. Database Service

   - SQLite integration
   - Query optimization
   - Migration management

3. LLM Service
   - Model management
   - Inference optimization
   - Context handling

## Security Architecture

### Data Security

- AES-256 encryption for sensitive data
- Secure key storage
- Memory safety (Rust)

### Application Security

- Process isolation
- Sandboxed execution
- Secure IPC

## Performance Considerations

### Frontend

- Code splitting
- Lazy loading
- Memoization

### Backend

- Async operations
- Parallel processing
- Resource management

## Testing Strategy

### Frontend Testing

- Unit tests (Vitest)
- Component tests (React Testing Library)
- Integration tests

### Backend Testing

- Unit tests (Rust)
- Integration tests
- Property-based testing
