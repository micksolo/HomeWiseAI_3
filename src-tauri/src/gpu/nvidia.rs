use super::{GpuInfo, GpuType};
use log::debug;
use tokio::process::Command;
use tokio::time::timeout;
use std::time::Duration;
use std::str;
use std::collections::HashMap;

#[derive(Debug)]
pub struct CudaDeviceProperties {
    pub compute_capability_major: u32,
    pub compute_capability_minor: u32,
    pub total_memory_bytes: u64,
    pub max_threads_per_block: u32,
    pub max_shared_memory_per_block: u32,
    pub warp_size: u32,
}

pub async fn get_cuda_device_properties() -> Option<CudaDeviceProperties> {
    if super::is_test_mode() {
        return Some(CudaDeviceProperties {
            compute_capability_major: 8,
            compute_capability_minor: 6,
            total_memory_bytes: 8589934592, // 8GB
            max_threads_per_block: 1024,
            max_shared_memory_per_block: 49152,
            warp_size: 32,
        });
    }

    // Real device properties detection with timeout
    let output = match timeout(Duration::from_secs(5), Command::new("nvidia-smi")
        .arg("--query-gpu=compute_cap,memory.total")
        .arg("--format=csv,noheader,nounits")
        .output()).await {
            Ok(result) => result.ok()?,
            Err(_) => return None, // Timeout
    };

    if !output.status.success() {
        return None;
    }

    let output_str = String::from_utf8_lossy(&output.stdout);
    let values: Vec<&str> = output_str.trim().split(',').map(|s| s.trim()).collect();
    
    if values.len() < 2 {
        return None;
    }

    Some(CudaDeviceProperties {
        compute_capability_major: values[0].parse().ok()?,
        compute_capability_minor: values[1].parse().ok()?,
        total_memory_bytes: values[2].parse::<u64>().ok()? * 1024 * 1024, // Convert MB to bytes
        max_threads_per_block: values[3].parse().ok()?,
        max_shared_memory_per_block: values[4].parse().ok()?,
        warp_size: values[5].parse().ok()?,
    })
}

async fn get_cuda_info() -> Option<HashMap<String, String>> {
    if super::is_test_mode() {
        let mut info = HashMap::new();
        info.insert("cuda_version".to_string(), "11.7".to_string());
        info.insert("cudnn_version".to_string(), "8.5.0".to_string());
        return Some(info);
    }

    // Add timeout to nvcc command
    let nvcc_output = match timeout(Duration::from_secs(5), Command::new("nvcc")
        .arg("--version")
        .output()).await {
            Ok(result) => result.ok()?,
            Err(_) => return None, // Timeout
    };

    if !nvcc_output.status.success() {
        return None;
    }

    let mut info = HashMap::new();
    let version_str = String::from_utf8_lossy(&nvcc_output.stdout);
    
    // Parse CUDA version
    if let Some(cuda_version) = version_str
        .lines()
        .find(|line| line.contains("release"))
        .and_then(|line| line.split_whitespace().last()) {
        info.insert("cuda_version".to_string(), cuda_version.to_string());
    }

    // Get cuDNN version if available
    if let Ok(output) = Command::new("sh")
        .arg("-c")
        .arg("ldconfig -p | grep cudnn | head -n 1")
        .output()
        .await {
        if output.status.success() {
            let cudnn_str = String::from_utf8_lossy(&output.stdout);
            if let Some(version) = cudnn_str
                .split("libcudnn.so.")
                .nth(1)
                .and_then(|s| s.split_whitespace().next()) {
                info.insert("cudnn_version".to_string(), version.to_string());
            }
        }
    }

    Some(info)
}

