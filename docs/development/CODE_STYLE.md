# Code Style Guide

## Overview

This document outlines the coding standards and style guidelines for the HomeWise AI project. Following these guidelines ensures consistency, maintainability, and readability across the codebase.

## General Guidelines

### File Organization

- One component/module per file
- Clear, descriptive filenames
- Group related files in directories
- Keep files focused and manageable in size

```typescript
// Good
src / components / devices / DeviceCard.tsx
DeviceList.tsx
DeviceForm.tsx
common / Button.tsx
Input.tsx
hooks / useDevices.ts
useAuth.ts
```

### Naming Conventions

#### TypeScript/JavaScript

```typescript
// Variables and functions: camelCase
const deviceStatus = 'active'
function updateDeviceState() {}

// Components and classes: PascalCase
class DeviceManager {}
function DeviceCard() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3
const API_BASE_URL = 'http://localhost:3000'

// Interfaces and types: PascalCase with I prefix for interfaces
interface IDeviceProps {}
type DeviceState = 'on' | 'off'

// Files: kebab-case for files, PascalCase for components
// device-utils.ts
// DeviceCard.tsx
```

#### Rust

```rust
// Structs and enums: PascalCase
struct DeviceManager {}
enum DeviceState {}

// Functions and variables: snake_case
fn update_device_state() {}
let device_status = "active";

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS: u32 = 3;

// Modules: snake_case
mod device_manager;
mod utils;
```

### Code Formatting

#### TypeScript/JavaScript

```typescript
// Use 2 spaces for indentation
function example() {
  if (condition) {
    doSomething()
  }
}

// Maximum line length: 80 characters
const longString = 'This is a very long string that needs to be broken into multiple lines'

// Use semicolons
const value = 42
function getValue() {
  return value
}

// Use trailing commas in multiline objects/arrays
const config = {
  name: 'Device',
  type: 'sensor',
  enabled: true,
}
```

#### Rust

```rust
// Use 4 spaces for indentation
fn example() {
    if condition {
        do_something();
    }
}

// Maximum line length: 100 characters
let long_string =
    "This is a very long string that needs to be broken into multiple lines";

// Use trailing commas in multiline structs/enums
struct Config {
    name: String,
    device_type: String,
    enabled: bool,
}
```

## React Components

### Functional Components

```typescript
// Use TypeScript interfaces for props
interface DeviceCardProps {
  device: Device;
  onUpdate: (id: string) => void;
}

// Use function declaration for components
function DeviceCard({ device, onUpdate }: DeviceCardProps) {
  return (
    <div className="device-card">
      <h3>{device.name}</h3>
      <button onClick={() => onUpdate(device.id)}>
        Update
      </button>
    </div>
  );
}

// Export at the bottom of the file
export default DeviceCard;
```

### Hooks

```typescript
// Custom hooks start with 'use'
function useDeviceState(deviceId: string) {
  const [state, setState] = useState<DeviceState>()

  useEffect(() => {
    // Effect logic
  }, [deviceId])

  return state
}

// Keep hooks at the top of the component
function DeviceManager() {
  const [devices] = useState<Device[]>([])
  const theme = useTheme()
  const location = useLocation()

  // Rest of component logic
}
```

### Styling

```typescript
// Use styled-components with TypeScript
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'small' | 'medium' | 'large'
}

const Button = styled.button<ButtonProps>`
  background: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.secondary};
  padding: ${({ size }) => {
    switch (size) {
      case 'small':
        return '4px 8px'
      case 'medium':
        return '8px 16px'
      case 'large':
        return '12px 24px'
    }
  }};
`
```

## Rust Backend

### Error Handling

```rust
// Use custom error types
#[derive(Error, Debug)]
pub enum DeviceError {
    #[error("Device not found: {0}")]
    NotFound(String),

    #[error("Failed to connect: {0}")]
    ConnectionError(String),

    #[error("Invalid state: {0}")]
    InvalidState(String),
}

// Use Result type for fallible operations
pub async fn update_device(
    id: &str,
    state: DeviceState,
) -> Result<Device, DeviceError> {
    let device = find_device(id)
        .await
        .ok_or_else(|| DeviceError::NotFound(id.to_string()))?;

    device.update_state(state)
        .await
        .map_err(|e| DeviceError::ConnectionError(e.to_string()))?;

    Ok(device)
}
```

### Async Code

```rust
// Use async/await consistently
pub async fn process_device_update(
    device: Device,
    state: DeviceState,
) -> Result<()> {
    // Prefer let-else for early returns
    let Some(controller) = get_controller().await else {
        return Err(Error::NoController);
    };

    // Use .await on separate lines for complex operations
    let current_state = device
        .get_state()
        .await?;

    // Group related operations
    let result = tokio::try_join!(
        update_device_state(device, state),
        notify_subscribers(device.id),
        log_state_change(device.id, current_state, state),
    )?;

    Ok(())
}
```

### Documentation

````rust
/// Manages device state and operations
///
/// # Arguments
///
/// * `config` - Device configuration
/// * `state` - Initial device state
///
/// # Examples
///
/// ```
/// let manager = DeviceManager::new(config, state);
/// manager.start().await?;
/// ```
pub struct DeviceManager {
    config: DeviceConfig,
    state: DeviceState,
}

impl DeviceManager {
    /// Creates a new device manager
    ///
    /// # Errors
    ///
    /// Returns an error if the configuration is invalid
    pub fn new(
        config: DeviceConfig,
        state: DeviceState,
    ) -> Result<Self> {
        // Implementation
    }
}
````

## Testing

### Unit Tests

```typescript
// React component tests
describe('DeviceCard', () => {
  it('renders device information', () => {
    const device = {
      id: '1',
      name: 'Test Device',
    };

    render(<DeviceCard device={device} />);
    expect(screen.getByText('Test Device')).toBeInTheDocument();
  });

  it('handles updates', () => {
    const onUpdate = vi.fn();
    const device = { id: '1', name: 'Test' };

    render(<DeviceCard device={device} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onUpdate).toHaveBeenCalledWith('1');
  });
});
```

### Integration Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_device_workflow() {
        // Setup
        let manager = DeviceManager::new(test_config()).await?;
        let device = manager.add_device(test_device()).await?;

        // Test state updates
        manager.update_device_state(device.id, "on").await?;
        let updated = manager.get_device(device.id).await?;
        assert_eq!(updated.state, "on");

        // Cleanup
        manager.remove_device(device.id).await?;
    }
}
```

## Git Commit Messages

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

### Examples

```
feat(devices): add support for Matter protocol

- Implement Matter device discovery
- Add Matter device controller
- Update device management UI

Closes #123
```

## Code Review Guidelines

### Checklist

1. Code follows style guide
2. Tests are included and passing
3. Documentation is updated
4. No unnecessary dependencies
5. Error handling is appropriate
6. Performance considerations addressed
7. Security best practices followed

### Review Comments

```typescript
// Good comment
// Consider using optional chaining here to handle undefined values
device?.state?.value

// Bad comment
// This is wrong
device.state.value
```

## IDE Configuration

### VSCode Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Rust Analyzer Settings

```json
{
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.inlayHints.enable": true,
  "rust-analyzer.cargo.allFeatures": true
}
```
