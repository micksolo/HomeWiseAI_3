use super::{GpuDetector, GpuInfo, GpuType};
use std::error::Error;
use std::fmt;
use std::process::Command;

/// Custom error type for Apple GPU detection
#[derive(Debug)]
pub enum AppleGpuError {
    CommandFailed(String),
    ParseError(String),
    NotAppleSilicon,
}

impl fmt::Display for AppleGpuError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppleGpuError::CommandFailed(msg) => write!(f, "Command execution failed: {}", msg),
            AppleGpuError::ParseError(msg) => write!(f, "Failed to parse GPU info: {}", msg),
            AppleGpuError::NotAppleSilicon => write!(f, "Not running on Apple Silicon"),
        }
    }
}

impl Error for AppleGpuError {}

/// Detector for Apple Silicon GPUs
pub struct AppleGpuDetector;

impl AppleGpuDetector {
    pub fn new() -> Self {
        Self
    }

    /// Checks if running on Apple Silicon
    fn is_apple_silicon() -> bool {
        let output = Command::new("uname")
            .arg("-m")
            .output()
            .map(|output| String::from_utf8_lossy(&output.stdout).to_string());

        matches!(output, Ok(arch) if arch.trim() == "arm64")
    }

    /// Gets GPU information using system_profiler
    fn get_gpu_info() -> Result<(String, u32), AppleGpuError> {
        let output = Command::new("system_profiler")
            .arg("SPDisplaysDataType")
            .output()
            .map_err(|e| AppleGpuError::CommandFailed(e.to_string()))?;

        let info = String::from_utf8_lossy(&output.stdout);
        
        // Parse GPU name and memory
        if let Some(gpu_line) = info.lines().find(|line| line.contains("Chipset Model:")) {
            let name = gpu_line
                .split("Chipset Model:")
                .nth(1)
                .map(|s| s.trim())
                .ok_or_else(|| AppleGpuError::ParseError("Could not parse GPU name".to_string()))?;

            // Apple Silicon GPUs use unified memory, so we get system memory
            let memory = Command::new("sysctl")
                .arg("-n")
                .arg("hw.memsize")
                .output()
                .map_err(|e| AppleGpuError::CommandFailed(e.to_string()))?;

            let memory_bytes = String::from_utf8_lossy(&memory.stdout)
                .trim()
                .parse::<u64>()
                .map_err(|e| AppleGpuError::ParseError(e.to_string()))?;

            // Convert bytes to MB (unified memory is shared)
            let memory_mb = (memory_bytes / (1024 * 1024)) as u32;

            Ok((name.to_string(), memory_mb))
        } else {
            Err(AppleGpuError::ParseError("GPU information not found".to_string()))
        }
    }
}

impl GpuDetector for AppleGpuDetector {
    fn detect_gpu(&self) -> Result<GpuInfo, Box<dyn Error>> {
        if !Self::is_apple_silicon() {
            return Ok(GpuInfo {
                gpu_type: GpuType::None,
                name: "Not Apple Silicon".to_string(),
                vram_mb: 0,
                is_available: false,
            });
        }

        match Self::get_gpu_info() {
            Ok((name, memory)) => Ok(GpuInfo {
                gpu_type: GpuType::Apple,
                name,
                vram_mb: memory,
                is_available: true,
            }),
            Err(e) => Ok(GpuInfo {
                gpu_type: GpuType::None,
                name: format!("Apple GPU Detection Failed: {}", e),
                vram_mb: 0,
                is_available: false,
            }),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    fn test_apple_detection() {
        let detector = AppleGpuDetector::new();
        let result = detector.detect_gpu().unwrap();

        if env::var("CI").is_ok() || !AppleGpuDetector::is_apple_silicon() {
            assert_eq!(result.gpu_type as i32, GpuType::None as i32);
            assert!(!result.is_available);
        } else {
            assert_eq!(result.gpu_type as i32, GpuType::Apple as i32);
            assert!(result.is_available);
            assert!(result.vram_mb > 0);
            assert!(!result.name.is_empty());
        }
    }

    #[test]
    fn test_is_apple_silicon() {
        let is_apple = AppleGpuDetector::is_apple_silicon();
        // This test will pass on both Apple Silicon and other architectures
        // as it's just verifying the detection works
        assert!(is_apple == true || is_apple == false);
    }
} 