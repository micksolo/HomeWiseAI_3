# API Documentation

## Overview

HomeWise AI provides a comprehensive REST API for device control, automation, and system management.

## Authentication

### 1. JWT Authentication

```typescript
interface JWTConfig {
  secret: string
  expiresIn: string
  algorithm: string
}

async function authenticateRequest(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      error: 'No token provided',
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token',
    })
  }
}
```

### 2. API Keys

```typescript
interface APIKey {
  key: string
  name: string
  permissions: string[]
  createdAt: Date
  lastUsed: Date
}

class APIKeyManager {
  private keys: Map<string, APIKey>

  async validateKey(key: string): Promise<boolean> {
    const apiKey = this.keys.get(key)
    if (!apiKey) return false

    apiKey.lastUsed = new Date()
    return true
  }
}
```

## Endpoints

### 1. Device Control

```typescript
interface DeviceEndpoints {
  // Get all devices
  'GET /api/devices': {
    response: Device[]
  }

  // Get device by ID
  'GET /api/devices/:id': {
    params: { id: string }
    response: Device
  }

  // Update device state
  'PUT /api/devices/:id/state': {
    params: { id: string }
    body: DeviceState
    response: Device
  }

  // Delete device
  'DELETE /api/devices/:id': {
    params: { id: string }
    response: void
  }
}

router.put('/devices/:id/state', async (req, res) => {
  const { id } = req.params
  const state = req.body

  try {
    const device = await deviceService.updateState(id, state)
    res.json(device)
  } catch (error) {
    res.status(400).json({
      error: error.message,
    })
  }
})
```

### 2. Automation Rules

```typescript
interface AutomationEndpoints {
  // Create automation rule
  'POST /api/automations': {
    body: AutomationRule
    response: AutomationRule
  }

  // Get all automation rules
  'GET /api/automations': {
    response: AutomationRule[]
  }

  // Update automation rule
  'PUT /api/automations/:id': {
    params: { id: string }
    body: AutomationRule
    response: AutomationRule
  }
}

router.post('/automations', async (req, res) => {
  const rule = req.body

  try {
    const created = await automationService.createRule(rule)
    res.status(201).json(created)
  } catch (error) {
    res.status(400).json({
      error: error.message,
    })
  }
})
```

## Request Validation

### 1. Schema Validation

```typescript
const deviceSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['light', 'switch', 'sensor']),
  room: z.string().optional(),
  config: z.object({
    ip: z.string().ip(),
    port: z.number().min(1).max(65535),
  }),
})

function validateRequest(schema: z.Schema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      })
    }
  }
}
```

### 2. Rate Limiting

```typescript
interface RateLimitConfig {
  windowMs: number
  max: number
  message: string
}

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
})

app.use('/api/', rateLimiter)
```

## Error Handling

### 1. Global Error Handler

```typescript
interface APIError extends Error {
  status: number
  code: string
}

function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof APIError) {
    res.status(error.status).json({
      error: error.message,
      code: error.code,
    })
  } else {
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    })
  }

  // Log error
  logger.error({
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  })
}
```

### 2. Custom Errors

```typescript
class NotFoundError extends Error implements APIError {
  status = 404
  code = 'NOT_FOUND'

  constructor(resource: string) {
    super(`${resource} not found`)
  }
}

class ValidationError extends Error implements APIError {
  status = 400
  code = 'VALIDATION_ERROR'

  constructor(details: any) {
    super('Validation failed')
    this.details = details
  }
}
```

## Documentation

### 1. OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: HomeWise AI API
  version: 1.0.0
  description: API for home automation control
paths:
  /devices:
    get:
      summary: Get all devices
      responses:
        '200':
          description: List of devices
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Device'
    post:
      summary: Create new device
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DeviceInput'
      responses:
        '201':
          description: Device created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Device'
```

### 2. API Documentation Generator

```typescript
interface APIDoc {
  path: string
  method: string
  description: string
  parameters: Parameter[]
  responses: Response[]
}

class APIDocGenerator {
  private docs: APIDoc[] = []

  addEndpoint(doc: APIDoc) {
    this.docs.push(doc)
  }

  generateMarkdown(): string {
    return this.docs.map(doc => this.formatEndpoint(doc)).join('\n\n')
  }

  private formatEndpoint(doc: APIDoc): string {
    return `
### ${doc.method} ${doc.path}

${doc.description}

#### Parameters
${this.formatParameters(doc.parameters)}

#### Responses
${this.formatResponses(doc.responses)}
    `.trim()
  }
}
```

## Testing

### 1. Integration Tests

```typescript
describe('Device API', () => {
  it('should create a device', async () => {
    const device = {
      name: 'Test Device',
      type: 'light',
      config: {
        ip: '192.168.1.100',
        port: 8080,
      },
    }

    const response = await request(app)
      .post('/api/devices')
      .send(device)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject(device)
  })

  it('should handle validation errors', async () => {
    const device = {
      name: '', // Invalid: empty name
      type: 'invalid', // Invalid: unknown type
    }

    const response = await request(app)
      .post('/api/devices')
      .send(device)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Validation failed')
  })
})
```

### 2. Performance Tests

```typescript
describe('API Performance', () => {
  it('should handle concurrent requests', async () => {
    const requests = Array(100)
      .fill(null)
      .map(() => request(app).get('/api/devices').set('Authorization', `Bearer ${token}`))

    const start = Date.now()
    const responses = await Promise.all(requests)
    const duration = Date.now() - start

    expect(duration).toBeLessThan(5000) // 5 seconds
    responses.forEach(response => {
      expect(response.status).toBe(200)
    })
  })
})
```
