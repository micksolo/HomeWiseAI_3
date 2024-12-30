# HomeWise AI — User Stories and Use Cases

## 1. Non-Technical User (Mary, 65)
- **Goal**: Read through medical PDFs at home without uploading anything online
- **Technical Implementation**:
  - Small model tier (4GB RAM, 4-bit quantized)
  - PDF processing with rust-pdf
  - Simple MUI interface with large, clear buttons
  - Automatic hardware detection for model selection
- **Pain Points & Solutions**:
  - Limited RAM → Optimized memory usage with Rust
  - Minimal technical knowledge → Intuitive MUI components
  - Privacy concerns → Local-only Tauri implementation

## 2. Small Business Owner (John, 45)
- **Goal**: Index invoices, Word contracts, and internal guides
- **Technical Implementation**:
  - Medium model tier (8GB RAM, 8-bit quantized)
  - FAISS for efficient document search
  - SQLite for metadata storage
  - Batch processing for large document sets
- **Pain Points & Solutions**:
  - No cloud data → Fully offline architecture
  - Quick results → Rust-powered search
  - Multiple file types → Unified document processing

## 3. Research Student (Cathy, 23)
- **Goal**: Reference PDFs, Apple Pages docs, ODT research articles
- **Technical Implementation**:
  - Large model tier (16GB+ RAM)
  - GPU acceleration where available
  - Advanced search features with React Query
  - Multi-format document support
- **Pain Points & Solutions**:
  - Complex queries → Advanced embedding search
  - Multiple document formats → Comprehensive format support
  - Performance needs → GPU-accelerated inference

## 4. Accountant (Sophia, 38)
- **Goal**: Handle sensitive financial statements
- **Technical Implementation**:
  - AES-256 encryption for stored data
  - Excel support via calamine
  - Structured data extraction
  - Automatic file watching
- **Pain Points & Solutions**:
  - Data security → Rust-based encryption
  - Excel handling → Native spreadsheet processing
  - System resources → Efficient Rust backend

## 5. Lawyer (Carlos, 50)
- **Goal**: Summarize legal contracts with total privacy
- **Technical Implementation**:
  - Medium model with optimization
  - Batch processing for large files
  - Progress tracking with MUI components
  - Secure document storage
- **Pain Points & Solutions**:
  - Large documents → Efficient chunking
  - Privacy requirements → Sandboxed operations
  - Performance needs → Optimized processing

## 6. Technical Implementation Details

### Frontend Components
```typescript
// Document viewer with type safety
interface DocumentViewerProps {
  path: string;
  type: SupportedFileType;
  onProcess: (result: ProcessingResult) => void;
}

// Chat interface with context
interface ChatContextProps {
  documents: IndexedDocument[];
  model: ModelTier;
  searchResults: SearchResult[];
}
```

### Backend Services
```rust
// Document processing service
pub struct DocumentProcessor {
    indexer: FAISSIndex,
    storage: SqliteConnection,
    model: LLMModel,
}

// Security layer
pub struct SecurityManager {
    encryption: AES256Cipher,
    permissions: FilePermissions,
}
```

### Data Flow
1. **Document Ingestion**
   - File upload via react-dropzone
   - Processing with Rust backend
   - Vector storage in FAISS
   - Metadata in SQLite

2. **Query Processing**
   - User input via MUI components
   - Context retrieval from FAISS
   - Model inference with llama.cpp
   - Response rendering with React

3. **Security Measures**
   - Tauri's security model
   - Local file system sandbox
   - Encryption at rest
   - Secure IPC communication

## 7. Performance Considerations

### Hardware Tiers
- **Low-End**: 4GB RAM, CPU only
  - Small model, basic features
  - Optimized memory usage
  
- **Mid-Range**: 8GB RAM, CPU/GPU
  - Medium model, full features
  - Balanced performance
  
- **High-End**: 16GB+ RAM, GPU
  - Large model, all features
  - Maximum performance

### Optimization Strategies
- Rust-based processing for efficiency
- React component optimization
- Lazy loading where appropriate
- Background processing for heavy tasks

## Additional Use Cases
- **General Knowledge**: “How do I bake sourdough bread?” (no doc context).  
- **Mixed Query**: “In ‘2023-Budget.xlsx’, what is the total marketing spend?”  
- **Privacy-Specific**: Zero tolerance for data leaving the device.

