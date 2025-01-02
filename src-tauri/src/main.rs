// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::info;
use std::sync::Once;
use std::io::Write;

mod commands;
mod gpu;
mod hardware;

static INIT: Once = Once::new();

#[tokio::main]
async fn main() {
    // Initialize logging
    INIT.call_once(|| {
        env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
            .format(|buf, record| {
                writeln!(
                    buf,
                    "{} [{}] {}",
                    chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f"),
                    record.level(),
                    record.args()
                )
            })
            .init();
    });

    info!("Starting application");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::detect_gpu,
            commands::set_gpu_test_mode,
            commands::is_gpu_test_mode,
            commands::simulate_error,
            commands::get_hardware_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
