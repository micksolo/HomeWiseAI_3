use super::*;
use std::time::Instant;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_gpu_detection_performance() {
        let start = Instant::now();
        let detector = GpuDetector::new();
        let result = detector.detect_gpu();
        let duration = start.elapsed();
        
        // Detection should complete in under 100ms
        assert!(duration.as_millis() < 100, "GPU detection took too long: {:?}", duration);
        
        // Verify result contains valid data
        match result {
            Ok(info) => {
                assert!(!info.gpu_type.is_empty(), "GPU type should not be empty");
                assert!(info.vram_mb > 0, "VRAM should be greater than 0");
            },
            Err(e) => panic!("GPU detection failed: {:?}", e),
        }
    }

    #[test]
    fn test_test_mode() {
        // Enable test mode
        set_test_mode(true);
        assert!(is_test_mode(), "Test mode should be enabled");

        // Disable test mode
        set_test_mode(false);
        assert!(!is_test_mode(), "Test mode should be disabled");
    }

    #[test]
    fn test_error_simulation() {
        // Enable test mode and error simulation
        set_test_mode(true);
        simulate_error(true);

        let detector = GpuDetector::new();
        let result = detector.detect_gpu();

        // Verify error is simulated
        assert!(result.is_err(), "Should return error when simulation is enabled");

        // Clean up
        simulate_error(false);
        set_test_mode(false);
    }

    #[test]
    fn test_gpu_info_serialization() {
        let info = GpuInfo {
            gpu_type: String::from("Test GPU"),
            vram_mb: 1024,
            cuda_version: Some(String::from("11.7")),
            driver_version: Some(String::from("123.45")),
            compute_capability: Some(String::from("8.6")),
            temperature_c: Some(65),
            power_usage_w: Some(150),
            utilization_percent: Some(80),
        };

        let serialized = serde_json::to_string(&info).expect("Failed to serialize GPU info");
        let deserialized: GpuInfo = serde_json::from_str(&serialized).expect("Failed to deserialize GPU info");

        assert_eq!(info.gpu_type, deserialized.gpu_type);
        assert_eq!(info.vram_mb, deserialized.vram_mb);
        assert_eq!(info.cuda_version, deserialized.cuda_version);
        assert_eq!(info.driver_version, deserialized.driver_version);
        assert_eq!(info.compute_capability, deserialized.compute_capability);
        assert_eq!(info.temperature_c, deserialized.temperature_c);
        assert_eq!(info.power_usage_w, deserialized.power_usage_w);
        assert_eq!(info.utilization_percent, deserialized.utilization_percent);
    }

    #[test]
    fn test_mock_gpu_detector() {
        let detector = MockGpuDetector::new();
        let result = detector.detect_gpu();

        match result {
            Ok(info) => {
                assert_eq!(info.gpu_type, "Mock GPU");
                assert_eq!(info.vram_mb, 1024);
                assert_eq!(info.cuda_version, Some(String::from("11.7")));
            },
            Err(e) => panic!("Mock GPU detection failed: {:?}", e),
        }
    }
} 