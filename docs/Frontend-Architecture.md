# Frontend Architecture

## Overview

The frontend of HomeWise AI is built with React 18.2+, TypeScript 5.0+, and Material-UI v5, integrated with Tauri for native desktop capabilities.

## Project Structure

```
src/
├── components/           # React components
│   ├── chat/            # Chat interface components
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   └── InputArea.tsx
│   ├── documents/       # Document handling components
│   │   ├── Viewer.tsx
│   │   ├── FileList.tsx
│   │   └── Search.tsx
│   ├── models/          # Model management components
│   │   ├── ModelList.tsx
│   │   ├── Hardware.tsx
│   │   └── Progress.tsx
│   └── common/          # Shared components
│       ├── Layout.tsx
│       ├── Navigation.tsx
│       └── ErrorBoundary.tsx
├── hooks/               # Custom React hooks
│   ├── useChat.ts
│   ├── useDocuments.ts
│   ├── useModels.ts
│   └── useSystem.ts
├── store/               # State management
│   ├── chat/
│   ├── documents/
│   ├── models/
│   └── system/
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── App.tsx             # Root component
```

## Core Components

### Chat Interface

```typescript
interface ChatProps {
  modelId: string
  context?: ChatContext
  onMessage: (message: Message) => void
}

const Chat: React.FC<ChatProps> = ({ modelId, context, onMessage }) => {
  const { messages, sendMessage } = useChat(modelId)
  // Component implementation
}
```

### Document Viewer

```typescript
interface ViewerProps {
  document: DocumentInfo
  onSelect: (selection: Selection) => void
}

const DocumentViewer: React.FC<ViewerProps> = ({ document, onSelect }) => {
  const { content, loading } = useDocument(document.id)
  // Component implementation
}
```

### Model Management

```typescript
interface ModelManagerProps {
  onModelSelect: (model: ModelInfo) => void
}

const ModelManager: React.FC<ModelManagerProps> = ({ onModelSelect }) => {
  const { models, hardware } = useModels()
  // Component implementation
}
```

## State Management

### Store Structure

```typescript
interface RootState {
  chat: ChatState
  documents: DocumentState
  models: ModelState
  system: SystemState
}

interface ChatState {
  conversations: Conversation[]
  activeConversation: string | null
  messages: Record<string, Message[]>
}

interface DocumentState {
  documents: DocumentInfo[]
  activeDocument: string | null
  searchResults: SearchResult[]
}

interface ModelState {
  models: ModelInfo[]
  activeModel: string | null
  downloads: Record<string, number>
}

interface SystemState {
  hardware: HardwareInfo
  settings: Settings
  errors: Error[]
}
```

## Hooks

### Chat Hook

```typescript
function useChat(modelId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async (content: string) => {
    // Implementation
  }

  return { messages, sendMessage }
}
```

### Document Hook

```typescript
function useDocument(documentId: string) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Implementation
  }, [documentId])

  return { content, loading }
}
```

### Model Hook

```typescript
function useModel(modelId: string) {
  const [model, setModel] = useState<ModelInfo | null>(null)
  const [status, setStatus] = useState<ModelStatus>('idle')

  // Implementation

  return { model, status }
}
```

## UI Components

### Layout System

```typescript
const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};
```

### Theme Configuration

```typescript
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
})
```

## Error Handling

### Error Boundary

```typescript
class ErrorBoundary extends React.Component<PropsWithChildren, { hasError: boolean }> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error
  }
}
```

### Error Display

```typescript
const ErrorDisplay: React.FC<{ error: Error }> = ({ error }) => {
    return (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error.message}
        </Alert>
    );
};
```

## Performance Optimization

### Code Splitting

```typescript
const Chat = lazy(() => import('./components/chat/Chat'))
const DocumentViewer = lazy(() => import('./components/documents/Viewer'))
const ModelManager = lazy(() => import('./components/models/ModelManager'))
```

### Memoization

```typescript
const MemoizedComponent = memo(({ data }) => {
    return <div>{/* Expensive render */}</div>;
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
});
```

## Testing

### Component Tests

```typescript
describe('Chat Component', () => {
    it('should render messages', () => {
        render(<Chat modelId="test-model" />);
        // Test implementation
    });
});
```

### Hook Tests

```typescript
describe('useChat Hook', () => {
  it('should manage chat state', () => {
    const { result } = renderHook(() => useChat('test-model'))
    // Test implementation
  })
})
```
