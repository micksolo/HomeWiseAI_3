// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use homewiseai::hardware::{self, HardwareInfo};
use serde_json;
use std::fs::OpenOptions;
use std::io::Write;

fn log_to_file(message: &str) {
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open("app.log")
    {
        let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S");
        if let Err(e) = writeln!(file, "[{}] {}", timestamp, message) {
            eprintln!("Failed to write to log file: {}", e);
        }
    }
}

#[tauri::command]
async fn get_hardware_info() -> Result<HardwareInfo, String> {
    log_to_file("Handling get_hardware_info command");
    let result = hardware::get_hardware_info()
        .map_err(|e| {
            let error_msg = format!("Error getting hardware info: {}", e);
            log_to_file(&error_msg);
            e.to_string()
        });
    
    match &result {
        Ok(info) => {
            log_to_file(&format!("CPU Count: {}", info.cpu_count));
            log_to_file(&format!("CPU Brand: {}", info.cpu_brand));
            log_to_file(&format!("Memory Total: {} KB", info.memory_total));
            log_to_file(&format!("Memory Used: {} KB", info.memory_used));
            log_to_file(&format!("Platform: {}", info.platform));
            
            match serde_json::to_string_pretty(info) {
                Ok(json) => log_to_file(&format!("Hardware info as JSON:\n{}", json)),
                Err(e) => log_to_file(&format!("Error serializing hardware info: {}", e)),
            }
        }
        Err(e) => log_to_file(&format!("Failed to get hardware info: {}", e)),
    }
    
    result
}

fn main() {
    log_to_file("Starting application");
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_hardware_info])
        .run(context)
        .expect("error while running tauri application");
}
