use serde::{Deserialize, Serialize};
use std::error::Error;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum GpuType {
    Nvidia,
    Apple,
    Amd,
    None,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GpuInfo {
    pub gpu_type: GpuType,
    pub name: String,
    pub vram_mb: u32,
    pub is_available: bool,
}

pub trait GpuDetector {
    fn detect_gpu(&self) -> Result<GpuInfo, Box<dyn Error>>;
}

#[cfg(test)]
pub mod mock {
    use super::*;
    
    pub struct MockGpuDetector {
        pub mock_gpu_type: GpuType,
    }
    
    impl MockGpuDetector {
        pub fn new(gpu_type: GpuType) -> Self {
            Self {
                mock_gpu_type: gpu_type,
            }
        }
    }
    
    impl GpuDetector for MockGpuDetector {
        fn detect_gpu(&self) -> Result<GpuInfo, Box<dyn Error>> {
            match self.mock_gpu_type {
                GpuType::Nvidia => Ok(GpuInfo {
                    gpu_type: GpuType::Nvidia,
                    name: "NVIDIA RTX 3080 (Mock)".to_string(),
                    vram_mb: 10240,
                    is_available: true,
                }),
                GpuType::Apple => Ok(GpuInfo {
                    gpu_type: GpuType::Apple,
                    name: "Apple M1 Pro (Mock)".to_string(),
                    vram_mb: 8192,
                    is_available: true,
                }),
                GpuType::Amd => Ok(GpuInfo {
                    gpu_type: GpuType::Amd,
                    name: "AMD Radeon RX 6800 (Mock)".to_string(),
                    vram_mb: 16384,
                    is_available: true,
                }),
                GpuType::None => Ok(GpuInfo {
                    gpu_type: GpuType::None,
                    name: "No GPU Available".to_string(),
                    vram_mb: 0,
                    is_available: false,
                }),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use mock::MockGpuDetector;

    #[test]
    fn test_nvidia_gpu_detection() {
        let detector = MockGpuDetector::new(GpuType::Nvidia);
        let result = detector.detect_gpu().unwrap();
        assert_eq!(result.gpu_type as i32, GpuType::Nvidia as i32);
        assert!(result.is_available);
        assert!(result.vram_mb > 0);
    }

    #[test]
    fn test_apple_gpu_detection() {
        let detector = MockGpuDetector::new(GpuType::Apple);
        let result = detector.detect_gpu().unwrap();
        assert_eq!(result.gpu_type as i32, GpuType::Apple as i32);
        assert!(result.is_available);
        assert!(result.vram_mb > 0);
    }

    #[test]
    fn test_amd_gpu_detection() {
        let detector = MockGpuDetector::new(GpuType::Amd);
        let result = detector.detect_gpu().unwrap();
        assert_eq!(result.gpu_type as i32, GpuType::Amd as i32);
        assert!(result.is_available);
        assert!(result.vram_mb > 0);
    }

    #[test]
    fn test_no_gpu_detection() {
        let detector = MockGpuDetector::new(GpuType::None);
        let result = detector.detect_gpu().unwrap();
        assert_eq!(result.gpu_type as i32, GpuType::None as i32);
        assert!(!result.is_available);
        assert_eq!(result.vram_mb, 0);
    }
} 