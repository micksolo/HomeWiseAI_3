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

The frontend of HomeWise AI utilizes React's built-in `useState` and `useContext` hooks for managing application state. This approach is suitable for the current scale of the application and provides a straightforward way to handle state within components and share state across the component tree.

### Store Structure

The application state is structured as follows:

```typescript
interface RootState {
  // Represents the combined state of different features
  chat: ChatState
  documents: DocumentState
  models: ModelState
  system: SystemState
}

interface ChatState {
  conversations: Conversation[]
  activeConversation: string | null
  messages: Record<string, Message[]> // Maps conversation IDs to messages
}

interface DocumentState {
  documents: DocumentInfo[]
  activeDocument: string | null
  searchResults: SearchResult[]
}

interface ModelState {
  models: ModelInfo[]
  activeModel: string | null
  downloads: Record<string, number> // Tracks download progress of models
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

## Service Layer

The frontend communicates with the backend through Tauri's IPC mechanism. Services are organized by domain:

```
src/services/
├── chat.ts
├── documents.ts
├── models.ts
└── system.ts
```

### Example Service Implementation

```typescript
// src/services/chat.ts
import { invoke } from '@tauri-apps/api/tauri'

interface SendMessageParams {
  modelId: string
  message: string
  context?: ChatContext
}

export async function sendMessage(params: SendMessageParams): Promise<Message> {
  return await invoke<Message>('send_message', params)
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  return await invoke<Conversation>('get_conversation', { conversationId })
}
```

### Service Usage in Components

```typescript
function useChat(modelId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async (content: string) => {
    const response = await chatService.sendMessage({
      modelId,
      message: content,
    })
    setMessages(prev => [...prev, response])
  }

  return { messages, sendMessage }
}
```

## Routing

The application uses React Router for navigation:

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/chat', element: <Chat /> },
      { path: '/documents', element: <Documents /> },
      { path: '/models', element: <Models /> }
    ]
  }
])
```

## Internationalization

The application supports multiple languages using i18next:

```typescript
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // English translations
      },
    },
    // Other languages
  },
  lng: 'en',
  fallbackLng: 'en',
})
```

## Accessibility

The application follows WCAG 2.1 guidelines:

- Semantic HTML elements
- ARIA attributes where necessary
- Keyboard navigation support
- High contrast theme
- Screen reader support

## Performance Monitoring

The application integrates with Sentry for error tracking and performance monitoring:

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

## Analytics

The application uses PostHog for analytics:

```typescript
posthog.init(process.env.POSTHOG_API_KEY, {
  api_host: process.env.POSTHOG_HOST,
})
```

## Security

The frontend implements the following security measures:

- Content Security Policy (CSP)
- XSS protection
- CSRF tokens for API requests
- Secure cookie handling
- Input sanitization

## Development Tools

The project uses the following development tools:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Storybook for component development
- Jest and React Testing Library for testing
