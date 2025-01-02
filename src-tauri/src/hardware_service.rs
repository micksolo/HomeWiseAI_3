use serde::Serialize;
use std::sync::Arc;
use sysinfo::{CpuExt, System, SystemExt};
use chrono::Utc;

#[derive(Debug, Serialize)]
pub struct HardwareInfo {
    #[serde(rename = "cpuCount")]
    pub cpu_count: i32,
    #[serde(rename = "cpuBrand")]
    pub cpu_brand: String,
    #[serde(rename = "memoryTotal")]
    pub memory_total: u64,
    #[serde(rename = "memoryUsed")]
    pub memory_used: u64,
    pub platform: String,
}

pub struct HardwareService {
    sys: Arc<System>,
}

impl HardwareService {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self {
            sys: Arc::new(sys),
        }
    }

    pub fn get_hardware_info(&self) -> HardwareInfo {
        let mut sys = System::new_all();
        sys.refresh_all();
        
        HardwareInfo {
            cpu_count: sys.cpus().len() as i32,
            cpu_brand: sys.cpus()[0].brand().to_string(),
            memory_total: sys.total_memory(),
            memory_used: sys.used_memory(),
            platform: std::env::consts::OS.to_string(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::thread;
    use std::time::Duration;

    #[test]
    fn test_hardware_service() {
        let service = HardwareService::new();
        let info = service.get_hardware_info();

        // Basic validation
        assert!(info.cpu_count > 0);
        assert!(!info.cpu_brand.is_empty());
        assert!(info.memory_used <= info.memory_total);
        assert!(!info.platform.is_empty());

        // Test multiple readings
        let info1 = service.get_hardware_info();
        thread::sleep(Duration::from_millis(100));
        let info2 = service.get_hardware_info();

        // Values should be consistent
        assert_eq!(info1.cpu_count, info2.cpu_count);
        assert_eq!(info1.cpu_brand, info2.cpu_brand);
        assert_eq!(info1.platform, info2.platform);
    }
} 