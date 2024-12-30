# Enhancing Local File Indexing

## 1. Overview

While **drag-and-drop** document ingestion is simple for many users, some may prefer or require a more direct way to **index files or folders**. This implementation leverages Tauri's native file system capabilities and Rust's performance advantages.

## 2. Technical Implementation

### File System Integration
- Use Tauri's native file system APIs for direct access
- Implement file watchers using Rust's `notify` crate
- Handle OS-specific paths and permissions via Tauri's abstraction layer

### Frontend Components (React + TypeScript)
```typescript
// FileUpload.tsx
interface FileUploadProps {
  onFilesSelected: (files: string[]) => Promise<void>;
  allowedTypes: string[];
}

// FolderMonitor.tsx
interface FolderConfig {
  path: string;
  watchEnabled: boolean;
  filters: string[];
}
```

### Backend Services (Rust)
```rust
// file_watcher.rs
pub struct FolderWatcher {
    path: PathBuf,
    filters: Vec<String>,
    watcher: RecommendedWatcher,
}

// indexing_service.rs
pub struct IndexingService {
    db: SqliteConnection,
    vector_store: FAISSIndex,
}
```

## 3. User Interface Features

1. **Document Selection**
   - MUI-based file picker dialog
   - Drag-and-drop zone using react-dropzone
   - Progress indicators using MUI LinearProgress

2. **Folder Management**
   - Tree view for folder structure
   - Quick-access shortcuts
   - Watch status indicators

3. **Search and Navigation**
   - Path autocomplete with MUI Autocomplete
   - Recent folders list
   - Favorite locations

## 4. Technical Considerations

### Performance
- Implement batch processing for large folders
- Use Rust's async/await for non-blocking operations
- Leverage SQLite for file metadata caching
- FAISS for efficient embedding storage

### Security
- File access through Tauri's security model
- Encryption of cached metadata
- Secure storage of watch paths
- Sandboxed file operations

### Resource Management
- Configurable watcher limits
- Automatic cleanup of unused indexes
- Memory-efficient file reading
- Background processing for large operations

## 5. Implementation Steps

1. **Core Infrastructure**
```rust
// Rust backend
pub async fn setup_file_watcher(path: PathBuf) -> Result<()> {
    let watcher = notify::recommended_watcher(|res| {
        match res {
            Ok(event) => handle_fs_event(event),
            Err(e) => log::error!("Watch error: {:?}", e),
        }
    })?;
    watcher.watch(&path, RecursiveMode::Recursive)?;
    Ok(())
}
```

2. **Frontend Integration**
```typescript
// React component
const FileManager: React.FC = () => {
  const [watchedFolders, setWatchedFolders] = useState<FolderConfig[]>([]);
  
  const handleFolderSelect = async () => {
    const selected = await invoke('select_folder');
    if (selected) {
      await invoke('setup_file_watcher', { path: selected });
      setWatchedFolders(prev => [...prev, { 
        path: selected, 
        watchEnabled: true,
        filters: ['*.pdf', '*.docx']
      }]);
    }
  };
  
  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<FolderIcon />}
        onClick={handleFolderSelect}
      >
        Add Folder
      </Button>
      <WatchedFoldersList folders={watchedFolders} />
    </Box>
  );
};
```

3. **Database Schema**
```sql
CREATE TABLE watched_folders (
    id INTEGER PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    watch_enabled BOOLEAN DEFAULT true,
    last_scan DATETIME,
    filters TEXT
);

CREATE TABLE file_metadata (
    id INTEGER PRIMARY KEY,
    path TEXT NOT NULL UNIQUE,
    last_modified DATETIME,
    size INTEGER,
    indexed_at DATETIME
);
```

## 6. Error Handling

1. **User-Facing Errors**
   - Clear error messages via MUI Snackbar
   - Retry options for failed operations
   - Detailed logging for troubleshooting

2. **System Errors**
   - Graceful degradation of watch service
   - Automatic recovery attempts
   - Error reporting to main process

## 7. Future Enhancements

1. **Advanced Features**
   - Smart folder suggestions
   - Content-based organization
   - Advanced filtering options

2. **Performance Optimizations**
   - Incremental updates
   - Parallel processing
   - Compressed storage

3. **User Experience**
   - Custom folder icons
   - Folder statistics
   - Health monitoring
