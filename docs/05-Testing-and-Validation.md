# 05-Testing-and-Validation.md

# HomeWise AI — Testing and Validation

## 1. Functional Testing

- **File Ingestion**  
  - Verify correct text extraction (PDF, DOCX, XLSX, etc.).
  - Check chunk creation and embedding accuracy.
  - Validate file size limits (see `12-Technical-Specifications.md`).
  - Test error handling for oversized or corrupted files.

- **Chat Q&A**  
  - Test general knowledge queries vs. doc-based queries.
  - Ensure references to correct file chunks.
  - Validate response times against performance targets:
    - General queries: < 5 seconds
    - Document queries: < 10 seconds

## 2. Performance and Load Testing

- **Model Load Times**  
  - Measure time to initialize the local LLM (< 30 seconds).
  - Test CPU vs. GPU performance where available.
  - Verify memory usage within specified limits for each model tier.

- **Document Processing**  
  - Validate indexing speed (< 1 minute per 100 pages).
  - Test concurrent document handling up to 1000 files or 10GB.
  - Verify system warnings when approaching limits.

## 3. Security and Privacy Audits

- **Local Data Integrity**  
  - Ensure no external data transmission.
  - Verify AES-256 encryption implementation.
  - Test encryption key storage in system keychain.
  - Validate data recovery scenarios.

- **License & Trial Flow**  
  - Test local trial key generation and expiration after 7 days.
  - Verify hardware-fingerprint generation.
  - Test license key validation process.
  - Validate offline activation workflow.
  - Check hardware change allowance (3 changes max).

- **Update Security**
  - Verify GPG signature validation.
  - Test update rollback functionality.
  - Validate backup creation before updates.
  - Check air-gapped update process.

## 4. User Acceptance Testing (UAT)

- **Non-Technical Users**  
  - Installation on Windows/Mac, verifying ease-of-use.  
  - Check if trial activation steps are clear.
  - Verify error messages are jargon-free.
  - Test progress indicators and status messages.

- **Edge Cases**  
  - Very large documents, older OS versions, minimal RAM.  
  - Attempting to continue after trial without purchasing a license.
  - Network disconnection during updates.
  - Recovery from interrupted operations.

## 5. Regression Testing

- **Automatic Testing**  
  - Maintain a suite of unit and integration tests.
  - Performance regression checks against baseline metrics.
  - Security validation suite for encryption and privacy features.
  - Re-run tests before each release to ensure no breakage.

