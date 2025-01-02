use crate::gpu;
use crate::hardware::{self, HardwareInfo, HardwareError};
use std::time::Instant;
use log::debug;

#[tauri::command]
pub async fn detect_gpu() -> Result<gpu::GpuInfo, String> {
    let start = Instant::now();
    let result = gpu::apple::detect_gpu().await;
    debug!("GPU detection completed in {}ms", start.elapsed().as_millis());
    result
}

#[tauri::command]
pub fn get_hardware_info() -> Result<HardwareInfo, HardwareError> {
    let start = Instant::now();
    let result = hardware::get_hardware_info();
    debug!("Hardware info fetched in {}ms", start.elapsed().as_millis());
    result
}

#[tauri::command]
pub fn set_gpu_test_mode(enabled: bool) {
    gpu::set_test_mode(enabled);
}

#[tauri::command]
pub fn is_gpu_test_mode() -> bool {
    gpu::is_test_mode()
}

#[tauri::command]
pub fn simulate_error(enabled: bool) {
    gpu::simulate_error(enabled);
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;
    use crate::gpu::GpuType;

    #[tokio::test]
    async fn test_detect_gpu_command() {
        let start = Instant::now();
        let result = detect_gpu().await.unwrap();
        let duration = start.elapsed();

        assert!(duration.as_millis() < 100, "GPU detection took too long: {:?}", duration);
        assert!(matches!(result.gpu_type, GpuType::Apple), "Expected Apple GPU type");
        assert!(result.memory_total_mb > 0, "Memory should be greater than 0");
    }

    #[test]
    fn test_gpu_test_mode() {
        assert!(!gpu::is_test_mode(), "Test mode should be disabled by default");
        
        set_gpu_test_mode(true);
        assert!(gpu::is_test_mode(), "Test mode should be enabled");
        
        set_gpu_test_mode(false);
        assert!(!gpu::is_test_mode(), "Test mode should be disabled");
    }

    #[tokio::test]
    async fn test_gpu_error_simulation() {
        set_gpu_test_mode(true);
        simulate_error(true);

        let result = detect_gpu().await;
        assert!(result.is_err(), "Should return error when simulation is enabled");

        simulate_error(false);
        set_gpu_test_mode(false);
    }
} 