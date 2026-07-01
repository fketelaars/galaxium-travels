# Galaxium Travels — Architecture

Galaxium Travels is a demo interplanetary flight-booking application built across three polyglot services. It is intentionally designed to showcase the challenges AI agents face in a real enterprise-style codebase: cross-service workflows, a dual REST + MCP backend, and non-obvious architectural constraints.

---

## System overview

```mermaid
graph TD
    Browser["Browser\n(React 19 / Vite)"]
    Backend["Python Backend\n(FastAPI + FastMCP)\n:8001"]
    Java["Java Hold Service\n(Spring Boot 3.4)\n:8080"]
    PythonDB[("SQLite / PostgreSQL\nbooking.db")]
    JavaDB[("SQLite\nholds.db")]
    AI["AI Agent\n(MCP client)"]

    Browser -->|REST JSON| Backend
    AI -->|MCP tools| Backend
    Backend -->|proxy| Java
    Java -->|/internal/bookings/from-hold| Backend
    Backend --- PythonDB
    Java --- JavaDB
```

---

## Services

### 1. Python backend (`booking_system_backend/`)

**Stack:** Python 3, FastAPI, FastMCP, SQLAlchemy, Pydantic, Uvicorn  
**Port:** `8001`

The central service. It owns the bookings database and exposes every operation both as a standard REST API and as MCP tools so AI agents can interact with the system natively.

**Key architectural notes:**
- `FastMCP` is instantiated **before** `FastAPI` in [`server.py`](booking_system_backend/server.py:22) — required for correct lifespan composition. Swapping the order breaks the app.
- MCP tools call `SessionLocal()` directly; they do **not** use `Depends(get_db)`.
- Service functions return `Union[Model, ErrorResponse]` — callers check `isinstance(result, ErrorResponse)`, never catch exceptions.
- `book_flight()` validates both `user_id` **and** `name` — name mismatch rejects the booking.
- Proxy endpoints (`/quotes`, `/holds/*`) forward to the Java service and catch `httpx.HTTPError`, returning `{"error": "..."}` with HTTP 200. Callers must inspect the body, not just the status code.

**Internal layers:**

```mermaid
graph LR
    subgraph server.py
        REST["REST endpoints\n(FastAPI)"]
        MCP["MCP tools\n(FastMCP)"]
        Proxy["Java proxy\nendpoints"]
    end
    subgraph services/
        FlightSvc["flight.py"]
        BookingSvc["booking.py"]
        UserSvc["user.py"]
    end
    DB[("SQLite / PostgreSQL")]

    REST --> FlightSvc
    REST --> BookingSvc
    REST --> UserSvc
    MCP --> FlightSvc
    MCP --> BookingSvc
    MCP --> UserSvc
    FlightSvc --> DB
    BookingSvc --> DB
    UserSvc --> DB
```

---

### 2. Java hold service (`booking_system_inventory_hold_service/`)

**Stack:** Java 17, Spring Boot 3.4, Hibernate/JPA, SQLite, Lombok  
**Port:** `8080`

A separate microservice that owns the quote and hold lifecycle. Holds auto-expire after 15 minutes via a background scheduler. When a hold is confirmed it calls back into the Python backend to create the real booking.

**Internal layers:**

```mermaid
graph LR
    subgraph api/
        QC["QuoteController\n/api/v1/quotes"]
        HC["HoldController\n/api/v1/holds"]
    end
    subgraph service/
        QS["QuoteService"]
        HS["HoldService"]
        PS["PricingService"]
    end
    subgraph domain/
        Quote
        Hold
        AuditEvent
    end
    Scheduler["HoldExpirationScheduler\n(every 60 s)"]
    Client["PythonBackendClient\n→ /internal/bookings/from-hold"]
    JavaDB[("SQLite\nholds.db")]

    QC --> QS
    HC --> HS
    QS --> PS
    QS --> Quote
    HS --> Hold
    HS --> AuditEvent
    QS --> AuditEvent
    Scheduler --> Hold
    HS --> Client
    Quote --> JavaDB
    Hold --> JavaDB
    AuditEvent --> JavaDB
```

---

### 3. Frontend (`booking_system_frontend/`)

**Stack:** React 19, TypeScript, Vite 7, Tailwind CSS 3, React Router 7, Axios, Framer Motion  
**Port:** `5173`

Single-page application. All API calls go to the Python backend — the frontend never talks directly to the Java service.

**Important:** Always inspect the `success` field or look for `error` in the response body — HTTP status is not reliable for error detection (proxy endpoints return HTTP 200 even on errors).

**Page structure:**

```mermaid
graph TD
    App["App.tsx\n(Router)"]
    Home["Home.tsx\n/ — destination grid"]
    DestDetail["DestinationDetail.tsx\n/destination/:id"]
    Flights["Flights.tsx\n/flights — search & book"]
    MyBookings["MyBookings.tsx\n/bookings — view & cancel"]

    App --> Home
    App --> DestDetail
    App --> Flights
    App --> MyBookings
```

---

## Data model

```mermaid
erDiagram
    USER {
        int user_id PK
        string name
        string email
    }
    FLIGHT {
        int flight_id PK
        string origin
        string destination
        string departure_time
        string arrival_time
        int base_price
        int economy_seats_available
        int business_seats_available
        int galaxium_seats_available
    }
    BOOKING {
        int booking_id PK
        int user_id FK
        int flight_id FK
        string status
        string booking_time
        string seat_class
        int price_paid
    }
    USER ||--o{ BOOKING : "makes"
    FLIGHT ||--o{ BOOKING : "has"
```

