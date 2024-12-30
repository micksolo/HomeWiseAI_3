# Deployment Guide

## Build Process

### Prerequisites

- Node.js 18+ and npm 9+
- Rust 1.70+ and Cargo
- Platform-specific requirements:
  - macOS: Xcode Command Line Tools, Metal SDK
  - Windows: Visual Studio Build Tools, CUDA Toolkit

### Environment Setup

```bash
# Development environment
cp .env.example .env.development
cp .env.example .env.test

# Production environment
cp .env.example .env.production
```

### Testing Requirements

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Quality Gates

- Unit test coverage: >80%
- E2E test coverage: >60%
- No critical security vulnerabilities
- Performance benchmarks met
- Accessibility standards passed

### Development Build

```bash
# Install dependencies
npm install
cargo install tauri-cli

# Start development server
npm run tauri dev
```

### Production Build

```bash
# Build frontend assets
npm run build

# Build desktop application
npm run tauri build
```

## Platform-Specific Builds

### macOS Build

```bash
# Install macOS dependencies
xcode-select --install
rustup target add aarch64-apple-darwin x86_64-apple-darwin

# Build universal binary
npm run tauri build -- --target universal-apple-darwin

# Code signing
codesign --force --sign "Developer ID Application: Your Name" \
         --options runtime \
         "./target/release/bundle/macos/HomeWise AI.app"

# Notarization
xcrun notarytool submit "./target/release/bundle/macos/HomeWise AI.app" \
      --apple-id "your.email@example.com" \
      --password "@keychain:AC_PASSWORD" \
      --team-id "YOUR_TEAM_ID"
```

### Windows Build

```bash
# Install Windows dependencies
rustup target add x86_64-pc-windows-msvc

# Build installer
npm run tauri build -- --target x86_64-pc-windows-msvc

# Code signing
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 \
    /a "./target/release/bundle/msi/HomeWise AI.msi"
```

## Release Process

### 1. Version Update

```bash
# Update version numbers
npm version patch # or minor/major
cargo set-version 1.0.0

# Update changelog
echo "## [1.0.0] - $(date +%Y-%m-%d)" >> CHANGELOG.md
```

### 2. Pre-release Checks

```bash
# Run test suite
npm run test
npm run test:e2e

# Check bundle size
npm run analyze

# Verify documentation
npm run docs:build
```

### 3. Build Artifacts

```bash
# Clean previous builds
npm run clean
cargo clean

# Build for all platforms
npm run build:all
```

### 4. Release Distribution

```bash
# Create GitHub release
gh release create v1.0.0 \
    --title "HomeWise AI v1.0.0" \
    --notes "Release notes from CHANGELOG.md" \
    ./target/release/bundle/*/HomeWise*
```

## Auto-Update System

### Update Configuration

```toml
# src-tauri/tauri.conf.json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.homewise.ai/{{target}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "YOUR_UPDATE_PUBLIC_KEY"
    }
  }
}
```

### Update Server Setup

```nginx
server {
    listen 443 ssl;
    server_name releases.homewise.ai;

    location / {
        root /var/www/releases;
        autoindex off;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
    }
}
```

## Monitoring

### Application Metrics

```typescript
interface AppMetrics {
    version: string;
    os: string;
    arch: string;
    memory: {
        total: number;
        used: number;
    };
    model: {
        name: string;
        memory: number;
    };
}

// Collect metrics
#[tauri::command]
async fn collect_metrics() -> Result<AppMetrics> {
    // Implementation
}
```

### Error Tracking

```rust
#[derive(Debug, Serialize)]
struct ErrorReport {
    timestamp: i64,
    version: String,
    error: String,
    stack: String,
    context: HashMap<String, String>,
}

// Report error
#[tauri::command]
async fn report_error(error: ErrorReport) -> Result<()> {
    // Implementation
}
```

## Recovery Procedures

### Data Backup

```rust
#[tauri::command]
async fn backup_user_data() -> Result<()> {
    // 1. Stop active processes
    // 2. Create backup archive
    // 3. Store in safe location
}
```

### Error Recovery

```rust
#[tauri::command]
async fn recover_from_error() -> Result<()> {
    // 1. Load last known good state
    // 2. Restore user data
    // 3. Restart services
}
```

## Security Measures

### Runtime Verification

```rust
fn verify_installation() -> Result<()> {
    // 1. Check code signature
    // 2. Verify binary integrity
    // 3. Check for tampering
}
```

### Data Protection

```rust
fn secure_user_data() -> Result<()> {
    // 1. Encrypt sensitive data
    // 2. Set proper permissions
    // 3. Sanitize temp files
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run Tests
        run: npm run test

      - name: Coverage Report
        run: npm run test:coverage

  build:
    needs: test
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - name: Build
        run: npm run tauri build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/develop'
        run: ./scripts/deploy-staging.sh

      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: ./scripts/deploy-production.sh
```

### Deployment Environments

#### Staging Environment

- Purpose: Pre-production testing
- URL: staging.homewise.ai
- Auto-deploys from develop branch
- Feature flags enabled
- Test data available

#### Production Environment

- Purpose: Live user environment
- URL: homewise.ai
- Manual deployment approval required
- Feature flags configured
- Production data only

### Performance Monitoring

#### Metrics Collection

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

#### Alerting Thresholds

- Memory usage > 80%
- Response time > 2000ms
- Error rate > 1%
- Model load time > 5000ms

### Rollback Procedures

#### Quick Rollback

```bash
# Revert to last known good version
npm run deploy:revert

# Verify system health
npm run health:check

# Notify stakeholders
npm run notify:rollback
```

#### Data Recovery

```rust
async fn restore_checkpoint(version: String) -> Result<()> {
    // 1. Stop services
    // 2. Restore data snapshot
    // 3. Restart services
    // 4. Verify integrity
}
```
