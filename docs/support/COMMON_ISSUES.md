# Common Issues

## Installation Issues

### Application Won't Start

#### Symptoms

- Application crashes on startup
- Blank screen after launch
- Error about missing dependencies

#### Solutions

1. Check system requirements:

   ```bash
   # Windows
   systeminfo

   # macOS
   system_profiler SPHardwareDataType

   # Linux
   lscpu && free -h
   ```

2. Verify dependencies:

   ```bash
   # Check Node.js version
   node --version  # Should be 18+

   # Check Rust version
   rustc --version  # Should be stable channel

   # Check SQLite version
   sqlite3 --version  # Should be 3.39+
   ```

3. Clean installation:

   ```bash
   # Remove existing installation
   rm -rf ~/.local/share/homewise-ai

   # Clear cache
   rm -rf ~/.cache/homewise-ai

   # Reinstall
   ```

### Device Detection Failed

#### Symptoms

- USB devices not recognized
- Protocol bridges not found
- Network devices not discovered

#### Solutions

1. Check USB permissions:

   ```bash
   # Linux
   sudo usermod -a -G dialout $USER
   sudo usermod -a -G plugdev $USER

   # Reload rules
   sudo udevadm control --reload-rules
   sudo udevadm trigger
   ```

2. Verify network settings:

   ```bash
   # Check network interfaces
   ifconfig -a

   # Verify multicast
   ping -t 2 224.0.0.1
   ```

3. Protocol-specific checks:

   ```bash
   # Zigbee
   ls -l /dev/ttyUSB*

   # Matter
   avahi-browse -art
   ```

## Performance Issues

### High Memory Usage

#### Symptoms

- System slowdown
- Application unresponsive
- High RAM utilization

#### Solutions

1. Check model configuration:

   ```toml
   # config.toml
   [model]
   max_ram = "8GB"
   cache_size = "1GB"
   ```

2. Monitor resource usage:

   ```bash
   # Check memory
   top -o %MEM

   # Monitor specific process
   ps aux | grep homewise
   ```

3. Optimize settings:
   - Reduce model size
   - Adjust cache settings
   - Limit concurrent operations

### Slow Response Times

#### Symptoms

- Delayed device control
- Slow UI updates
- Automation lag

#### Solutions

1. Check network performance:

   ```bash
   # Network latency
   ping gateway_ip

   # Bandwidth test
   iperf3 -c server_ip
   ```

2. Profile application:

   ```bash
   # Enable profiling
   RUST_LOG=debug ./homewise-ai

   # Analyze logs
   grep "PERF:" homewise.log
   ```

3. Optimize database:

   ```sql
   -- Analyze queries
   EXPLAIN ANALYZE SELECT * FROM devices;

   -- Optimize tables
   VACUUM;
   ANALYZE;
   ```

## Network Issues

### Connection Problems

#### Symptoms

- Devices disconnecting
- Failed commands
- Network timeouts

#### Solutions

1. Verify network configuration:

   ```bash
   # Check network status
   networksetup -getinfo Wi-Fi

   # Verify DNS
   dig homewise.local
   ```

2. Test connectivity:

   ```bash
   # MQTT broker
   mosquitto_sub -t "homewise/#" -v

   # Device discovery
   avahi-browse -art
   ```

3. Debug network stack:

   ```bash
   # Capture traffic
   tcpdump -i any port 1883

   # Check connections
   netstat -an | grep LISTEN
   ```

### Protocol-Specific Issues

#### Matter

```bash
# Check Matter stack
matter-tool info

# Verify commissioning
matter-tool commission --code xxx
```

#### Thread

```bash
# Network diagnostics
thread-tool network

# Border router status
ot-ctl state
```

#### Zigbee

```bash
# Coordinator info
zigbee2mqtt info

# Network map
zigbee2mqtt map
```

## Database Issues

### Data Corruption

#### Symptoms

- Database errors
- Missing data
- Inconsistent state

#### Solutions

1. Backup current data:

   ```bash
   # Backup database
   sqlite3 homewise.db ".backup 'backup.db'"

   # Export data
   sqlite3 homewise.db ".dump" > dump.sql
   ```

2. Check integrity:

   ```sql
   -- Verify integrity
   PRAGMA integrity_check;

   -- Check foreign keys
   PRAGMA foreign_key_check;
   ```

3. Repair database:

   ```bash
   # Create new database
   sqlite3 new.db < dump.sql

   # Verify and recover
   sqlite3 homewise.db "VACUUM INTO 'recovered.db';"
   ```

### Migration Issues

#### Symptoms

- Version mismatch errors
- Failed updates
- Schema conflicts

#### Solutions

1. Check version:

   ```sql
   -- Get schema version
   PRAGMA user_version;

   -- List tables
   .tables
   ```

2. Manual migration:

   ```sql
   -- Apply missing migrations
   BEGIN TRANSACTION;
   -- migration steps
   COMMIT;
   ```

3. Reset and reimport:

   ```bash
   # Export data
   sqlite3 homewise.db ".dump" > backup.sql

   # Create new database
   sqlite3 new.db < schema.sql
   sqlite3 new.db < backup.sql
   ```

## AI Model Issues

### Model Loading Failures

#### Symptoms

- Model initialization errors
- Out of memory
- Incorrect quantization

#### Solutions

1. Verify model files:

   ```bash
   # Check model hash
   sha256sum model.gguf

   # Verify file size
   ls -lh model.gguf
   ```

2. Memory requirements:

   ```bash
   # Check available memory
   free -h

   # Monitor usage
   watch -n 1 'ps aux | grep llama'
   ```

3. Quantization settings:

   ```bash
   # Convert model
   llama-cpp-quantize input.gguf output.q4.gguf

   # Verify compatibility
   llama-cpp-check model.gguf
   ```

### Inference Problems

#### Symptoms

- Slow generation
- Poor quality output
- Resource exhaustion

#### Solutions

1. Adjust parameters:

   ```toml
   # config.toml
   [inference]
   temperature = 0.7
   top_p = 0.9
   max_tokens = 2048
   ```

2. Profile inference:

   ```bash
   # Enable timing
   RUST_LOG=debug,timing=trace

   # Monitor GPU
   nvidia-smi -l 1
   ```

3. Optimize context:
   ```python
   # Reduce context size
   max_context = 4096
   truncate_method = 'recent'
   ```

## Security Issues

### Authentication Failures

#### Symptoms

- Login failures
- Token expiration
- Permission denied

#### Solutions

1. Check credentials:

   ```bash
   # Verify user
   homewise-cli user verify

   # Reset password
   homewise-cli user reset-password
   ```

2. Token management:

   ```bash
   # Clear tokens
   rm -rf ~/.config/homewise/tokens

   # Generate new token
   homewise-cli token generate
   ```

3. Audit access:
   ```sql
   -- Check access logs
   SELECT * FROM access_log
   ORDER BY timestamp DESC
   LIMIT 10;
   ```

### Encryption Issues

#### Symptoms

- Decryption failures
- Key errors
- Certificate problems

#### Solutions

1. Key management:

   ```bash
   # Backup keys
   homewise-cli keys backup

   # Rotate keys
   homewise-cli keys rotate
   ```

2. Certificate verification:

   ```bash
   # Check certificate
   openssl x509 -in cert.pem -text

   # Verify chain
   openssl verify -CAfile ca.pem cert.pem
   ```

3. Reset encryption:

   ```bash
   # Generate new keys
   homewise-cli security reset-keys

   # Re-encrypt data
   homewise-cli security reencrypt
   ```
