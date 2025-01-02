use log::info;
use std::sync::atomic::{AtomicBool, Ordering};

#[derive(Debug, Clone, serde::Serialize, PartialEq)]
pub enum GpuType {
    Apple,
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

// Use atomic booleans for thread-safe state
static TEST_MODE: AtomicBool = AtomicBool::new(false);
static ERROR_SIMULATION: AtomicBool = AtomicBool::new(false);

pub fn set_test_mode(enabled: bool) {
    TEST_MODE.store(enabled, Ordering::SeqCst);
    info!("Test mode set to: {}", enabled);
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_test_mode() {
        assert!(!is_test_mode(), "Test mode should be disabled by default");
        
        set_test_mode(true);
        assert!(is_test_mode(), "Test mode should be enabled");
        
        set_test_mode(false);
        assert!(!is_test_mode(), "Test mode should be disabled");
    }

    #[test]
    fn test_error_simulation() {
        assert!(!is_error_simulation(), "Error simulation should be disabled by default");
        
        simulate_error(true);
        assert!(is_error_simulation(), "Error simulation should be enabled");
        
        simulate_error(false);
        assert!(!is_error_simulation(), "Error simulation should be disabled");
    }
} 