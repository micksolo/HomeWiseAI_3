use super::{GpuDetector, GpuInfo, GpuType};
use std::error::Error;
use std::process::Command;

pub struct NvidiaGpuDetector;

impl NvidiaGpuDetector {
    pub fn new() -> Self {
        Self
    }

    fn check_nvidia_smi() -> bool {
        Command::new("nvidia-smi")
            .arg("--query-gpu=name")
            .arg("--format=csv,noheader")
            .output()
            .is_ok()
    }
}

impl GpuDetector for NvidiaGpuDetector {
    fn detect_gpu(&self) -> Result<GpuInfo, Box<dyn Error>> {
        if !Self::check_nvidia_smi() {
            return Ok(GpuInfo {
                gpu_type: GpuType::None,
                name: "NVIDIA GPU Not Available".to_string(),
                vram_mb: 0,
                is_available: false,
            });
        }

        // Get GPU Name
        let name_output = Command::new("nvidia-smi")
            .arg("--query-gpu=name")
            .arg("--format=csv,noheader")
            .output()?;

        // Get VRAM
        let vram_output = Command::new("nvidia-smi")
            .arg("--query-gpu=memory.total")
            .arg("--format=csv,noheader,nounits")
            .output()?;

        let name = String::from_utf8(name_output.stdout)?
            .trim()
            .to_string();
        
        let vram_mb = String::from_utf8(vram_output.stdout)?
            .trim()
            .parse::<u32>()
            .unwrap_or(0);

        Ok(GpuInfo {
            gpu_type: GpuType::Nvidia,
            name,
            vram_mb,
            is_available: true,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    fn test_nvidia_detection() {
        let detector = NvidiaGpuDetector::new();
        let result = detector.detect_gpu().unwrap();
        
        // In CI or environments without NVIDIA GPU, it should return None type
        if env::var("CI").is_ok() || !NvidiaGpuDetector::check_nvidia_smi() {
            assert_eq!(result.gpu_type as i32, GpuType::None as i32);
            assert!(!result.is_available);
        } else {
            assert_eq!(result.gpu_type as i32, GpuType::Nvidia as i32);
            assert!(result.is_available);
            assert!(result.vram_mb > 0);
        }
    }
} 