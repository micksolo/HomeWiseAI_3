use crate::gpu::{GpuDetector, GpuInfo};
use crate::gpu::nvidia::NvidiaGpuDetector;

#[tauri::command]
pub async fn detect_gpu() -> Result<GpuInfo, String> {
    let detector = NvidiaGpuDetector::new();
    detector.detect_gpu().map_err(|e| e.to_string())
} 