**Java service tables (separate database):**

```mermaid
erDiagram
    QUOTE {
        string quote_id PK
        int flight_id
        string seat_class
        int quantity
        int traveler_id
        string traveler_name
        long price_per_seat
        long total_price
        instant expires_at
        string status
        instant created_at
    }
    HOLD {
        string hold_id PK
        string quote_id FK
        string status
        instant reserved_until
        string external_booking_reference
        string error_message
        instant created_at
        instant updated_at
    }
    AUDIT_EVENT {
        string event_id PK
        string entity_type
        string entity_id
        string event_type
        string details
        instant created_at
    }
    QUOTE ||--o{ HOLD : "produces"
```

---

## Quote → hold → booking flow

The full cross-service workflow when a user reserves a seat before committing to a booking:

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant PY as Python Backend :8001
    participant JV as Java Hold Service :8080
    participant DB as booking.db

    User->>FE: Select flight & seat class
    FE->>PY: POST /quotes
    PY->>JV: POST /api/v1/quotes
    JV-->>PY: Quote (quoteId, price, expiry)
    PY-->>FE: Quote

    User->>FE: Place hold
    FE->>PY: POST /quotes/{quoteId}/holds
    PY->>JV: POST /api/v1/quotes/{quoteId}/holds
    JV-->>PY: Hold (holdId, reservedUntil)
    PY-->>FE: Hold

    User->>FE: Confirm booking
    FE->>PY: POST /holds/{holdId}/confirm
    PY->>JV: POST /api/v1/holds/{holdId}/confirm
    JV->>PY: POST /internal/bookings/from-hold
    PY->>DB: INSERT booking
    DB-->>PY: BookingOut
    PY-->>JV: BookingOut (booking_id)
    JV-->>PY: Hold (status=CONFIRMED, externalBookingReference)
    PY-->>FE: Confirmed Hold
```

**Hold auto-expiry:** A `HoldExpirationScheduler` in the Java service polls every 60 seconds and marks any hold whose `reserved_until` has passed as `EXPIRED`.

---

## MCP tools (AI agent interface)

The Python backend mounts an MCP server at `/mcp`. All six tools map 1-to-1 to the underlying service functions:

| Tool | Maps to | Description |
|---|---|---|
| `list_flights` | `flight.list_flights()` | List all available flights |
| `book_flight` | `booking.book_flight()` | Book a seat (validates user_id + name) |
| `get_bookings` | `booking.get_bookings()` | Get all bookings for a user |
| `cancel_booking` | `booking.cancel_booking()` | Cancel a booking by ID |
| `register_user` | `user.register_user()` | Register a new user |
| `get_user_id` | `user.get_user()` | Look up a user by name + email |

---

## Deployment topology

```mermaid
graph TD
    subgraph Local
        LS["start.sh"]
        LF["Frontend :5173"]
        LP["Python Backend :8001"]
        LJ["Java Hold Service :8080"]
        LS --> LF & LP & LJ
    end

    subgraph Docker_Compose["Docker Compose"]
        DCF["Frontend :5173"]
        DCP["Python Backend :8001"]
        DCJ["Java Hold Service :8082\n(hold-service profile)"]
        DCDB[("PostgreSQL :5433")]
        DCP --- DCDB
    end

    subgraph AWS["AWS (ECS + ALB + Terraform)"]
        ALB["Application Load Balancer"]
        ECS_F["Frontend (ECS)"]
        ECS_P["Python Backend (ECS)"]
        ECS_J["Java Hold Service (ECS)"]
        RDS[("RDS PostgreSQL")]
        ALB --> ECS_F & ECS_P & ECS_J
        ECS_P --- RDS
    end

    subgraph IBM["IBM Cloud (Code Engine)"]
        CE_F["Frontend"]
        CE_P["Python Backend"]
        CE_J["Java Hold Service"]
    end
```

---

## Seat classes & pricing

| Class | Price multiplier | Seat allocation | Column |
|---|---|---|---|
| Economy | 1.0× | ~60% of seats | `economy_seats_available` |
| Business | 2.5× | ~30% of seats | `business_seats_available` |
| Galaxium | 5.0× | ~10% of seats | `galaxium_seats_available` |

Each class has independent seat counters. A sold-out class does not block bookings in other classes.

---

## Testing strategy

| Layer | Tool | Database | Notes |
|---|---|---|---|
| Python unit (services) | pytest | In-memory SQLite (StaticPool) | `SessionLocal` patched in both `db` and `server` modules |
| Python REST | pytest + TestClient | In-memory SQLite (StaticPool) | |
| Java unit | Spring Test / JUnit | H2 (in-memory) | |
| End-to-end | pytest + Docker Compose | SQLite (isolated stack) | Ports 18001 / 18082 |

E2E test coverage:
- `test_smoke.py` — health, flight listing, booking happy path, name-mismatch rejection
- `test_holds.py` — full quote → hold → confirm creates a real booking; release; idempotent confirm; unknown quote; auto-expiry (hold duration shortened to 1 min in e2e)
