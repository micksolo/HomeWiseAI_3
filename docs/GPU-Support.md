# GPU Support Documentation

## Overview

HomeWiseAI provides GPU acceleration support for improved AI model performance. The system currently supports Apple Silicon GPUs through Metal, with planned support for NVIDIA (CUDA) and AMD (ROCm) GPUs.

## Current Implementation

### Apple Silicon Support

- **Detection**: Automatic detection of Apple Silicon GPUs
- **Memory Management**: VRAM monitoring and management
- **Performance Metrics**:
  - Total VRAM
  - Used VRAM
  - Free VRAM
  - Temperature monitoring (where available)
  - Power usage tracking (where available)

### Test Mode

The system includes a test mode for validating GPU functionality:

- Basic GPU detection
- Memory allocation testing
- Error simulation capabilities
- Performance benchmarking

## Architecture

### Backend (Rust)

```rust
// Core GPU detection structure
pub struct GpuInfo {
    gpu_type: GpuType,
    memory_total_mb: u64,
    memory_used_mb: Option<u64>,
    memory_free_mb: Option<u64>,
    driver_version: Option<String>,
    temperature_c: Option<f32>,
    power_usage_w: Option<f32>,
    utilization_percent: Option<f32>,
}

// Supported GPU types
pub enum GpuType {
    Apple,
    None,
}
```

### Frontend (TypeScript/React)

The GPU information is displayed through two main components:

- `GpuInfo`: Displays basic GPU information and status
- `TestDiagnostics`: Provides detailed GPU testing capabilities

## Usage

### Basic GPU Detection

```typescript
// Example of checking GPU availability
const gpuInfo = await invoke('get_gpu_info')
if (gpuInfo.gpu_type !== 'None') {
  console.log(`GPU detected: ${gpuInfo.gpu_type}`)
  console.log(`Total VRAM: ${gpuInfo.memory_total_mb}MB`)
}
```

### Test Mode Activation

```typescript
// Enable test mode
await invoke('set_gpu_test_mode', { enabled: true })

// Run diagnostics
await invoke('run_gpu_diagnostics')
```

## Error Handling

### Common Issues

1. **No GPU Detected**

   - Verify hardware compatibility
   - Check driver installation
   - Ensure proper permissions

2. **Memory Allocation Failures**

   - Monitor VRAM usage
   - Check for memory leaks
   - Reduce batch sizes if necessary

3. **Performance Issues**
   - Monitor temperature
   - Check power usage
   - Verify driver version

### Error Recovery

The system implements graceful degradation:

1. Attempts to reinitialize GPU connection
2. Falls back to CPU if GPU is unavailable
3. Provides detailed error messages for troubleshooting

## Future Implementations

### Planned GPU Support

1. **NVIDIA GPUs (CUDA)**

   - CUDA toolkit integration
   - cuDNN support
   - Multi-GPU capabilities

2. **AMD GPUs (ROCm)**
   - ROCm driver support
   - HIP programming model
   - OpenCL fallback

### Performance Optimizations

- Dynamic batch size adjustment
- Memory usage optimization
- Power efficiency improvements
- Temperature management

## Development Guidelines

### Adding New GPU Support

1. Create new GPU type detection module
2. Implement memory management
3. Add performance monitoring
4. Update frontend components
5. Add comprehensive tests

### Testing Requirements

- Unit tests for detection logic
- Integration tests with hardware
- Performance benchmarks
- Error handling verification

## Troubleshooting Guide

### Diagnostic Steps

1. **Verify Hardware Detection**

   ```bash
   # Check GPU detection
   cargo test gpu::tests::test_gpu_detection
   ```

2. **Validate Memory Management**

   ```bash
   # Test memory allocation
   cargo test gpu::tests::test_memory_management
   ```

3. **Test Performance Metrics**
   ```bash
   # Run performance tests
   cargo test gpu::tests::test_performance_metrics
   ```

### Common Solutions

1. **GPU Not Detected**

   - Restart the application
   - Update GPU drivers
   - Check hardware compatibility

2. **Memory Issues**

   - Clear GPU memory cache
   - Reduce model size
   - Update memory limits

3. **Performance Problems**
   - Monitor temperature
   - Check resource usage
   - Verify driver version

## References

- [Metal Programming Guide](https://developer.apple.com/metal/)
- [CUDA Documentation](https://docs.nvidia.com/cuda/)
- [ROCm Documentation](https://rocmdocs.amd.com/)
