# bubbles.space

## Navigation

```mermaid
graph LR
    SO[System Overview] --> CD[Component Diagram]
    SO --> DF[Agent Data Flow]
    CD --> ER[Database Schema]
```

<!-- diagram:overview:system -->
## System Overview

```mermaid
graph TD
    subgraph ClientApp [Client Application - Nuxt 4 / Vue 3]
        Canvas[Spatial Canvas]
        ChatUI[Chat Interface]
        Widgets[Canvas Widgets]
    end
    
    subgraph ServerAPI [Server - Nitro API]
        AuthSvc[Auth Service]
        SyncSvc[Yjs CRDT Sync]
        AgentGateway[Agent Gateway]
        BillingSvc[Billing / Dodopayments]
    end
    
    subgraph AIAgent [AI Agent System - Eve]
        AgentCore[Eve Agent Core]
        Tools[Agent Tools]
        MemoryVault[Memory Service]
    end
    
    subgraph DataLayer [Data Layer]
        PostgreSQL[(PostgreSQL + pgvector)]
        Appwrite[(Appwrite Storage)]
    end
    
    Canvas <-->|WebSocket| SyncSvc
    ChatUI --> AgentGateway
    Widgets --> AuthSvc
    
    SyncSvc --> PostgreSQL
    AuthSvc --> PostgreSQL
    BillingSvc --> PostgreSQL
    
    AgentGateway --> AgentCore
    AgentCore --> Tools
    Tools --> MemoryVault
    MemoryVault --> PostgreSQL
    Tools --> Appwrite
```

<!-- diagram:component:app -->
## Application Components

```mermaid
graph TD
    subgraph Presentation [Presentation Layer]
        Pages[Nuxt Pages]
        Components[Vue Components]
    end
    
    subgraph State [State Management]
        Pinia[Pinia Stores]
        Composables[Vue Composables]
        Yjs[Yjs CRDT Document]
    end
    
    subgraph NitroAPI [Nitro API Layer]
        Routes[API Routes]
        Middleware[Server Middleware]
        Services[Business Services]
    end
    
    subgraph DBAccess [Database Access]
        Drizzle[Drizzle ORM]
    end
    
    Pages --> Components
    Components --> Composables
    Composables --> Pinia
    Composables --> Yjs
    
    Pinia --> Routes
    Yjs --> Routes
    
    Routes --> Middleware
    Middleware --> Services
    Services --> Drizzle
```

<!-- diagram:dataflow:agent -->
## Agent Interaction Data Flow

```mermaid
graph LR
    User([User]) -->|Chat Input| UI[Chat Interface]
    UI -->|API Request| Server[Nitro Server]
    Server -->|Invoke| Eve[Eve Agent]
    
    Eve --> ToolSelect{Select Tool?}
    ToolSelect -->|Yes| ExecuteTool[Tool Execution]
    ExecuteTool --> MemoryQuery[(Memory Vault / DB)]
    ExecuteTool --> FileList[(File Storage)]
    
    ToolSelect -->|No| LLM([LLM inference])
    LLM -->|Response| Eve
    
    Eve -->|Stream| Server
    Server -->|SSE / WebSockets| UI
    UI --> User
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
