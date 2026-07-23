# bubbles.space

## Navigation

```mermaid
graph LR
    SO[System Overview] --> CD[Frontend Components]
    SO --> DF[Agent Data Flow]
    CD --> ER[Database Schema]
```

<!-- diagram:overview:system -->
## System Overview

```mermaid
graph TD
    subgraph ClientApp [Nuxt Client Application]
        Canvas[CanvasWorkspace.vue]
        Chat[ChatInterface.vue]
        Memory[MemoryTree.vue]
    end
    
    subgraph NitroBackend [Nitro Server & APIs]
        Auth[utils/auth.ts]
        CRDTSync[Yjs WebSocket Sync]
        AgentRoute[api/chat/index.post.ts]
        FileRoute[api/files/index.get.ts]
    end
    
    subgraph EveFramework [Eve AI Agent System]
        EveCore[Agent Core]
        MemorySvc[MemoryService]
        CanvasTools[Canvas Tools]
        MemoryTools[Memory Vault Tools]
    end
    
    subgraph DataStore [Data Layer]
        PG[(PostgreSQL Database)]
        Appwrite[(Appwrite Storage)]
    end
    
    Canvas <-->|WebSocket Sync| CRDTSync
    Chat -->|HTTP POST| AgentRoute
    Memory -->|HTTP GET| FileRoute
    
    CRDTSync --> PG
    Auth --> PG
    
    AgentRoute --> EveCore
    EveCore --> CanvasTools
    EveCore --> MemoryTools
    
    MemoryTools --> MemorySvc
    MemorySvc --> PG
    
    FileRoute --> Appwrite
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
        Settings[SettingsModal.vue]
    end
    
    subgraph Core Features [Feature Components]
        CanvasWS[CanvasWorkspace.vue]
        ChatUI[ChatInterface.vue]
        MemoryTree[MemoryTree.vue]
    end
    
    subgraph Pinia [Pinia State Management]
        AppStore[useAppStore]
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

<!-- diagram:dataflow:agent -->
## Agent Tool & Execution Flow

```mermaid
graph LR
    User([User Prompt]) --> AgentRoute[Server API /chat]
    AgentRoute --> Eve[Eve Framework]
    
    Eve --> Router{Tool Router}
    
    subgraph Canvas Manipulations
        Router --> canvas_add[canvas_add_widget]
        Router --> canvas_upd[canvas_update_widget]
        Router --> canvas_rem[canvas_remove_widget]
        Router --> canvas_read[canvas_read_widget]
    end
    
    subgraph Agent Memory Vault
        Router --> mem_store[memory_store]
        Router --> mem_query[memory_query]
        Router --> mem_tree[memory_tree]
        Router --> file_list[file_list]
    end
    
    subgraph External Web Tools
        Router --> web_search[web_search]
        Router --> wiki[wikipedia_search]
        Router --> yt[youtube_search]
        Router --> weather[get_weather]
    end
    
    mem_store --> PG[(PostgreSQL)]
    mem_query --> PG
    file_list --> PG
    
    canvas_add --> UI([Frontend Client])
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
