# bubbles.space

## Navigation

```mermaid
graph LR
    SO[System Overview] --> CD[Frontend Components]
    SO --> DF[Data Flow & CRDT Sync]
    CD --> ER[Database Schema]
    DF --> TS[Agent Tool Sequence]
```

<!-- diagram:overview:system -->
## System Overview

```mermaid
graph TD
    subgraph ClientApp [Nuxt Client Application]
        Canvas[CanvasWorkspace.vue]
        Chat[ChatInterface.vue]
        AgentProv[AgentSessionProvider.vue]
    end
    
    subgraph NitroBackend [Nitro Server APIs]
        SyncPost[crdt/sync.post.ts]
        MemoryRoute[memory/index.post.ts]
        FileRoute[files/index.get.ts]
    end
    
    subgraph EveFramework [Eve AI Agent System]
        EveCore["Agent Core (agent.ts)"]
        LLM([Ollama Model])
    end
    
    subgraph DataStore [Data Layer]
        PG[(PostgreSQL + pgvector)]
        Appwrite[(Appwrite Storage)]
    end
    
    Canvas -->|Local CRDT changes| SyncPost
    AgentProv <-->|WebSocket SSE| EveCore
    EveCore <--> LLM
    
    SyncPost -->|Upsert crdt sync state| PG
    MemoryRoute -->|Insert Embeddings| PG
    FileRoute -->|Query Metadata| PG
    FileRoute -->|Fetch Object| Appwrite
```

<!-- diagram:component:app -->
## Frontend Components & State

```mermaid
graph TD
    subgraph Pages [Pages & Layouts]
        AppVue[app.vue]
        AppLayout[layouts/app.vue]
        MemoryPage[pages/memory.vue]
    end
    
    subgraph Shared UI [Global Overlays]
        RightDrawer[RightDrawer.vue]
        QuickAccess[QuickAccessBar.vue]
    end
    
    subgraph Core Features [Feature Components]
        CanvasWS[CanvasWorkspace.vue]
        ChatUI[ChatInterface.vue]
        MemoryTree[MemoryTree.vue]
    end
    
    subgraph State Management [Pinia Stores]
        ChatStore[useChatStore]
        ConvStore[useConversationStore]
        WidgetStore[useWidgetStore]
        UIStore[useUIStore]
    end
    
    AppVue --> AppLayout
    AppLayout --> RightDrawer
    AppLayout --> CanvasWS
    AppLayout --> QuickAccess
    
    RightDrawer --> ChatUI
    MemoryPage --> MemoryTree
    
    CanvasWS --> WidgetStore
    ChatUI --> ChatStore
    ChatUI --> ConvStore
    RightDrawer --> UIStore
    QuickAccess --> UIStore
```

<!-- diagram:dataflow:sync -->
## CRDT Sync Engine Flow

```mermaid
graph TD
    subgraph Client [Vue Frontend]
        YDocClient[Y.Doc Local State]
        SyncWorker[Sync Interval Timer]
        WidgetStore[Pinia Widget Store]
    end

    subgraph Server [Nitro API]
        SyncEndpoint[sync.post.ts]
        AsyncUnpack["syncSQLTables()"]
    end

    subgraph Database [PostgreSQL]
        CRDTTable[(crdt_sync_state)]
        SQLTables[(workspace & widget tables)]
    end

    WidgetStore -->|Observer mutation| YDocClient
    YDocClient -->|encodeStateVector| SyncWorker
    SyncWorker -->|HTTP POST JSON| SyncEndpoint
    
    SyncEndpoint -->|SELECT state| CRDTTable
    CRDTTable -->|Binary bytea| SyncEndpoint
    
    SyncEndpoint -->|Y applyUpdate| SyncEndpoint
    SyncEndpoint -->|Y encodeStateAsUpdate| SyncWorker
    SyncWorker -->|Y applyUpdate| YDocClient
    
    SyncEndpoint -->|INSERT UPDATE state| CRDTTable
    SyncEndpoint -->|event waitUntil| AsyncUnpack
    AsyncUnpack -->|Drizzle Insert Update| SQLTables
```

<!-- diagram:sequence:tool -->
## Tool Execution Sequence (e.g., canvas_add_widget)

```mermaid
sequenceDiagram
    participant User
    participant Chat as ChatInterface.vue
    participant AgentProv as AgentSessionProvider.vue
    participant Eve as Eve Framework
    participant Store as useWidgetStore
    participant API as Nitro API
    
    User->>Chat: "Draw a red box"
    Chat->>AgentProv: agent.send()
    AgentProv->>Eve: Network Request
    Eve->>Eve: LLM decides to use tool
    Eve-->>AgentProv: ToolCall(canvas_add_widget, args)
    
    AgentProv->>Store: widgetStore.addWidget(args)
    Store-->>User: UI Renders New Widget
    
    AgentProv-->>Eve: ToolResult("Successfully created widget")
    Eve-->>AgentProv: streamText("I have drawn a red box for you.")
    AgentProv-->>Chat: Update UI Messages
    
    Note over Store, API: Background CRDT Sync triggers
    Store->>API: HTTP POST /crdt/sync.post (Base64 CRDT Update)
```

<!-- diagram:er:database -->
## Database Schema

```mermaid
erDiagram
    user ||--o{ session : has
    user ||--o{ account : has
    user ||--o{ workspace : owns
    user ||--o{ conversation : engages_in
    user ||--o{ memory : retains
    user ||--o{ user_file : uploads
    user ||--|| crdt_sync_state : maintains
    
    workspace ||--o{ widget : contains

    user {
        text id PK
        text name
        text email
        boolean emailVerified
        text systemPrompt
        text preferredModel
    }
    
    workspace {
        text id PK
        text user_id FK
        text label
        jsonb canvas_state
    }
    
    widget {
        text id PK
        text workspace_id FK
        text type
        real x
        real y
        real width
        real height
        jsonb data
    }
    
    conversation {
        text id PK
        text user_id FK
        text title
        integer message_count
        jsonb events
    }
    
    memory {
        text id PK
        text user_id FK
        text path
        text title
        text type
        text content
        integer importance
        real confidence
        halfvec embedding
    }
    
    user_file {
        text id PK
        text user_id FK
        text appwrite_file_id
        text original_name
        text url
    }
```
