// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use homewiseai::hardware::{self, HardwareInfo};

#[tauri::command]
fn get_hardware_info() -> Result<HardwareInfo, String> {
    hardware::get_hardware_info().map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_hardware_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
