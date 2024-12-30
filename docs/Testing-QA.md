# Testing & QA Guidelines

## Overview

HomeWise AI follows a comprehensive testing strategy that covers both frontend and backend components, with a focus on ensuring reliability, performance, and security. All tests are run using Vitest, providing a modern and fast testing experience.

## Test Commands

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage
```

## Testing Levels

### 1. Unit Testing

#### Frontend (React Components)

```typescript
// components/__tests__/App.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@components/App'

describe('App Component', () => {
  it('renders the main heading', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /homewise ai/i })
    expect(heading).toBeDefined()
    expect(heading.textContent?.toLowerCase()).toContain('homewise ai')
  })

  it('renders the privacy message', () => {
    render(<App />)
    const message = screen.getByText(/your local ai assistant that respects your privacy/i)
    expect(message).toBeDefined()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button')
    await user.click(button)

    // Add assertions for the interaction
  })
})
```

#### Backend (Rust Functions)

```rust
// src-tauri/src/commands.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_document() {
        let result = process_document("test.txt");
        assert!(result.is_ok());
    }

    #[test]
    fn test_error_handling() {
        let result = process_document("nonexistent.txt");
        assert!(matches!(result, Err(Error::FileNotFound)));
    }
}
```

### 2. Integration Testing

#### Frontend Integration

```typescript
// integration/__tests__/ModelManager.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { invoke } from '@tauri-apps/api/tauri'
import ModelManager from '@components/ModelManager'

// Mock Tauri invoke
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn()
}))

describe('ModelManager Integration', () => {
  it('loads available models', async () => {
    const mockModels = [
      { id: 'model1', name: 'Test Model' }
    ]

    vi.mocked(invoke).mockResolvedValue(mockModels)

    render(<ModelManager />)

    const modelElement = await screen.findByText('Test Model')
    expect(modelElement).toBeDefined()
  })
})
```

### 3. End-to-End Testing

```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test('basic app flow', async ({ page }) => {
  await page.goto('/')

  // Check main elements
  await expect(page.getByRole('heading')).toContainText('HomeWise AI')

  // Test interactions
  await page.getByRole('button').click()

  // Verify results
  await expect(page.getByTestId('result')).toBeVisible()
})
```

## Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src-tauri/',
        'src/test/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/*',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
})
```

### Test Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Tauri API
vi.mock('@tauri-apps/api', () => ({
  invoke: vi.fn(),
  event: {
    listen: vi.fn(),
    emit: vi.fn(),
  },
}))
```

## Quality Gates

### Coverage Requirements

- Minimum 80% coverage for all metrics:
  - Statements
  - Branches
  - Functions
  - Lines

### Pre-commit Hooks

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm run test:coverage

      - name: Check Coverage
        run: |
          if [ $(npm run test:coverage | grep -o "All files.*%" | grep -o "[0-9.]*") -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi
```

## Performance Testing

### Resource Monitoring

```typescript
interface PerformanceMetrics {
  loadTime: number
  memoryUsage: number
  modelLoadTime: number
  inferenceTime: number
  responseLatency: number
}

async function collectMetrics(): Promise<PerformanceMetrics> {
  // Implementation
}
```

### Alerting Thresholds

- Memory usage > 80%
- Response time > 2000ms
- Error rate > 1%
- Model load time > 5000ms

## Security Testing

### Input Validation

```typescript
describe('Security Validation', () => {
  it('sanitizes user input', async () => {
    const input = '<script>alert("xss")</script>'
    const result = await processUserInput(input)
    expect(result).not.toContain('<script>')
  })
})
```

### File Access Security

```rust
#[test]
fn test_file_access_security() {
    let result = process_document("../system/file.txt");
    assert!(matches!(result, Err(Error::AccessDenied)));
}
```