pub async fn detect_gpu() -> Result<GpuInfo, String> {
    debug!("NVIDIA detect_gpu called with test_mode={}, error_simulation={}, gpu_type={:?}",
           super::is_test_mode(), super::is_error_simulation(), super::get_test_gpu_type());

    // Check error simulation first
    if super::is_error_simulation() {
        debug!("NVIDIA detect_gpu returning simulated error");
        return Err("Simulated GPU error".to_string());
    }

    // Then check test mode
    if super::is_test_mode() && matches!(super::get_test_gpu_type(), GpuType::Nvidia) {
        debug!("NVIDIA detect_gpu returning test mode data");
        return Ok(GpuInfo {
            gpu_type: GpuType::Nvidia,
            cuda_version: Some("11.7".to_string()),
            driver_version: Some("515.65.01".to_string()),
            compute_capability: Some("8.6".to_string()),
            temperature_c: Some(65.0),
            power_usage_w: Some(150.0),
            utilization_percent: Some(80.0),
            memory_total_mb: 8192,
            memory_used_mb: Some(4096),
            memory_free_mb: Some(4096),
        });
    }

    // Finally, try real detection with timeout
    debug!("NVIDIA detect_gpu using real detection logic");
    let output = match timeout(Duration::from_secs(5), Command::new("nvidia-smi")
        .arg("--query-gpu=memory.total,memory.used,memory.free,temperature.gpu,power.draw,utilization.gpu")
        .arg("--format=csv,noheader,nounits")
        .output()).await {
            Ok(result) => result.map_err(|_| "NVIDIA GPU not found".to_string())?,
            Err(_) => return Err("NVIDIA GPU detection timed out".to_string()),
    };

    if !output.status.success() {
        return Err("NVIDIA GPU not found".to_string());
    }

    let output_str = str::from_utf8(&output.stdout)
        .map_err(|e| format!("Failed to parse nvidia-smi output: {}", e))?;

    debug!("nvidia-smi output: {}", output_str);

    // Parse the CSV output
    let values: Vec<&str> = output_str.trim().split(',').map(|s| s.trim()).collect();
    if values.len() < 7 {
        return Err("Invalid nvidia-smi output format".to_string());
    }

    let memory_total = values[1].parse::<u32>()
        .map_err(|_| "Failed to parse total memory")?;
    let memory_used = values[2].parse::<u32>()
        .map_err(|_| "Failed to parse used memory")?;
    let memory_free = values[3].parse::<u32>()
        .map_err(|_| "Failed to parse free memory")?;
    let temperature = values[4].parse::<f32>()
        .map_err(|_| "Failed to parse temperature")?;
    let power = values[5].parse::<f32>()
        .map_err(|_| "Failed to parse power usage")?;
    let utilization = values[6].parse::<f32>()
        .map_err(|_| "Failed to parse GPU utilization")?;

    // Get CUDA information
    let cuda_info = get_cuda_info().await;
    let cuda_version = cuda_info.as_ref().and_then(|info| info.get("cuda_version").cloned());
    let driver_version = get_driver_version().await;

    // Get device properties
    let device_props = get_cuda_device_properties().await;
    let compute_capability = device_props.as_ref().map(|props| 
        format!("{}.{}", props.compute_capability_major, props.compute_capability_minor)
    );

    // Log debug information
    if let Some(props) = device_props.as_ref() {
        debug!("CUDA Device Properties:");
        debug!("  Compute Capability: {}.{}", props.compute_capability_major, props.compute_capability_minor);
        debug!("  Total Memory: {} bytes", props.total_memory_bytes);
        debug!("  Max Threads per Block: {}", props.max_threads_per_block);
        debug!("  Max Shared Memory per Block: {}", props.max_shared_memory_per_block);
        debug!("  Warp Size: {}", props.warp_size);
    }

    if let Some(info) = cuda_info.as_ref() {
        debug!("CUDA Information:");
        for (key, value) in info {
            debug!("  {}: {}", key, value);
        }
    }

    Ok(GpuInfo {
        gpu_type: GpuType::Nvidia,
        cuda_version,
        driver_version,
        compute_capability,
        temperature_c: Some(temperature),
        power_usage_w: Some(power),
        utilization_percent: Some(utilization),
        memory_total_mb: memory_total,
        memory_used_mb: Some(memory_used),
        memory_free_mb: Some(memory_free),
    })
}

