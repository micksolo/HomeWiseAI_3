# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Hardware monitoring system
  - Real-time CPU and memory information display
  - Resource usage visualization with Material-UI components
  - Automatic polling with configurable intervals
  - Error handling and retry mechanisms
  - Type-safe hardware information validation

### Changed

- Updated test configuration to better handle Tauri imports
- Improved test environment setup for consistent behavior

### Fixed

- Test environment issues with polling mechanisms
- Path alias resolution in Vitest configuration
