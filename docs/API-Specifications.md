# API Specifications

## Overview

HomeWise AI uses Tauri's IPC system for communication between the frontend and backend. All APIs are designed to be asynchronous and handle local processing only.

## Core APIs

### Model Management

#### Hardware Detection

```typescript
interface HardwareInfo {
    cpu: {
        cores: number;
        features: string[];
        architecture: string;
    };
    gpu: {
        available: boolean;
        type: 'cuda' | 'metal' | 'none';
        memory: number;
    };
    memory: {
        total: number;
        available: number;
    };
    storage: {
        available: number;
    };
}

// Get system hardware capabilities
#[tauri::command]
async fn get_hardware_info() -> Result<HardwareInfo>;
```

#### Model Operations

```typescript
interface ModelInfo {
    id: string;
    name: string;
    size: number;
    format: 'gguf' | 'onnx' | 'pytorch';
    requirements: {
        minMemory: number;
        preferredMemory: number;
        gpuRequired: boolean;
    };
}

// List available models
#[tauri::command]
async fn list_available_models() -> Result<ModelInfo[]>;

// Download model
#[tauri::command]
async fn download_model(modelId: string) -> Result<void>;

// Get download progress
#[tauri::command]
async fn get_download_progress(modelId: string) -> Result<number>;
```

### Document Processing

#### File Operations

```typescript
interface DocumentInfo {
    id: string;
    path: string;
    type: string;
    size: number;
    metadata: Record<string, unknown>;
}

// Process document
#[tauri::command]
async fn process_document(path: string) -> Result<DocumentInfo>;

// Search documents
#[tauri::command]
async fn search_documents(query: string) -> Result<DocumentInfo[]>;
```

#### Content Extraction

```typescript
interface ExtractedContent {
    text: string;
    metadata: Record<string, unknown>;
    chunks: string[];
}

// Extract content from document
#[tauri::command]
async fn extract_content(documentId: string) -> Result<ExtractedContent>;
```

### AI Interaction

#### Chat Interface

```typescript
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatContext {
    messages: Message[];
    documents: string[];
    settings: Record<string, unknown>;
}

// Send message
#[tauri::command]
async fn send_message(
    content: string,
    context: ChatContext
) -> Result<Message>;

// Get chat history
#[tauri::command]
async fn get_chat_history() -> Result<Message[]>;
```

#### Model Inference

```typescript
interface InferenceParams {
    temperature: number;
    maxTokens: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
}

// Generate text
#[tauri::command]
async fn generate_text(
    prompt: string,
    params: InferenceParams
) -> Result<string>;
```

### System Management

#### Resource Monitoring

```typescript
interface SystemMetrics {
    cpu: number;
    memory: number;
    gpu: number;
    storage: number;
}

// Get system metrics
#[tauri::command]
async fn get_system_metrics() -> Result<SystemMetrics>;
```

#### Settings Management

```typescript
// Get application settings
#[tauri::command]
async fn get_settings() -> Result<Record<string, unknown>>;

// Update settings
#[tauri::command]
async fn update_settings(
    settings: Record<string, unknown>
) -> Result<void>;
```

## Error Handling

### Error Types

```typescript
interface APIError {
  code: string
  message: string
  details?: unknown
}

enum ErrorCode {
  ModelNotFound = 'MODEL_NOT_FOUND',
  InsufficientResources = 'INSUFFICIENT_RESOURCES',
  ProcessingError = 'PROCESSING_ERROR',
  FileNotFound = 'FILE_NOT_FOUND',
  InvalidFormat = 'INVALID_FORMAT',
  SystemError = 'SYSTEM_ERROR',
}
```

### Error Responses

```typescript
// All API calls return Result<T> which can be:
type Result<T> = {
  data?: T
  error?: APIError
}
```

## Events

### System Events

```typescript
interface SystemEvent {
  type: 'resource' | 'model' | 'document'
  data: unknown
}

// Listen for system events
window.listen<SystemEvent>('system-event', event => {
  // Handle event
})
```

### Progress Events

```typescript
interface ProgressEvent {
  type: 'download' | 'processing'
  id: string
  progress: number
  status: string
}

// Listen for progress updates
window.listen<ProgressEvent>('progress', event => {
  // Handle progress
})
```

## Security

### Data Protection

- All APIs operate on local data only
- No external network calls
- Input validation
- Path sanitization

### Resource Management

- Memory limits
- Processing timeouts
- Rate limiting
- Error recovery

## Testing

### Unit Tests

```typescript
describe('API Tests', () => {
  it('should handle model operations', async () => {
    const result = await invoke('list_available_models')
    expect(result.error).toBeUndefined()
    expect(Array.isArray(result.data)).toBe(true)
  })
})
```