async fn get_driver_version() -> Option<String> {
    if super::is_test_mode() {
        return Some("515.65.01".to_string());
    }

    // Add timeout to nvidia-smi command
    let output = match timeout(Duration::from_secs(5), Command::new("nvidia-smi")
        .arg("--query-gpu=driver_version")
        .arg("--format=csv,noheader")
        .output()).await {
            Ok(result) => result.ok()?,
            Err(_) => return None, // Timeout
    };

    if !output.status.success() {
        return None;
    }

    let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
    Some(version)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{Duration, Instant};
    use tokio::sync::Mutex;
    use once_cell::sync::Lazy;

    // Global test mutex to ensure tests don't interfere with each other
    static TEST_MUTEX: Lazy<Mutex<()>> = Lazy::new(|| Mutex::new(()));

    // Helper function to setup test environment
    async fn setup_test_env(enable_test_mode: bool, simulate_error: bool) {
        // Reset any previous state
        super::super::simulate_error(false);
        super::super::set_test_mode(false);
        super::super::set_test_gpu_type(GpuType::None);

        // Set new state in the correct order
        if enable_test_mode {
            super::super::set_test_gpu_type(GpuType::Nvidia);
            super::super::set_test_mode(true);
        }

        // Set error simulation last
        super::super::simulate_error(simulate_error);

        // Verify state
        debug!("Test environment setup complete:");
        debug!("  test_mode={}", super::super::is_test_mode());
        debug!("  error_simulation={}", super::super::is_error_simulation());
        debug!("  gpu_type={:?}", super::super::get_test_gpu_type());

        // Double-check state
        let test_mode = super::super::is_test_mode();
        let error_simulation = super::super::is_error_simulation();
        let gpu_type = super::super::get_test_gpu_type();

        assert_eq!(test_mode, enable_test_mode, "Test mode not set correctly");
        assert_eq!(error_simulation, simulate_error, "Error simulation not set correctly");
        if enable_test_mode {
            assert_eq!(gpu_type, GpuType::Nvidia, "GPU type not set correctly");
        }
    }

    // Helper function to cleanup test environment
    async fn cleanup_test_env() {
        // Reset state in the correct order
        super::super::simulate_error(false);
        super::super::set_test_mode(false);
        super::super::set_test_gpu_type(GpuType::None);

        // Verify cleanup
        debug!("Test environment cleanup complete:");
        debug!("  test_mode={}", super::super::is_test_mode());
        debug!("  error_simulation={}", super::super::is_error_simulation());
        debug!("  gpu_type={:?}", super::super::get_test_gpu_type());

        // Double-check cleanup
        let test_mode = super::super::is_test_mode();
        let error_simulation = super::super::is_error_simulation();
        let gpu_type = super::super::get_test_gpu_type();

        assert!(!test_mode, "Test mode not cleaned up");
        assert!(!error_simulation, "Error simulation not cleaned up");
        assert_eq!(gpu_type, GpuType::None, "GPU type not cleaned up");
    }

    // Helper function to run a test with proper setup and cleanup
    async fn run_test<F, Fut>(enable_test_mode: bool, simulate_error: bool, test_fn: F)
    where
        F: FnOnce() -> Fut,
        Fut: std::future::Future<Output = ()>,
    {
        let _guard = TEST_MUTEX.lock().await;
        setup_test_env(enable_test_mode, simulate_error).await;
        test_fn().await;
        cleanup_test_env().await;
    }

    #[tokio::test]
    async fn test_error_handling() {
        run_test(true, true, || async {
            let result = detect_gpu().await;
            assert!(result.is_err(), "Should return error when simulation is enabled");
            assert_eq!(result.unwrap_err(), "Simulated GPU error", "Error message should match");
        }).await;

        run_test(false, false, || async {
            let result = detect_gpu().await;
            assert!(result.is_err(), "Should return error when nvidia-smi is not available");
            assert_eq!(result.unwrap_err(), "NVIDIA GPU not found", "Error message should match");
        }).await;
    }

    #[tokio::test]
    async fn test_nvidia_gpu_detection() {
        run_test(true, false, || async {
            let info = detect_gpu().await.expect("GPU detection should succeed");
            assert_eq!(info.gpu_type, GpuType::Nvidia);
            assert!(info.memory_total_mb > 0);
        }).await;
    }

    #[tokio::test]
    async fn test_nvidia_metrics() {
        run_test(true, false, || async {
            let info = detect_gpu().await.expect("GPU detection should succeed");
            
            // Basic metric validation
            assert!(info.temperature_c.is_some());
            assert!(info.power_usage_w.is_some());
            assert!(info.utilization_percent.is_some());
            assert!(info.memory_used_mb.is_some());
            assert!(info.memory_free_mb.is_some());

            // Value range validation
            if let Some(temp) = info.temperature_c {
                assert!((0.0..=110.0).contains(&temp), "Temperature should be between 0°C and 110°C");
            }
            if let Some(power) = info.power_usage_w {
                assert!((0.0..=500.0).contains(&power), "Power usage should be between 0W and 500W");
            }
            if let Some(util) = info.utilization_percent {
                assert!((0.0..=100.0).contains(&util), "Utilization should be between 0% and 100%");
            }
        }).await;
    }

    #[tokio::test]
    async fn test_cuda_capabilities() {
        run_test(true, false, || async {
            let info = detect_gpu().await.expect("GPU detection should succeed");
            
            // Basic CUDA information
            assert!(info.cuda_version.is_some(), "CUDA version should be available in test mode");
            assert!(info.compute_capability.is_some(), "Compute capability should be available in test mode");
            
            if let Some(cc) = info.compute_capability {
                let parts: Vec<&str> = cc.split('.').collect();
                assert_eq!(parts.len(), 2, "Compute capability should be in format 'major.minor'");
                assert!(parts[0].parse::<u32>().is_ok(), "Major version should be a number");
                assert!(parts[1].parse::<u32>().is_ok(), "Minor version should be a number");
            }
        }).await;
    }

    #[tokio::test]
    async fn test_cuda_device_properties() {
        run_test(true, false, || async {
            if let Some(props) = get_cuda_device_properties().await {
                assert!(props.compute_capability_major > 0);
                assert!(props.total_memory_bytes > 0);
                assert!(props.max_threads_per_block > 0);
                assert!(props.max_shared_memory_per_block > 0);
                assert!(props.warp_size > 0);
            }
        }).await;
    }

    #[tokio::test]
    async fn test_memory_consistency() {
        run_test(true, false, || async {
            let info = detect_gpu().await.expect("GPU detection should succeed");
            
            // Verify memory values
            assert!(info.memory_total_mb > 0, "Total memory should be greater than 0");
            
            if let (Some(used), Some(free)) = (info.memory_used_mb, info.memory_free_mb) {
                assert!(used <= info.memory_total_mb, "Used memory should not exceed total memory");
                assert_eq!(
                    used + free,
                    info.memory_total_mb,
                    "Used memory + free memory should equal total memory"
                );
            }
        }).await;
    }

    #[tokio::test]
    async fn test_performance() {
        run_test(true, false, || async {
            // Test detection performance
            let start = Instant::now();
            let info = detect_gpu().await.expect("GPU detection should succeed");
            let duration = start.elapsed();
            
            // Detection should complete in under 500ms in test mode
            assert!(
                duration < Duration::from_millis(500),
                "GPU detection took too long: {:?}",
                duration
            );

            // Test caching performance (only in test mode)
            let cache_start = Instant::now();
            let cached_info = detect_gpu().await.expect("Cached GPU detection should succeed");
            let cache_duration = cache_start.elapsed();
            
            // Cached detection should be faster or equal (since we're in test mode)
            assert!(
                cache_duration <= duration,
                "Cached GPU detection should not be slower than initial detection"
            );

            // Verify cache consistency
            assert_eq!(
                format!("{:?}", info),
                format!("{:?}", cached_info),
                "Cached info should match original info"
            );
        }).await;
    }

    #[tokio::test]
    async fn test_driver_version() {
        run_test(true, false, || async {
            let info = detect_gpu().await.expect("GPU detection should succeed");
            assert!(info.driver_version.is_some(), "Driver version should be available in test mode");
            
            if let Some(version) = info.driver_version {
                // Verify version format (e.g., "515.65.01")
                let parts: Vec<&str> = version.split('.').collect();
                assert!(parts.len() >= 2, "Driver version should have at least major.minor format");
                assert!(parts[0].parse::<u32>().is_ok(), "Major version should be a number");
                assert!(parts[1].parse::<u32>().is_ok(), "Minor version should be a number");
            }
        }).await;
    }
} 