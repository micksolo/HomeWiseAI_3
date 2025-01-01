# API Specifications

## Overview

The HomeWise AI application uses Tauri's IPC mechanism for communication between the frontend (React) and backend (Rust). This document outlines the available IPC commands, their payloads, and expected responses.

## IPC Command Structure

All IPC commands follow this general structure:

```typescript
interface IpcCommand<T = any> {
  command: string
  payload: T
  response?: any
}
```

## Chat Commands

### Send Message

**Command:** `send_message`

**Request:**

```typescript
interface SendMessageRequest {
  modelId: string
  message: string
  context?: ChatContext
}
```

**Response:**

```typescript
interface MessageResponse {
  id: string
  content: string
  timestamp: number
  isUser: boolean
}
```

### Get Conversation

**Command:** `get_conversation`

**Request:**

```typescript
interface GetConversationRequest {
  conversationId: string
}
```

**Response:**

```typescript
interface ConversationResponse {
  id: string
  messages: MessageResponse[]
  createdAt: number
  updatedAt: number
}
```

## Document Commands

### Upload Document

**Command:** `upload_document`

**Request:**

```typescript
interface UploadDocumentRequest {
  filePath: string
  metadata?: DocumentMetadata
}
```

**Response:**

```typescript
interface DocumentResponse {
  id: string
  title: string
  size: number
  pages: number
  processed: boolean
}
```

### Search Documents

**Command:** `search_documents`

**Request:**

```typescript
interface SearchDocumentsRequest {
  query: string
  filters?: SearchFilters
}
```

**Response:**

```typescript
interface SearchResponse {
  results: SearchResult[]
  total: number
}
```

## Model Commands

### List Models

**Command:** `list_models`

**Request:** None

**Response:**

```typescript
interface ModelListResponse {
  models: ModelInfo[]
}
```

### Download Model

**Command:** `download_model`

**Request:**

```typescript
interface DownloadModelRequest {
  modelId: string
}
```

**Response:**

```typescript
interface DownloadProgress {
  modelId: string
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
}
```

## System Commands

### Get Hardware Info

**Command:** `get_hardware_info`

**Request:** None

**Response:**

```typescript
interface HardwareInfoResponse {
  cpu: {
    brand: string
    cores: number
    threads: number
    frequency: number
    usage: number
  }
  memory: {
    total: number
    used: number
    free: number
    usagePercentage: number
  }
  system: {
    os: string
    platform: string
    version: string
  }
}
```

### Start Hardware Monitoring

**Command:** `start_hardware_monitoring`

**Request:**

```typescript
interface MonitoringConfig {
  pollingInterval?: number // in milliseconds, default: 5000
  enableAlerts?: boolean // default: true
}
```

**Response:**

```typescript
interface MonitoringResponse {
  status: 'started' | 'already_running'
  monitorId: string
}
```

### Stop Hardware Monitoring

**Command:** `stop_hardware_monitoring`

**Request:**

```typescript
interface StopMonitoringRequest {
  monitorId: string
}
```

**Response:**

```typescript
interface StopMonitoringResponse {
  status: 'stopped' | 'not_running'
}
```

### Get System Info

**Command:** `get_system_info`

**Request:** None

**Response:**

```typescript
interface SystemInfoResponse {
  os: string
  cpu: string
  memory: number
  gpu?: string
}
```

### Get Settings

**Command:** `get_settings`

**Request:** None

**Response:**

```typescript
interface SettingsResponse {
  theme: 'light' | 'dark'
  language: string
  modelPreferences: ModelPreferences
}
```

## Error Handling

All commands may return errors with the following structure:

```typescript
interface IpcError {
  code: string
  message: string
  details?: any
}
```

Common error codes:

- `INVALID_INPUT`: Invalid request payload
- `NOT_FOUND`: Requested resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `INTERNAL_ERROR`: Server-side error

## Versioning

The API follows semantic versioning (v1.0.0). Breaking changes will increment the major version number.

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per minute per client
- 1000 requests per hour per client

## Authentication

All commands require authentication via session token:

```typescript
interface AuthenticatedRequest {
  sessionToken: string
}
```

## Testing

API commands can be tested using the Tauri CLI:

```bash
tauri invoke send_message --payload '{"modelId":"gpt-4","message":"Hello"}'
```

## Documentation Generation

API documentation is automatically generated using OpenAPI specifications and can be accessed at `/api-docs`.

## Performance Monitoring

API performance is monitored using Prometheus metrics:

- Request latency
- Error rates
- Throughput

## Security

The API implements the following security measures:

- Input validation
- Rate limiting
- Authentication
- Encryption in transit
- Logging and monitoring
