/// Hardware detection and monitoring module
/// 
/// This module provides functionality to detect and monitor system hardware capabilities,
/// including CPU information and memory usage. It's designed to work cross-platform and
/// provides real-time system resource information.
pub mod hardware {
    use sysinfo::{CpuExt, System, SystemExt};
    use serde::{Serialize, Deserialize};
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

pub mod gpu;
pub mod commands;

#[cfg(test)]
mod tests {
    use super::*;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
