# LLM Integration

## Overview

HomeWise AI integrates local Large Language Models (LLMs) to provide AI assistance while maintaining privacy and performance.

## Features

### 1. Model Management

- Local model loading
  ```rust
  pub struct ModelManager {
      models: HashMap<String, Model>,
      active_model: String,
      config: ModelConfig,
  }
  ```
- Model switching with state preservation
  ```rust
  impl ModelManager {
      pub async fn switch_model(&mut self, model_id: &str) -> Result<()> {
          self.save_state()?;
          self.load_model(model_id).await?;
          self.restore_state()?;
          Ok(())
      }
  }
  ```
- Memory optimization
  ```rust
  #[derive(Debug, Clone)]
  pub struct MemoryConfig {
      max_ram_usage: usize,      // Maximum RAM usage in bytes
      page_size: usize,          // Memory page size
      cache_size: usize,         // Model cache size
      prefetch_size: usize,      // Prefetch buffer size
  }
  ```

### 2. Inference

- Efficient text generation
  ```rust
  pub struct InferenceParams {
      temperature: f32,          // 0.0 to 1.0
      top_p: f32,               // 0.0 to 1.0
      top_k: u32,               // Typically 40
      max_tokens: usize,        // Maximum response length
      stop_tokens: Vec<String>, // Stop generation tokens
  }
  ```
- Context management
  ```rust
  pub struct Context {
      messages: VecDeque<Message>,
      max_length: usize,
      current_length: usize,
      metadata: HashMap<String, Value>,
  }
  ```

### 3. Integration

- Error handling
  ```rust
  #[derive(Error, Debug)]
  pub enum LLMError {
      #[error("Model not found: {0}")]
      ModelNotFound(String),

      #[error("Out of memory: needed {needed} bytes, available {available} bytes")]
      OutOfMemory { needed: usize, available: usize },

      #[error("Invalid configuration: {0}")]
      InvalidConfig(String),

      #[error("Inference error: {0}")]
      InferenceError(String),
  }
  ```

## Hardware Requirements

| Component | Minimum       | Recommended   | Optimal           |
| --------- | ------------- | ------------- | ----------------- |
| RAM       | 8GB           | 16GB          | 32GB+             |
| CPU       | 4 cores, AVX2 | 8 cores, AVX2 | 12+ cores, AVX512 |
| Storage   | 20GB SSD      | 100GB NVMe    | 500GB+ NVMe       |
| GPU       | Optional      | 8GB VRAM      | 16GB+ VRAM        |

## Recommended Models

| Model           | Size | RAM Required | Use Case         |
| --------------- | ---- | ------------ | ---------------- |
| Llama-2-7B-Q4   | 4GB  | 8GB          | General purpose  |
| Mistral-7B-Q5   | 5GB  | 10GB         | Better reasoning |
| CodeLlama-7B-Q4 | 4GB  | 8GB          | Code assistance  |
| Phi-2-Q4        | 2GB  | 4GB          | Light deployment |

## Performance Optimization

### Memory Management

```rust
impl ModelManager {
    pub fn optimize_memory(&mut self) -> Result<()> {
        // Unload unused model parts
        self.unload_unused_layers()?;

        // Compact memory
        self.compact_tensors()?;

        // Adjust cache size
        self.adjust_cache_size()?;

        Ok(())
    }
}
```

### Error Handling Examples

```rust
pub async fn generate_response(&self, prompt: &str) -> Result<String, LLMError> {
    // Check memory
    let required_mem = self.estimate_memory_required(prompt)?;
    if !self.has_sufficient_memory(required_mem) {
        return Err(LLMError::OutOfMemory {
            needed: required_mem,
            available: self.available_memory(),
        });
    }

    // Generate response
    match self.model.generate(prompt).await {
        Ok(response) => Ok(response),
        Err(e) => Err(LLMError::InferenceError(e.to_string())),
    }
}
```

## Development

### Model Integration Example

```rust
#[tauri::command]
async fn load_model(model_id: &str) -> Result<(), String> {
    let manager = MODEL_MANAGER.lock().await;
    manager
        .load_model(model_id)
        .await
        .map_err(|e| e.to_string())
}
```

### Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_model_loading() {
        let manager = ModelManager::new();
        let result = manager.load_model("llama-2-7b-q4").await;
        assert!(result.is_ok());
    }
}
```

## Security

### Memory Safety

```rust
impl Drop for Model {
    fn drop(&mut self) {
        // Ensure memory is properly freed
        unsafe {
            if !self.weights.is_null() {
                libc::free(self.weights as *mut libc::c_void);
            }
        }
    }
}
```

## Documentation

### API Examples

```rust
/// Generate a response from the model
#[tauri::command]
pub async fn generate(
    prompt: String,
    params: InferenceParams,
) -> Result<String, String> {
    let model = get_model()?;
    model.generate(&prompt, &params)
        .await
        .map_err(|e| e.to_string())
}
```
