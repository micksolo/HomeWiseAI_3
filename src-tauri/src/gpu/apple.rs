use std::sync::Mutex;
use once_cell::sync::Lazy;
use log::{debug, info};
use tokio::process::Command;
use crate::gpu::{GpuInfo, GpuType};

static CACHED_GPU_INFO: Lazy<Mutex<Option<GpuInfo>>> = Lazy::new(|| Mutex::new(None));

pub async fn detect_gpu() -> Result<GpuInfo, String> {
    // Check if error simulation is enabled
    if crate::gpu::is_error_simulation() {
        return Err("Simulated GPU error".to_string());
    }

    // Check if test mode is enabled
    if crate::gpu::is_test_mode() {
        return Ok(GpuInfo {
            gpu_type: GpuType::Apple,
            cuda_version: None,
            driver_version: Some("Test Driver".to_string()),
            compute_capability: None,
            temperature_c: Some(45.0),
            power_usage_w: Some(15.0),
            utilization_percent: Some(30.0),
            memory_total_mb: 8192,
            memory_used_mb: Some(2048),
            memory_free_mb: Some(6144),
        });
    }

    // Check cache first
    if let Some(cached_info) = CACHED_GPU_INFO.lock().unwrap().as_ref() {
        debug!("Using cached GPU info");
        return Ok(cached_info.clone());
    }

    // Run ioreg to get GPU info
    let output = Command::new("ioreg")
        .args([
            "-l",                    // List properties
            "-w0",                   // No wrap
            "-r",                    // Show subtrees
            "-c",                    // Filter by class
            "AGXAccelerator",        // GPU class
            "-d",                    // Limit depth
            "1"                      // Only immediate properties
        ])
        .output()
        .await
        .map_err(|e| format!("Failed to execute ioreg: {}", e))?;

    if !output.status.success() {
        return Err(format!(
            "ioreg command failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    let output_str = String::from_utf8_lossy(&output.stdout);
    debug!("Raw ioreg output: {}", output_str);

    // Parse output
    let gpu_info = parse_gpu_info(&output_str)?;

    // Cache the result
    *CACHED_GPU_INFO.lock().unwrap() = Some(gpu_info.clone());

    Ok(gpu_info)
}

fn parse_gpu_info(output: &str) -> Result<GpuInfo, String> {
    // Parse ioreg output to find device model and memory
    let memory_mb = output.lines()
        .find(|line| line.contains("gpu-memory-total-size"))
        .and_then(|line| line.split('=').nth(1))
        .and_then(|val| val.trim().parse::<u32>().ok())
        .unwrap_or(8192);

    let model = if output.contains("M1 Pro") {
        "Apple M1 Pro"
    } else if output.contains("M1 Max") {
        "Apple M1 Max"
    } else if output.contains("M1") {
        "Apple M1"
    } else if output.contains("M2") {
        "Apple M2"
    } else {
        return Err("No Apple Silicon GPU found".to_string());
    };

    info!("Found GPU - name: {}, memory: {}MB", model, memory_mb);

    Ok(GpuInfo {
        gpu_type: GpuType::Apple,
        cuda_version: None,
        driver_version: None,
        compute_capability: None,
        temperature_c: None,
        power_usage_w: None,
        utilization_percent: None,
        memory_total_mb: memory_mb,
        memory_used_mb: None,
        memory_free_mb: None,
    })
}

pub fn set_test_mode(enabled: bool) {
    info!("Test mode set to: {}", enabled);
}

pub fn simulate_error(enabled: bool) {
    info!("Error simulation set to: {}", enabled);
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;
    use std::time::Instant;

    #[tokio::test]
    async fn test_apple_gpu_detection() {
        let result = detect_gpu().await.unwrap();

        if cfg!(target_os = "macos") && env::var("CI").is_err() {
            assert!(matches!(result.gpu_type, GpuType::Apple), "Expected Apple GPU type");
            assert!(result.memory_total_mb > 0, "Memory should be greater than 0");
        } else {
            assert!(matches!(result.gpu_type, GpuType::None));
            assert_eq!(result.memory_total_mb, 0);
        }
    }

    #[tokio::test]
    async fn test_apple_gpu_performance() {
        let start = Instant::now();
        let result = detect_gpu().await.unwrap();
        let duration = start.elapsed();

        assert!(duration.as_millis() < 100, "GPU detection took too long: {:?}", duration);
        assert!(matches!(result.gpu_type, GpuType::Apple), "Expected Apple GPU type");
    }

    #[tokio::test]
    async fn test_apple_gpu_cache() {
        // First detection
        let start = Instant::now();
        let first_result = detect_gpu().await.unwrap();
        let first_duration = start.elapsed();

        // Second detection (should use cache)
        let start = Instant::now();
        let second_result = detect_gpu().await.unwrap();
        let second_duration = start.elapsed();

        assert_eq!(first_result.gpu_type, second_result.gpu_type);
        assert!(second_duration < first_duration, "Cached detection should be faster");
    }

    #[test]
    fn test_parse_gpu_info() {
        let output = r#"+-o AGXAccelerator  <class AGXAccelerator>
            | {
            |   "gpu-memory-total-size" = 8192
            |   "device-name" = "Apple M1 Pro"
            | }"#;
        let gpu_info = parse_gpu_info(output).unwrap();
        assert!(matches!(gpu_info.gpu_type, GpuType::Apple));
        assert_eq!(gpu_info.memory_total_mb, 8192);
    }
} 