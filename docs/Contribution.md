# Contributing to HomeWise AI

## Overview

HomeWise AI welcomes contributions from the community. This document outlines the process for contributing and our coding standards. For more information about the project's goals, please see the [Goals document](Goals.md).

## Development Process

### 1. Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/HomeWiseAI.git

# Install dependencies
npm install

# Setup pre-commit hooks
npm run prepare
```

### 2. Branch Naming Convention

- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<issue-number>-<short-description>`
- Documentation: `docs/<short-description>`
- Performance improvements: `perf/<short-description>`

### 3. Testing Requirements

All contributions MUST include appropriate tests and meet our coverage requirements:

```bash
# Run tests
npm run test

# Check coverage
npm run test:coverage
```

#### Coverage Thresholds

- Minimum 80% coverage for:
  - Statements
  - Branches
  - Functions
  - Lines

#### Test Guidelines

- Place test files in `__tests__` directories next to the code they test
- Use descriptive test names that explain the behavior being tested
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies appropriately
- Include both positive and negative test cases

### 4. Code Style

We use automated tools to maintain consistent code style:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

#### TypeScript Guidelines

- Use explicit types, avoid `any`
- Prefer functional components and hooks
- Use proper error handling
- Document complex functions and components

#### React Best Practices

- Keep components small and focused
- Use proper prop types
- Follow React hooks rules
- Implement proper error boundaries

### 5. Pull Request Process

1. Create a feature branch
2. Write tests for your changes
3. Ensure all tests pass and coverage requirements are met
4. Update documentation as needed
5. Submit a pull request with:
   - Clear description of changes
   - Screenshots for UI changes
   - Test coverage report
   - Related issue numbers

### 6. Code Review

All code reviews should check for:

- Test coverage and quality
- Code style compliance
- Documentation updates
- Performance implications
- Security considerations

## Quality Gates

### Pre-commit Checks

- Linting
- Code formatting
- Type checking
- Unit tests

### Pre-push Checks

- Full test suite
- Coverage requirements
- Integration tests
- Build verification

## Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Update CHANGELOG.md
- Keep API documentation current

## Dependencies

- Get approval for new dependencies
- Keep dependencies up to date
- Prefer well-maintained packages
- Consider bundle size impact

## Security

- No sensitive data in commits
- Proper input validation
- Secure data handling
- Regular dependency audits

## Need Help?

- Check existing issues
- Read the documentation
- Ask in discussions
- Join our community chat

## License

By contributing, you agree that your contributions will be licensed under the project's license.
