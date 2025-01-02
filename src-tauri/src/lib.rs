/// Hardware detection and monitoring module
/// 
/// This module provides functionality to detect and monitor system hardware capabilities,
/// including CPU information and memory usage. It's designed to work cross-platform and
/// provides real-time system resource information.
pub mod hardware {
    use sysinfo::{CpuExt, System, SystemExt};
    use serde::{Serialize, Deserialize};
    use std::num::NonZeroU64;
    use std::time::Duration;
    use std::thread;

    /// Custom error type for hardware-related operations
    #[derive(Debug, Serialize, Deserialize)]
    pub enum HardwareError {
        /// CPU-related errors
        CpuError(String),
        /// Memory-related errors
        MemoryError(String),
        /// System compatibility errors
        CompatibilityError(String),
        /// General system errors
        SystemError(String),
    }

    impl std::fmt::Display for HardwareError {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            match self {
                HardwareError::CpuError(msg) => write!(f, "CPU Error: {}", msg),
                HardwareError::MemoryError(msg) => write!(f, "Memory Error: {}", msg),
                HardwareError::CompatibilityError(msg) => write!(f, "Compatibility Error: {}", msg),
                HardwareError::SystemError(msg) => write!(f, "System Error: {}", msg),
            }
        }
    }

    /// System compatibility requirements
    #[derive(Debug, Serialize, Deserialize)]
    pub struct SystemRequirements {
        min_cpu_cores: usize,
        min_memory_kb: u64,
        supported_platforms: Vec<String>,
    }

    impl Default for SystemRequirements {
        fn default() -> Self {
            Self {
                min_cpu_cores: 2,
                min_memory_kb: 4 * 1024 * 1024, // 4GB
                supported_platforms: vec![
                    "windows".to_string(),
                    "macos".to_string(),
                    "linux".to_string(),
                ],
            }
        }
    }

    /// Represents the system hardware information
    #[derive(Debug, Serialize, Deserialize, PartialEq)]
    pub struct HardwareInfo {
        #[serde(rename = "cpuCount")]
        pub cpu_count: usize,
        #[serde(rename = "cpuBrand")]
        pub cpu_brand: String,
        #[serde(rename = "memoryTotal")]
        pub memory_total: u64,
        #[serde(rename = "memoryUsed")]
        pub memory_used: u64,
        pub platform: String,
    }

    impl HardwareInfo {
        /// Validates the hardware information
        pub fn validate(&self) -> Result<(), HardwareError> {
            if self.cpu_count == 0 {
                return Err(HardwareError::CpuError("Invalid CPU count".to_string()));
            }

            if self.cpu_brand.trim().is_empty() {
                return Err(HardwareError::CpuError("Invalid CPU brand information".to_string()));
            }

            if self.memory_total == 0 {
                return Err(HardwareError::MemoryError("Invalid total memory value".to_string()));
            }

            if self.memory_used > self.memory_total {
                return Err(HardwareError::MemoryError("Used memory exceeds total memory".to_string()));
            }

            Ok(())
        }

        /// Checks if the hardware meets the minimum requirements
        pub fn meets_requirements(&self, reqs: &SystemRequirements) -> Result<(), HardwareError> {
            if self.cpu_count < reqs.min_cpu_cores {
                return Err(HardwareError::CompatibilityError(
                    format!("Insufficient CPU cores. Required: {}, Available: {}", 
                        reqs.min_cpu_cores, self.cpu_count)
                ));
            }
            if self.memory_total < reqs.min_memory_kb {
                return Err(HardwareError::CompatibilityError(
                    format!("Insufficient memory. Required: {} KB, Available: {} KB", 
                        reqs.min_memory_kb, self.memory_total)
                ));
            }

            // Map platform names for compatibility check
            let platform_to_check = match self.platform.as_str() {
                "darwin" => "macos",
                other => other,
            };

            if !reqs.supported_platforms.iter().any(|p| p == platform_to_check) {
                return Err(HardwareError::CompatibilityError(
                    format!("Unsupported platform: {}. Supported platforms: {}", 
                        self.platform, reqs.supported_platforms.join(", "))
                ));
            }
            Ok(())
        }
    }

    /// Maximum number of retries for hardware info retrieval
    const MAX_RETRIES: u32 = 3;
    /// Delay between retries in milliseconds
    const RETRY_DELAY_MS: u64 = 1000;

    /// Retrieves current hardware information with retry logic
    pub fn get_hardware_info() -> Result<HardwareInfo, HardwareError> {
        let mut last_error = None;
        for attempt in 1..=MAX_RETRIES {
            match try_get_hardware_info() {
                Ok(info) => {
                    // Validate the information
                    if let Err(e) = info.validate() {
                        last_error = Some(e);
                        if attempt == MAX_RETRIES {
                            break;
                        }
                        thread::sleep(Duration::from_millis(RETRY_DELAY_MS));
                        continue;
                    }
                    return Ok(info);
                }
                Err(e) => {
                    last_error = Some(e);
                    if attempt == MAX_RETRIES {
                        break;
                    }
                    thread::sleep(Duration::from_millis(RETRY_DELAY_MS));
                }
            }
        }

        Err(last_error.unwrap_or_else(|| 
            HardwareError::SystemError("Failed to retrieve hardware information after multiple attempts".to_string())
        ))
    }

    /// Internal function to attempt hardware info retrieval
    fn try_get_hardware_info() -> Result<HardwareInfo, HardwareError> {
        let mut sys = System::new_all();
        
        // Refresh system information multiple times to ensure accuracy
        for _ in 0..3 {
            sys.refresh_all();
            thread::sleep(Duration::from_millis(100));
        }

        // Get CPU information with error handling
        let cpu_count = sys.cpus().len();
        if cpu_count == 0 {
            return Err(HardwareError::CpuError("No CPU cores detected".to_string()));
        }

        let cpu_brand = sys.cpus()
            .first()
            .map(|cpu| cpu.brand().trim().to_string())
            .filter(|brand| !brand.is_empty())
            .ok_or_else(|| HardwareError::CpuError("Failed to retrieve CPU information".to_string()))?;

        // Get memory information with error handling
        let memory_total = sys.total_memory();
        let memory_used = sys.used_memory();

        if memory_total == 0 {
            return Err(HardwareError::MemoryError("Failed to detect system memory".to_string()));
        }

        // Get platform information with proper mapping for macOS
        let platform = match std::env::consts::OS {
            "macos" => "macos".to_string(),
            os => os.to_string(),
        };

        let info = HardwareInfo {
            cpu_count,
            cpu_brand,
            memory_total,
            memory_used,
            platform,
        };

        // Validate before returning
        info.validate()?;
        Ok(info)
    }

    /// Checks if the system is compatible with the application
    pub fn check_system_compatibility() -> Result<(), HardwareError> {
        let info = get_hardware_info()?;
        info.meets_requirements(&SystemRequirements::default())
    }
}

