use log::{debug, info};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use once_cell::sync::Lazy;
use tokio::time::timeout;
use std::time::Duration;

#[derive(Debug, Clone, serde::Serialize, PartialEq)]
pub enum GpuType {
    Apple,
    Nvidia,
    None
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct GpuInfo {
    pub gpu_type: GpuType,
    pub cuda_version: Option<String>,
    pub driver_version: Option<String>,
    pub compute_capability: Option<String>,
    pub temperature_c: Option<f32>,
    pub power_usage_w: Option<f32>,
    pub utilization_percent: Option<f32>,
    pub memory_total_mb: u32,
    pub memory_used_mb: Option<u32>,
    pub memory_free_mb: Option<u32>,
}

pub mod apple;
pub mod nvidia;

// Use atomic booleans for thread-safe state
static TEST_MODE: AtomicBool = AtomicBool::new(false);
static ERROR_SIMULATION: AtomicBool = AtomicBool::new(false);
static TEST_GPU_TYPE: Lazy<Mutex<GpuType>> = Lazy::new(|| Mutex::new(GpuType::None));

pub fn set_test_mode(enabled: bool) {
    TEST_MODE.store(enabled, Ordering::SeqCst);
    info!("Test mode set to: {}", enabled);
}

pub fn set_test_gpu_type(gpu_type: GpuType) {
    let gpu_type_clone = gpu_type.clone();
    *TEST_GPU_TYPE.lock().unwrap() = gpu_type;
    info!("Test GPU type set to: {:?}", gpu_type_clone);
}

pub fn get_test_gpu_type() -> GpuType {
    TEST_GPU_TYPE.lock().unwrap().clone()
}

pub fn simulate_error(enabled: bool) {
    ERROR_SIMULATION.store(enabled, Ordering::SeqCst);
    info!("Error simulation set to: {}", enabled);
}

pub fn is_test_mode() -> bool {
    TEST_MODE.load(Ordering::SeqCst)
}

pub fn is_error_simulation() -> bool {
    ERROR_SIMULATION.load(Ordering::SeqCst)
}

// Main GPU detection function that tries different backends
pub async fn detect_gpu() -> Result<GpuInfo, String> {
    debug!("Main detect_gpu called with test_mode={}, error_simulation={}, gpu_type={:?}",
           is_test_mode(), is_error_simulation(), get_test_gpu_type());

    if is_error_simulation() {
        debug!("Main detect_gpu returning simulated error");
        return Err("Simulated GPU error".to_string());
    }

    if is_test_mode() {
        let gpu_type = get_test_gpu_type();
        debug!("Main detect_gpu delegating to {:?} module in test mode", gpu_type);
        match gpu_type {
            GpuType::Nvidia => nvidia::detect_gpu().await,
            GpuType::Apple => apple::detect_gpu().await,
            GpuType::None => Ok(GpuInfo {
                gpu_type: GpuType::None,
                cuda_version: None,
                driver_version: None,
                compute_capability: None,
                temperature_c: None,
                power_usage_w: None,
                utilization_percent: None,
                memory_total_mb: 0,
                memory_used_mb: None,
                memory_free_mb: None,
            }),
        }
    } else {
        debug!("Main detect_gpu using real detection logic");
        // Try NVIDIA first with timeout
        match timeout(Duration::from_secs(5), nvidia::detect_gpu()).await {
            Ok(Ok(info)) => return Ok(info),
            Ok(Err(e)) => debug!("NVIDIA GPU detection failed: {}", e),
            Err(_) => debug!("NVIDIA GPU detection timed out"),
        }

        // Try Apple Silicon with timeout
        match timeout(Duration::from_secs(5), apple::detect_gpu()).await {
            Ok(Ok(info)) => return Ok(info),
            Ok(Err(e)) => debug!("Apple GPU detection failed: {}", e),
            Err(_) => debug!("Apple GPU detection timed out"),
        }

        // Return None if no GPU is detected
        Ok(GpuInfo {
            gpu_type: GpuType::None,
            cuda_version: None,
            driver_version: None,
            compute_capability: None,
            temperature_c: None,
            power_usage_w: None,
            utilization_percent: None,
            memory_total_mb: 0,
            memory_used_mb: None,
            memory_free_mb: None,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;

    #[tokio::test]
    async fn test_gpu_detection() {
        set_test_mode(true);
        simulate_error(false);
        
        let start = Instant::now();
        let info = detect_gpu().await.expect("GPU detection should succeed");
        
        // Test performance
        assert!(start.elapsed().as_millis() < 100, "GPU detection took too long");
        
        // Test basic info
        assert!(info.memory_total_mb > 0, "Should have valid memory size");
        assert!(matches!(info.gpu_type, GpuType::Apple | GpuType::None), 
                "Should detect Apple GPU or None");
                
        set_test_mode(false);
        simulate_error(false);
    }

    #[tokio::test]
    async fn test_gpu_metrics() {
        set_test_mode(true);
        simulate_error(false);
        
        let info = detect_gpu().await.expect("GPU detection should succeed");
        
        if let GpuType::Apple = info.gpu_type {
            // Test memory metrics
            assert!(info.memory_total_mb > 1024, "Total memory should be > 1GB");
            if let Some(used) = info.memory_used_mb {
                assert!(used <= info.memory_total_mb, "Used memory should not exceed total");
            }
            
            // Test temperature and power if available
            if let Some(temp) = info.temperature_c {
                assert!((0.0..120.0).contains(&temp), "Temperature should be in valid range");
            }
            if let Some(power) = info.power_usage_w {
                assert!((0.0..200.0).contains(&power), "Power usage should be in valid range");
            }
        }
        
        set_test_mode(false);
        simulate_error(false);
    }

    #[test]
    fn test_test_mode() {
        set_test_mode(false);
        simulate_error(false);
        assert!(!is_test_mode(), "Test mode should be off by default");
        
        set_test_mode(true);
        assert!(is_test_mode(), "Test mode should be enabled");
        
        set_test_mode(false);
        assert!(!is_test_mode(), "Test mode should be disabled");
    }

    #[tokio::test]
    async fn test_error_simulation() {
        // Reset state
        set_test_mode(true);
        simulate_error(false);
        
        // Test error simulation enabled
        simulate_error(true);
        let result = detect_gpu().await;
        assert!(result.is_err(), "Should return error when simulation is enabled");
        
        // Test error simulation disabled
        simulate_error(false);
        let result = detect_gpu().await;
        assert!(result.is_ok(), "Should succeed when simulation is disabled");
        
        // Reset state
        set_test_mode(false);
        simulate_error(false);
    }
} 