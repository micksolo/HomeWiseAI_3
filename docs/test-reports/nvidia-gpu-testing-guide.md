# NVIDIA GPU Testing Guide

## Prerequisites

1. A computer with an NVIDIA GPU installed
2. NVIDIA drivers installed and up to date
3. CUDA toolkit installed (version 11.7 or later)
4. Git installed
5. Rust toolchain installed (latest stable version)
6. Node.js installed (latest LTS version)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/HomeWiseAI_3.git
   cd HomeWiseAI_3
   ```

2. Install dependencies:

   ```bash
   # Install frontend dependencies
   npm install

   # Build Rust backend
   cd src-tauri
   cargo build
   ```

## Testing Steps

1. **Basic GPU Detection**

   ```bash
   # Run the GPU detection test
   cd src-tauri
   cargo test gpu::nvidia::tests::test_nvidia_gpu_detection -- --nocapture
   ```

   - Expected: Test should pass and show actual GPU details
   - Note down: GPU model, VRAM size, driver version

2. **Memory Management**

   ```bash
   cargo test gpu::nvidia::tests::test_memory_consistency -- --nocapture
   ```

   - Note down: Total VRAM, Used VRAM, Free VRAM

3. **Performance Metrics**

   ```bash
   cargo test gpu::nvidia::tests::test_performance -- --nocapture
   ```

   - Note down: Temperature, Power usage, Utilization

4. **CUDA Capabilities**
   ```bash
   cargo test gpu::nvidia::tests::test_cuda_capabilities -- --nocapture
   ```
   - Note down: CUDA version, Compute capability

## What to Report

Please provide the following information:

1. **System Information**

   - OS version and build
   - NVIDIA GPU model
   - NVIDIA driver version
   - CUDA version

2. **Test Results**

   - Screenshot or copy of each test output
   - Any error messages encountered
   - Actual values for memory, performance metrics
   - Time taken for each test to complete

3. **Observations**
   - Any unexpected behavior
   - Performance issues
   - System resource usage
   - Any crashes or freezes

## How to Report

1. Create a new issue on GitHub with the title "NVIDIA GPU Testing - [GPU Model]"
2. Use the following template:

   ```markdown
   ## System Information

   - GPU Model:
   - Driver Version:
   - CUDA Version:
   - OS:

   ## Test Results

   ### GPU Detection

   [Output]

   ### Memory Management

   [Output]

   ### Performance Metrics

   [Output]

   ### CUDA Capabilities

   [Output]

   ## Additional Notes

   [Any other observations]
   ```

## Troubleshooting

If you encounter issues:

1. **GPU Not Detected**

   - Verify NVIDIA drivers are installed: `nvidia-smi`
   - Check CUDA installation: `nvcc --version`
   - Ensure GPU is recognized by system

2. **Test Failures**

   - Clean and rebuild: `cargo clean && cargo build`
   - Check system logs for errors
   - Verify CUDA toolkit version matches requirements

3. **Performance Issues**
   - Close other GPU-intensive applications
   - Monitor GPU temperature and usage
   - Check system power settings

## Contact

If you need help during testing:

1. Comment on the GitHub issue
2. Include all relevant error messages
3. Provide system information and logs
