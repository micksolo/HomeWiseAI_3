use crate::gpu::{GpuDetector, GpuInfo, GpuType};
use crate::gpu::nvidia::NvidiaGpuDetector;
use crate::gpu::apple::AppleGpuDetector;

#[tauri::command]
pub async fn detect_gpu() -> Result<GpuInfo, String> {
    // Try NVIDIA first
    let nvidia_detector = NvidiaGpuDetector::new();
    match nvidia_detector.detect_gpu() {
        Ok(info) if info.is_available => Ok(info),
        _ => {
            // Try Apple Silicon
            let apple_detector = AppleGpuDetector::new();
            apple_detector.detect_gpu().map_err(|e| e.to_string())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[tokio::test]
    async fn test_detect_gpu_command() {
        let result = detect_gpu().await.unwrap();
        
        // The test should pass regardless of the environment
        // as we handle both NVIDIA and Apple Silicon cases
        assert!(matches!(
            result.gpu_type,
            GpuType::Nvidia | GpuType::Apple | GpuType::None
        ));

        if result.is_available {
            assert!(result.vram_mb > 0);
            assert!(!result.name.is_empty());
        } else {
            assert_eq!(result.vram_mb, 0);
        }
    }
} 