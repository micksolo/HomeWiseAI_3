# Frequently Asked Questions (FAQ)

## General

### What is HomeWise AI?

HomeWise AI is a privacy-focused home automation system that uses local AI models to provide intelligent control and automation of your home devices while keeping all data on your local network.

### What makes HomeWise AI different from other home automation systems?

- Fully local processing - no cloud dependencies
- Privacy-first approach with local AI models
- Support for multiple home automation protocols (Matter, Thread, Zigbee, WiFi)
- Open-source and extensible architecture

### What platforms does HomeWise AI support?

HomeWise AI runs on:

- Windows 10 and 11
- macOS 11 and newer
- Linux (Ubuntu 20.04+ and other major distributions)

## Installation

### What are the system requirements?

Minimum requirements:

- CPU: 4 cores with AVX2 support
- RAM: 8GB
- Storage: 20GB SSD
- Network: WiFi/Ethernet

Recommended:

- CPU: 8+ cores with AVX2
- RAM: 16GB+
- Storage: 100GB+ NVMe
- Network: Gigabit Ethernet

### How do I install HomeWise AI?

1. Download the latest release for your platform
2. Run the installer
3. Follow the initial setup wizard
4. Start discovering and adding devices

### Can I run HomeWise AI in a virtual machine?

Yes, but with limitations:

- USB device passthrough needed for certain protocols
- Performance may be reduced
- Hardware acceleration may not be available

## Device Support

### What device protocols are supported?

HomeWise AI supports:

- Matter
- Thread
- Zigbee
- WiFi
- Bluetooth (coming soon)

### How do I add a new device?

1. Go to Device Management
2. Click "Add Device"
3. Select the protocol
4. Follow the device-specific pairing instructions

### What if my device isn't supported?

- Check our [device compatibility list](../features/home-automation/DEVICES.md)
- Request support in our GitHub issues
- Consider using a supported protocol bridge

## AI Features

### What AI models are included?

HomeWise AI includes:

- Llama-2-7B-Q4 (general purpose)
- Mistral-7B-Q5 (better reasoning)
- CodeLlama-7B-Q4 (automation scripting)
- Phi-2-Q4 (light deployment)

### How much RAM do the AI models require?

Model RAM requirements:

- Llama-2-7B-Q4: 8GB
- Mistral-7B-Q5: 10GB
- CodeLlama-7B-Q4: 8GB
- Phi-2-Q4: 4GB

### Can I use my own AI models?

Yes, HomeWise AI supports:

- GGML format models
- ONNX format models
- Custom quantized models

## Security

### Is my data secure?

Yes:

- All data stays local
- End-to-end encryption
- Regular security audits
- No cloud transmission

### How are device credentials stored?

- Encrypted at rest
- Hardware-backed key storage where available
- Regular key rotation
- Secure credential management

### Can I backup my configuration?

Yes:

- Encrypted backup support
- Local backup storage
- Optional removable media backup
- Configuration export/import

## Automation

### How do I create automation rules?

1. Go to Automation
2. Click "New Rule"
3. Select triggers and conditions
4. Define actions
5. Test and enable the rule

### What types of automation are supported?

- Time-based scheduling
- Device state triggers
- Sensor-based conditions
- Scene activation
- Custom scripts

### Can I import existing automations?

Yes, from:

- Home Assistant
- OpenHAB
- Node-RED
- Custom JSON format

## Troubleshooting

### How do I report issues?

1. Check existing issues on GitHub
2. Gather logs and system information
3. Create a detailed bug report
4. Follow up with requested information

### Where can I find logs?

Logs are located at:

- Windows: `%APPDATA%/homewise-ai/logs`
- macOS: `~/Library/Logs/homewise-ai`
- Linux: `~/.local/share/homewise-ai/logs`

### How do I reset the system?

1. Backup your configuration
2. Go to Settings > System
3. Choose Reset Options
4. Select reset type (soft/hard)
5. Follow reset procedure

## Development

### How can I contribute?

1. Read [Contributing Guidelines](../development/CONTRIBUTING.md)
2. Fork the repository
3. Set up development environment
4. Submit pull requests

### What technologies are used?

- Frontend: React, TypeScript, Vite
- Backend: Rust, Tauri
- Database: SQLite
- AI: GGML, ONNX Runtime

### How do I set up the development environment?

1. Install prerequisites (Node.js, Rust)
2. Clone the repository
3. Install dependencies
4. Configure environment
5. Start development server
