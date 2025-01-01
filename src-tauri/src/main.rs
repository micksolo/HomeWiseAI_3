// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use homewiseai::hardware::{self, HardwareInfo, HardwareError};

#[tauri::command]
fn get_hardware_info() -> Result<HardwareInfo, String> {
    hardware::get_hardware_info().map_err(|e| e.to_string())
}

#[tauri::command]
fn check_system_compatibility() -> Result<(), String> {
    hardware::check_system_compatibility().map_err(|e| e.to_string())
}

fn main() {
    // Check system compatibility before starting the application
    if let Err(e) = hardware::check_system_compatibility() {
        eprintln!("System Compatibility Error: {}", e);
        std::process::exit(1);
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_hardware_info,
            check_system_compatibility
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