#[cfg(test)]
mod tests {
    use super::hardware::{self, HardwareInfo, HardwareError, SystemRequirements};
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
    fn test_system_compatibility() {
        let result = hardware::check_system_compatibility();
        assert!(result.is_ok(), "System should meet minimum requirements");
    }

    #[test]
    fn test_custom_requirements() {
        let info = hardware::get_hardware_info().expect("Should get hardware info");
        let reqs = SystemRequirements {
            min_cpu_cores: info.cpu_count + 1, // Impossible requirement
            min_memory_kb: 1024,
            supported_platforms: vec!["windows".to_string(), "macos".to_string()],
        };
        let result = info.meets_requirements(&reqs);
        assert!(result.is_err(), "Should fail with impossible CPU requirement");
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
            platform: "windows".to_string(),
        };
        assert!(invalid_cpu.validate().is_err(), "Should fail with zero CPU count");

        // Test invalid CPU brand
        let invalid_brand = HardwareInfo {
            cpu_count: 1,
            cpu_brand: "".to_string(),
            memory_total: 1024,
            memory_used: 512,
            platform: "windows".to_string(),
        };
        assert!(invalid_brand.validate().is_err(), "Should fail with empty CPU brand");

        // Test invalid memory total
        let invalid_memory = HardwareInfo {
            cpu_count: 1,
            cpu_brand: "Test CPU".to_string(),
            memory_total: 0,
            memory_used: 0,
            platform: "windows".to_string(),
        };
        assert!(invalid_memory.validate().is_err(), "Should fail with zero total memory");

        // Test invalid memory usage
        let invalid_usage = HardwareInfo {
            cpu_count: 1,
            cpu_brand: "Test CPU".to_string(),
            memory_total: 1024,
            memory_used: 2048,
            platform: "windows".to_string(),
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
