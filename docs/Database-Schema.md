# Database Schema

## Overview

HomeWise AI uses SQLite for local data storage, with a focus on efficient document indexing and AI model management.

## Schema Design

### Documents

```sql
CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_accessed_at TIMESTAMP,
    metadata JSON,
    content_hash TEXT
);

CREATE INDEX idx_documents_path ON documents(path);
CREATE INDEX idx_documents_type ON documents(type);
```

### Document Content

```sql
CREATE TABLE document_chunks (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding BLOB,
    metadata JSON,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX idx_chunks_document ON document_chunks(document_id);
```

### Models

```sql
CREATE TABLE models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    format TEXT NOT NULL,
    size INTEGER NOT NULL,
    path TEXT NOT NULL,
    hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP,
    metadata JSON
);

CREATE INDEX idx_models_format ON models(format);
```

### Model Configuration

```sql
CREATE TABLE model_configs (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSON NOT NULL,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_model_configs ON model_configs(model_id, key);
```

### Chat History

```sql
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    title TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    metadata JSON
);

CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    metadata JSON,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

### System Settings

```sql
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSON NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

### Search Index

```sql
CREATE VIRTUAL TABLE search_index USING fts5 (
    content,
    document_id UNINDEXED,
    chunk_index UNINDEXED,
    metadata UNINDEXED
);
```

## Migrations

### Version Control

```sql
CREATE TABLE schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL
);
```

### Initial Migration

```sql
-- Migration: 001_initial_schema
-- Creates the base tables for the application

BEGIN TRANSACTION;

-- Create tables...

INSERT INTO schema_migrations (version, applied_at)
VALUES (1, CURRENT_TIMESTAMP);

COMMIT;
```

## Indexes

### Performance Indexes

```sql
-- Document access patterns
CREATE INDEX idx_documents_updated ON documents(updated_at);
CREATE INDEX idx_documents_accessed ON documents(last_accessed_at);

-- Message retrieval
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Model usage tracking
CREATE INDEX idx_models_used ON models(last_used_at);
```

## Views

### Document Statistics

```sql
CREATE VIEW document_stats AS
SELECT
    type,
    COUNT(*) as count,
    SUM(size) as total_size,
    MAX(updated_at) as last_updated
FROM documents
GROUP BY type;
```

### Recent Activity

```sql
CREATE VIEW recent_activity AS
SELECT
    'document' as type,
    id,
    name as title,
    updated_at as timestamp
FROM documents
UNION ALL
SELECT
    'conversation' as type,
    id,
    title,
    updated_at as timestamp
FROM conversations
ORDER BY timestamp DESC;
```

## Triggers

### Update Timestamps

```sql
CREATE TRIGGER documents_update_timestamp
AFTER UPDATE ON documents
BEGIN
    UPDATE documents
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;

CREATE TRIGGER conversations_update_timestamp
AFTER UPDATE ON conversations
BEGIN
    UPDATE conversations
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
```

### Search Index Updates

```sql
CREATE TRIGGER documents_search_update
AFTER INSERT ON document_chunks
BEGIN
    INSERT INTO search_index (content, document_id, chunk_index, metadata)
    VALUES (NEW.content, NEW.document_id, NEW.chunk_index, NEW.metadata);
END;
```

## Maintenance

### Cleanup

```sql
-- Remove orphaned chunks
DELETE FROM document_chunks
WHERE document_id NOT IN (SELECT id FROM documents);

-- Clean old conversations
DELETE FROM conversations
WHERE updated_at < datetime('now', '-30 days');
```

### Optimization

```sql
-- Regular optimization
PRAGMA optimize;
PRAGMA vacuum;
PRAGMA wal_checkpoint(TRUNCATE);
```
