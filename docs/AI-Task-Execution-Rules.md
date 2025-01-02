# AI Task Execution Rules

## Mandatory Pre-Task Checklist

Before starting ANY development task, I MUST:

1. **Version Check**

   ```
   [ ] Read and verify package.json version numbers
   [ ] Read and verify Cargo.toml version numbers
   [ ] Confirm version compatibility
   [ ] Report versions to user
   ```

2. **Configuration Verification**

   ```
   [ ] Read all relevant config files
   [ ] Verify config consistency
   [ ] Report any discrepancies
   ```

3. **Documentation Review**

   ```
   [ ] Read relevant documentation
   [ ] Note current development stage
   [ ] Review recent changes
   ```

4. **Test Environment**

   ```
   [ ] Check test coverage requirements
   [ ] Verify test infrastructure
   [ ] Review recent test results
   ```

5. **User Communication**
   ```
   [ ] Acknowledge task receipt
   [ ] Report environment state
   [ ] Confirm development approach
   [ ] Get user approval
   ```

## Development Process Rules

1. **NO Implementation Without**:

   - Completed pre-task checklist
   - Version verification
   - User approval
   - Test plan

2. **ALWAYS**:

   - Report versions before changes
   - Propose manual tests
   - Document changes
   - Request user verification

3. **NEVER**:
   - Skip version checks
   - Assume configuration
   - Proceed without user approval
   - Skip manual testing phase

## Manual Testing Protocol

1. **Before Requesting User Testing**:

   ```
   [ ] Clean build verified
   [ ] All automated tests passing
   [ ] Test environment documented
   [ ] Test steps prepared
   ```

2. **Testing Request Format**:

   ```markdown
   ## Manual Testing Required

   ### Environment

   - Current versions: [list all relevant versions]
   - Clean build: [Yes/No]
   - Test coverage: [percentage]

   ### Test Steps

   1. [Detailed step]
      - Expected: [behavior]
      - Verify: [specific points]

   ### Error Scenarios

   - [List scenarios to test]

   ### Feedback Needed

   - [Specific questions]
   ```

## Error Recovery Rules

1. **On Version Mismatch**:

   ```
   [ ] Stop immediately
   [ ] Report to user
   [ ] Propose resolution
   [ ] Wait for approval
   ```

2. **On Test Failure**:
   ```
   [ ] Document failure
   [ ] Analyze root cause
   [ ] Propose fix
   [ ] Request user input
   ```

## Documentation Rules

1. **Always Document**:

   - Version changes
   - Configuration updates
   - Test results
   - User feedback

2. **Update**:
   - CHANGELOG.md
   - Testing documentation
   - Version matrices
   - Error catalogs

## Quality Gates

I will not proceed past these gates without explicit verification:

1. **Pre-Development Gate**

   ```
   [ ] All versions verified
   [ ] Configurations checked
   [ ] Documentation reviewed
   [ ] User approval received
   ```

2. **Implementation Gate**

   ```
   [ ] Tests written
   [ ] Documentation updated
   [ ] Changes documented
   [ ] User informed
   ```

3. **Testing Gate**

   ```
   [ ] Automated tests passing
   [ ] Manual tests prepared
   [ ] User testing requested
   [ ] Feedback documented
   ```

4. **Completion Gate**
   ```
   [ ] All tests passing
   [ ] User approval received
   [ ] Documentation complete
   [ ] Changes logged
   ```

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
