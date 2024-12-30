# Contributing to HomeWise AI

Thank you for your interest in contributing to HomeWise AI! This document outlines our development process and guidelines.

## Development Environment Setup

### Prerequisites

- Node.js 18+
- Rust (latest stable)
- Cargo
- Git

### Initial Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/HomeWiseAI_3.git
cd HomeWiseAI_3
```

2. Install dependencies

```bash
npm install
```

3. Set up git hooks

```bash
npm run prepare
```

## Development Workflow

### Branch Naming

- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions or modifications

### Commit Messages

Follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test-related changes
- `chore:` - Maintenance tasks

### Pre-commit Checks

The following checks run automatically:

- TypeScript type checking
- ESLint
- Prettier formatting
- Test coverage (minimum 80%)

### Testing Requirements

- Write tests for all new features
- Maintain minimum 80% coverage
- Run `npm test` before committing

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Document public APIs

### React

- Use functional components
- Implement proper error boundaries
- Follow React hooks best practices

### Rust

- Follow Rust style guide
- Document public functions
- Handle errors appropriately

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Update documentation
5. Submit PR with clear description

## Release Process

1. Version bump following semver
2. Update changelog
3. Create release PR
4. Tag release after merge
