# AI Task Execution Rules

## Task Initialization

### 1. Task Analysis

- Read and understand the task description
- Refer to the project goals document (docs/Goals.md)
- Consider user needs and personas
- Identify required inputs and expected outputs
- Check for any dependencies or prerequisites
- Estimate time and resources needed

### 2. Task Validation

- Verify task completeness
- Check for ambiguous requirements
- Confirm all necessary parameters are provided
- Validate against project constraints

## Task Execution

### 1. Planning

- Break down task into subtasks
- Create execution plan
- Identify potential risks
- Plan error handling

### 2. Implementation

- Consider project goals and user needs
- Follow coding standards
- Write clean, maintainable code
- Add appropriate comments
- Implement proper error handling
- Ensure feature aligns with user expectations

### 3. Testing

- Write unit tests
- Test edge cases
- Verify output format
- Check performance

### 4. Documentation

- Document code functionality
- Add usage examples
- Update relevant documentation
- Include change notes

## Task Completion

### 1. Code Review

- Run static analysis
- Check code style
- Verify test coverage
- Ensure security compliance

### 2. Submission

- Create pull request
- Include detailed description
- Attach test results
- Provide performance metrics

### 3. Monitoring

- Track deployment status
- Monitor performance
- Handle any issues
- Collect feedback

## Rules and Guidelines

### Input Validation

- Validate all inputs
- Check parameter types
- Verify required fields
- Handle invalid inputs gracefully

### Error Handling

- Use standard error codes
- Provide meaningful error messages
- Implement retry mechanisms
- Log errors appropriately

### Performance

- Optimize for efficiency
- Monitor resource usage
- Handle large datasets
- Implement caching where appropriate

### Security

- Validate all inputs
- Sanitize user-provided data
- Use secure storage
- Follow encryption guidelines

### Documentation

- Document all public APIs
- Include usage examples
- Specify parameter types
- Document return values

## Quality Assurance

### Testing Requirements

- Unit tests for all new code
- Integration tests for critical paths
- End-to-end tests for user workflows
- Performance tests for resource-intensive operations

### Code Coverage

- Minimum 80% coverage for frontend
- Minimum 90% coverage for backend
- Critical paths must have 100% coverage

### Static Analysis

- Run ESLint for TypeScript
- Run Clippy for Rust
- Fix all warnings and errors
- Maintain code style consistency

## Version Control

### Branching Strategy

- Feature branches: `feature/description`
- Bug fix branches: `fix/description`
- Hotfix branches: `hotfix/description`

### Commit Messages

```
type(scope): description

[optional body]

[optional footer]
```

### Change Tracking

- Document all changes in CHANGELOG.md
- Include issue references
- Track breaking changes

## Task Types

### Feature Development

1. Analyze requirements
2. Design solution
3. Implement feature
4. Write tests
5. Document changes

### Bug Fixes

1. Reproduce issue
2. Identify root cause
3. Implement fix
4. Add regression tests
5. Document fix

### Refactoring

1. Analyze current implementation
2. Plan refactoring strategy
3. Implement changes
4. Verify functionality
5. Update documentation

### Performance Optimization

1. Identify bottlenecks
2. Analyze performance metrics
3. Implement optimizations
4. Measure improvements
5. Document changes

## Error Codes

| Code   | Description                |
| ------ | -------------------------- |
| AI-001 | Invalid task specification |
| AI-002 | Missing required parameter |
| AI-003 | Type mismatch              |
| AI-004 | Resource not found         |
| AI-005 | Permission denied          |
| AI-006 | Timeout exceeded           |
| AI-007 | Invalid input format       |
| AI-008 | Configuration error        |
| AI-009 | Resource limit exceeded    |
| AI-010 | Unexpected system error    |
