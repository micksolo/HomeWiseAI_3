# Device Compatibility List

## Overview

This document lists all devices that have been tested and verified to work with HomeWise AI. Devices are categorized by protocol and type, with specific notes about functionality and requirements.

## Matter Devices

### Lighting

| Brand    | Model             | Features                  | Requirements         | Status             |
| -------- | ----------------- | ------------------------- | -------------------- | ------------------ |
| Philips  | Hue Bridge Matter | Full control, scenes      | Matter controller    | ✅ Fully supported |
| Nanoleaf | Essentials A19    | Brightness, color, scenes | Direct connection    | ✅ Fully supported |
| IKEA     | TRÅDFRI LED       | Basic control             | Matter controller    | ✅ Fully supported |
| Eve      | Light Strip       | Full RGB, scenes          | Thread border router | ✅ Fully supported |

### Switches & Plugs

| Brand  | Model             | Features         | Requirements         | Status             |
| ------ | ----------------- | ---------------- | -------------------- | ------------------ |
| Eve    | Energy Smart Plug | Power monitoring | Thread border router | ✅ Fully supported |
| Meross | Smart Plug        | Basic control    | Direct connection    | ✅ Fully supported |
| Wemo   | Smart Plug        | Power monitoring | Matter controller    | ✅ Fully supported |
| Aqara  | Smart Plug        | Basic control    | Matter controller    | ⚠️ Basic support   |

### Sensors

| Brand   | Model           | Features              | Requirements         | Status             |
| ------- | --------------- | --------------------- | -------------------- | ------------------ |
| Eve     | Room Sensor     | Temperature, humidity | Thread border router | ✅ Fully supported |
| Aqara   | Door Sensor     | Contact sensing       | Matter controller    | ✅ Fully supported |
| Netatmo | Weather Station | Multiple sensors      | Matter controller    | ⚠️ Basic support   |

## Thread Devices

### Lighting

| Brand    | Model            | Features             | Requirements  | Status             |
| -------- | ---------------- | -------------------- | ------------- | ------------------ |
| Nanoleaf | Shapes           | Full control, scenes | Border router | ✅ Fully supported |
| Eve      | Light Switch     | Basic control        | Border router | ✅ Fully supported |
| IKEA     | TRÅDFRI (Thread) | Basic control        | Border router | ⚠️ Basic support   |

### Sensors

| Brand | Model              | Features              | Requirements  | Status             |
| ----- | ------------------ | --------------------- | ------------- | ------------------ |
| Eve   | Motion Sensor      | Motion, light level   | Border router | ✅ Fully supported |
| Eve   | Door Sensor        | Contact sensing       | Border router | ✅ Fully supported |
| Aqara | Temperature Sensor | Temperature, humidity | Border router | ✅ Fully supported |

### Controllers

| Brand    | Model             | Features      | Requirements | Status             |
| -------- | ----------------- | ------------- | ------------ | ------------------ |
| Apple    | HomePod mini      | Border router | WiFi         | ✅ Fully supported |
| Eve      | Border Router     | Border router | Ethernet     | ✅ Fully supported |
| Nanoleaf | Shapes Controller | Border router | WiFi         | ✅ Fully supported |

## Zigbee Devices

### Lighting

| Brand   | Model        | Features      | Requirements       | Status             |
| ------- | ------------ | ------------- | ------------------ | ------------------ |
| Philips | Hue Bulb     | Full control  | Zigbee coordinator | ✅ Fully supported |
| IKEA    | TRÅDFRI Bulb | Basic control | Zigbee coordinator | ✅ Fully supported |
| Sengled | Smart Bulb   | Basic control | Zigbee coordinator | ✅ Fully supported |
| Innr    | Smart Bulb   | Full control  | Zigbee coordinator | ⚠️ Basic support   |

### Sensors

| Brand       | Model          | Features         | Requirements       | Status             |
| ----------- | -------------- | ---------------- | ------------------ | ------------------ |
| Aqara       | Motion Sensor  | Motion, light    | Zigbee coordinator | ✅ Fully supported |
| IKEA        | TRÅDFRI Motion | Motion only      | Zigbee coordinator | ✅ Fully supported |
| SmartThings | Multipurpose   | Multiple sensors | Zigbee coordinator | ✅ Fully supported |

### Controllers

| Brand   | Model       | Features    | Requirements | Status             |
| ------- | ----------- | ----------- | ------------ | ------------------ |
| ConBee  | II          | Coordinator | USB          | ✅ Fully supported |
| Sonoff  | ZBBridge    | Coordinator | Ethernet     | ✅ Fully supported |
| TubesZB | Coordinator | Coordinator | USB          | ✅ Fully supported |

## WiFi Devices

### Lighting

| Brand    | Model           | Features      | Requirements | Status             |
| -------- | --------------- | ------------- | ------------ | ------------------ |
| TP-Link  | Kasa Smart Bulb | Full control  | Local API    | ✅ Fully supported |
| Yeelight | Smart Bulb      | Full control  | Local API    | ✅ Fully supported |
| Tuya     | Smart Bulb      | Basic control | Local API    | ⚠️ Basic support   |

### Appliances

| Brand   | Model   | Features         | Requirements | Status             |
| ------- | ------- | ---------------- | ------------ | ------------------ |
| Shelly  | 1PM     | Power monitoring | Local API    | ✅ Fully supported |
| Tasmota | Generic | Full control     | Local API    | ✅ Fully supported |
| ESPHome | Generic | Full control     | Local API    | ✅ Fully supported |

### Security

| Brand   | Model      | Features      | Requirements | Status             |
| ------- | ---------- | ------------- | ------------ | ------------------ |
| Reolink | E1 Pro     | Video, motion | RTSP         | ✅ Fully supported |
| Amcrest | IP Camera  | Video, motion | RTSP         | ✅ Fully supported |
| UniFi   | Protect G4 | Video, motion | Local API    | ⚠️ Basic support   |

## Requirements

### Matter Controller

- Thread border router capability
- Matter certification
- Ethernet or WiFi connectivity

### Thread Border Router

- Ethernet connectivity recommended
- Power supply (non-battery)
- Thread certification

### Zigbee Coordinator

- USB or Ethernet connectivity
- Zigbee 3.0 support
- Sufficient range for network

### Network Requirements

- Local network access
- DHCP server
- mDNS support
- Multicast support

## Adding New Devices

To request support for a new device:

1. Check the [GitHub issues](https://github.com/homewise-ai/issues) for existing requests
2. Create a new issue with:
   - Device details (brand, model, protocol)
   - Link to device specifications
   - Use case description
3. Label the issue with "device-request"

## Status Definitions

- ✅ **Fully Supported**: All features work reliably
- ⚠️ **Basic Support**: Core features work, some limitations
- ❌ **Not Supported**: Known incompatibility issues
- 🔄 **In Development**: Support coming in future release

## Contributing

To contribute device support:

1. Read the [Contributing Guidelines](../../development/CONTRIBUTING.md)
2. Follow the [Device Integration Guide](./DEVICE_INTEGRATION.md)
3. Submit a pull request with:
   - Device implementation
   - Test cases
   - Documentation updates
