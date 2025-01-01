/// Hardware detection and monitoring module
/// 
/// This module provides functionality to detect and monitor system hardware capabilities,
/// including CPU information and memory usage. It's designed to work cross-platform and
/// provides real-time system resource information.
pub mod hardware {
    use sysinfo::{CpuExt, System, SystemExt};
    use serde::{Serialize, Deserialize};
    use std::num::NonZeroU64;

    /// Represents the system hardware information
    /// 
    /// Contains information about the CPU and memory resources of the system.
    /// All memory values are in kilobytes.
    #[derive(Debug, Serialize, Deserialize, PartialEq)]
    pub struct HardwareInfo {
        /// Number of CPU cores/threads available
        pub cpu_count: usize,
        /// CPU brand string (e.g., "Intel(R) Core(TM) i7-9750H")
        pub cpu_brand: String,
        /// Total system memory in kilobytes
        pub memory_total: u64,
        /// Currently used memory in kilobytes
        pub memory_used: u64,
    }

    impl HardwareInfo {
        // Helper method to validate hardware info
        pub fn validate(&self) -> Result<(), &'static str> {
            if self.cpu_count == 0 {
                return Err("No CPU cores detected");
            }
            if self.cpu_brand.is_empty() {
                return Err("CPU brand information unavailable");
            }
            if self.memory_total == 0 {
                return Err("Total memory information unavailable");
            }
            if self.memory_used > self.memory_total {
                return Err("Memory usage exceeds total memory");
            }
            Ok(())
        }
    }

    /// Retrieves current hardware information from the system
    /// 
    /// This function provides a snapshot of the current hardware state, including:
    /// - CPU information (count and brand)
    /// - Memory usage (total and used)
    /// 
    /// # Returns
    /// 
    /// Returns a `HardwareInfo` struct containing the current hardware state
    /// 
    /// # Example
    /// 
    /// ```rust
    /// use homewiseai::hardware;
    /// 
    /// let info = hardware::get_hardware_info().expect("Failed to get hardware info");
    /// println!("CPU cores: {}", info.cpu_count);
    /// println!("Memory used: {} KB", info.memory_used);
    /// ```
    pub fn get_hardware_info() -> Result<HardwareInfo, &'static str> {
        let mut sys = System::new_all();
        sys.refresh_all();

        let info = HardwareInfo {
            cpu_count: sys.cpus().len(),
            cpu_brand: sys.cpus().first().map(|cpu| cpu.brand().to_string()).unwrap_or_default(),
            memory_total: sys.total_memory(),
            memory_used: sys.used_memory(),
        };

        info.validate()?;
        Ok(info)
    }
}

#[cfg(test)]
mod tests {
    use super::hardware::{self, HardwareInfo};
    use std::thread;
    use std::time::Duration;

    #[test]
    fn test_hardware_info_basic() {
        let info = hardware::get_hardware_info().expect("Should get hardware info");
        assert!(info.cpu_count > 0, "System should have at least one CPU core");
        assert!(!info.cpu_brand.is_empty(), "CPU brand should not be empty");
        assert!(info.memory_total > 0, "Total memory should be greater than 0");
        assert!(info.memory_used <= info.memory_total, "Used memory should not exceed total memory");
    }

    #[test]
    fn test_hardware_info_memory_consistency() {
        let info1 = hardware::get_hardware_info().expect("Should get first hardware info");
        thread::sleep(Duration::from_millis(100));
        let info2 = hardware::get_hardware_info().expect("Should get second hardware info");

        assert_eq!(info1.memory_total, info2.memory_total, "Total memory should remain constant");
        assert!(info1.cpu_count == info2.cpu_count, "CPU count should remain constant");
    }

    #[test]
    fn test_hardware_info_serialization() {
        let info = hardware::get_hardware_info().expect("Should get hardware info");
        let serialized = serde_json::to_string(&info).expect("Failed to serialize HardwareInfo");
        let deserialized: hardware::HardwareInfo = serde_json::from_str(&serialized).expect("Failed to deserialize HardwareInfo");
        
        assert_eq!(info, deserialized, "Serialization/deserialization should preserve data");
    }

    #[test]
    fn test_memory_values_sanity() {
        let info = hardware::get_hardware_info().expect("Should get hardware info");
        // Most modern systems have at least 1GB of RAM
        assert!(info.memory_total >= 1024 * 1024, "Total memory should be at least 1GB");
        // Used memory should be non-zero on a running system
        assert!(info.memory_used > 0, "Used memory should be greater than 0");
        // Used memory should not exceed total memory
        assert!(info.memory_used <= info.memory_total, "Used memory should not exceed total memory");
    }

    #[test]
    fn test_hardware_info_validation() {
        // Test invalid CPU count
        let invalid_cpu = HardwareInfo {
            cpu_count: 0,
            cpu_brand: "Test CPU".to_string(),
            memory_total: 1024,
            memory_used: 512,
        };
        assert!(invalid_cpu.validate().is_err(), "Should fail with zero CPU count");

        // Test invalid CPU brand
        let invalid_brand = HardwareInfo {
            cpu_count: 1,
            cpu_brand: "".to_string(),
            memory_total: 1024,
            memory_used: 512,
        };
        assert!(invalid_brand.validate().is_err(), "Should fail with empty CPU brand");

        // Test invalid memory total
        let invalid_memory = HardwareInfo {
            cpu_count: 1,
            cpu_brand: "Test CPU".to_string(),
            memory_total: 0,
            memory_used: 0,
        };
        assert!(invalid_memory.validate().is_err(), "Should fail with zero total memory");

        // Test invalid memory usage
        let invalid_usage = HardwareInfo {
            cpu_count: 1,
            cpu_brand: "Test CPU".to_string(),
            memory_total: 1024,
            memory_used: 2048,
        };
        assert!(invalid_usage.validate().is_err(), "Should fail when used memory exceeds total");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
