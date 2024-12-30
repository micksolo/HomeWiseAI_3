# Core Features

## Overview

The core features of HomeWise AI provide the fundamental functionality for local AI assistance while maintaining privacy and performance.

## Feature Areas

### 1. User Interface

- Modern Material-UI components
  ```tsx
  // Example component structure
  <ThemeProvider theme={theme}>
    <AppLayout>
      <Sidebar>
        <FileTree />
        <ModelSelector />
      </Sidebar>
      <MainContent>
        <ChatInterface />
        <FilePreview />
      </MainContent>
    </AppLayout>
  </ThemeProvider>
  ```
- Responsive design breakpoints
  ```typescript
  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  }
  ```
- Theme configuration
  ```typescript
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
    },
  })
  ```

### 2. File Management

- Local file indexing
  ```rust
  // File indexing structure
  struct FileIndex {
      path: PathBuf,
      metadata: FileMetadata,
      content_hash: String,
      last_modified: DateTime<Utc>,
  }
  ```
- File search implementation
  ```typescript
  interface FileSearch {
    query: string
    filters: {
      type?: string[]
      size?: [number, number]
      date?: [Date, Date]
    }
    sort?: 'name' | 'date' | 'size'
  }
  ```

### 3. Data Management

- Database Schema

  ```sql
  -- Core tables
  CREATE TABLE files (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    content_hash TEXT,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );

  CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    title TEXT,
    context JSONB,
    created_at TIMESTAMP
  );

  CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES conversations(id),
    content TEXT,
    role TEXT,
    timestamp TIMESTAMP
  );
  ```

### 4. AI Integration

- Context Management
  ```typescript
  interface ConversationContext {
    messages: Message[]
    files: AttachedFile[]
    settings: {
      temperature: number
      maxTokens: number
      model: string
    }
  }
  ```

## Implementation Status

See the following documents for detailed implementation status:

- [COMPONENTS.md](./COMPONENTS.md) - UI components
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Application state
- [../llm/INTEGRATION.md](../llm/INTEGRATION.md) - AI integration

## Architecture

### Frontend Structure

```
src/
├── components/          # UI components
│   ├── layout/         # Layout components
│   ├── chat/           # Chat interface
│   ├── files/          # File management
│   └── common/         # Shared components
├── hooks/              # React hooks
│   ├── useFiles.ts     # File operations
│   ├── useChat.ts      # Chat operations
│   └── useTheme.ts     # Theme management
├── services/           # Core services
│   ├── api.ts          # API client
│   ├── db.ts           # Database service
│   └── files.ts        # File service
└── utils/              # Utilities
    ├── format.ts       # Formatters
    └── validation.ts   # Validators
```

### Backend Structure

```
src-tauri/
├── src/
│   ├── commands/       # IPC commands
│   │   ├── files.rs    # File operations
│   │   ├── chat.rs     # Chat operations
│   │   └── system.rs   # System operations
│   ├── services/       # Core services
│   │   ├── db.rs       # Database service
│   │   ├── files.rs    # File service
│   │   └── llm.rs      # LLM service
│   └── db/            # Database
│       ├── schema.rs   # Schema definitions
│       └── models.rs   # Database models
└── Cargo.toml
```

## Development

### Prerequisites

- Node.js 18+
- Rust (latest stable)
- SQLite 3.39+
- Git

### Setup

1. Install dependencies
   ```bash
   npm install
   cargo build
   ```
2. Configure environment
   ```bash
   cp .env.example .env
   ```
3. Initialize database
   ```bash
   cargo run --bin init-db
   ```
4. Start development server
   ```bash
   npm run tauri:dev
   ```

## Testing

### Test Coverage

- Unit tests for components
  ```bash
  npm run test:components
  ```
- Integration tests for workflows
  ```bash
  npm run test:integration
  ```
- End-to-end tests for features
  ```bash
  npm run test:e2e
  ```

### Performance Testing

- Component rendering benchmarks
- Data operation profiling
- Memory usage monitoring
- Network usage tracking

## Documentation

### API Documentation

- Component props
- Hook interfaces
- Service methods
- Utility functions

### User Documentation

- Feature guides
- Configuration options
- Troubleshooting steps
- FAQs
