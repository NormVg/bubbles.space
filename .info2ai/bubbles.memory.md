# Build a Filesystem-Based Long-Term Memory System for an AI Agent

You are building a standalone long-term memory engine for an AI agent inspired by Andrej Karpathy's "LLM Wiki" idea.

The memory system should treat the filesystem as the agent's brain. Instead of relying primarily on vector databases and embeddings, the agent stores knowledge as structured, human-readable Markdown documents that it can continuously maintain and evolve.

## Core Philosophy

* Memory must be:

  * Human readable
  * Inspectable and debuggable
  * Editable by both humans and agents
  * Version controllable with Git
  * Portable across systems
  * Self-organizing over time

The system should behave like a personal wiki, knowledge graph, and memory database combined.

---

# Storage Architecture

Create a filesystem-based memory vault.

Example:

```text
memory/
├── people/
├── projects/
├── preferences/
├── events/
├── learnings/
├── skills/
├── concepts/
├── daily/
├── hot/
├── archive/
├── graph/
└── system/
```

Every memory is stored as a Markdown document.

Example:

```text
projects/
└── aura-workspace.md
```

---

# Memory Document Format

Every memory file should contain YAML frontmatter.

Example:

```yaml
---
id: mem_xxxxx
title: Aura Workspace
type: project
created_at:
updated_at:
last_accessed:
importance:
confidence:
state:
aliases:
tags:
relations:
sources:
expires_at:
access_count:
---
```

Then the document body:

```md
# Title

## Summary

## Facts

## Recent Updates

## Open Questions

## Notes
```

---

# Required Memory Metadata

Each memory should support:

* Unique ID
* Title
* Type
* Created timestamp
* Updated timestamp
* Last accessed timestamp
* Access count
* Importance score (1-10)
* Confidence score (0-1)
* State:

  * active
  * archived
  * forgotten
  * invalidated
* Aliases
* Tags
* Relations
* Sources
* Optional expiration date

---

# Relations System

Memories should form a graph.

Example:

```yaml
relations:
  - projects/bubbles-space
  - people/vishnu-gupta
  - concepts/agent-memory
```

The system should support:

* Incoming links
* Outgoing links
* Graph traversal
* Related memory discovery

Generate and maintain a graph index.

---

# Aliases

A memory may have multiple names.

Example:

```yaml
aliases:
  - Aura
  - Aura Workspace
  - Jarvis Workspace
```

Aliases should prevent duplicate memories.

---

# Duplicate Prevention

Before creating a memory:

1. Search exact titles.
2. Search aliases.
3. Run fuzzy search.
4. Run semantic similarity search.
5. Ask:
   "Does this memory already exist?"

If similarity exceeds a configurable threshold:

* Update existing memory.
* Merge aliases.
* Avoid creating duplicates.

---

# Search Engine

Implement:

* Exact search
* Fuzzy search
* Full-text search
* Semantic search
* Tag search
* Relation search
* Temporal search
* Path search

---

# Agent Tools

Expose tools that the agent can call.

Examples:

```ts
memory.create()
memory.read()
memory.update()
memory.delete()
memory.search()
memory.fuzzy()
memory.related()
memory.tree()
memory.move()
memory.rename()
memory.merge()
memory.archive()
memory.expire()
memory.stats()
```

---

# Directory Tree Tool

The agent should be able to inspect the vault structure.

Example:

```text
people/
projects/
skills/
archive/
```

Also support:

* Recursive tree view
* File metadata
* Directory summaries

---

# Memory Lifecycle

Support:

* Create
* Update
* Archive
* Forget
* Invalidate
* Expire
* Restore

Memories may decay over time.

---

# Event Log

Maintain an append-only event log.

Example:

```text
events/
    2026-07-03.jsonl
```

Every operation should emit events:

```json
{
  "event": "memory_updated",
  "memory_id": "mem_xxxxx",
  "timestamp": "",
  "changes": {}
}
```

The entire memory system should be reconstructable from the event logs.

---

# Reflection and Consolidation

Implement background jobs:

### Ingestion

Creates new memories.

### Reflection

Finds new relations.

### Consolidation

Merges duplicates.

### Summarization

Compresses old information.

### Pruning

Removes low-value memories.

### Reorganization

Moves files into better locations.

### Linting

Detects inconsistencies.

---

# Retrieval Pipeline

```text
Question
↓
Hot memories
↓
Entity extraction
↓
Graph traversal
↓
Full-text search
↓
Fuzzy search
↓
Semantic search
↓
Relevant memories
↓
Context assembly
```

Embeddings are a fallback mechanism, not the primary storage layer.

---

# Technical Requirements

* TypeScript
* Fully typed APIs
* Modular architecture
* Clean code
* Unit tests
* Strong error handling
* Async filesystem operations
* Local-first design
* Git-friendly storage
* Cross-platform support

---

# Suggested Project Structure

```text
memory-engine/
├── core/
├── storage/
├── graph/
├── search/
├── retrieval/
├── ingestion/
├── reflection/
├── compiler/
├── pruning/
├── tools/
├── schemas/
├── events/
├── utils/
└── tests/
```

---

# Goal

Build a production-quality long-term memory engine that feels like an evolving wiki and knowledge graph for an AI agent rather than a traditional vector database.

The system should enable the agent to remember, learn, organize knowledge, build relationships between memories, and continuously improve its understanding over time.
