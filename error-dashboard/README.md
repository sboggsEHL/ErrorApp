# Error Monitoring Dashboard

Real-time error tracking system with integrated property data insights.

## Key Features
- Real-time error monitoring & alerting
- Advanced error categorization (Server, Database, API)
- Property data correlation using Mailhaus database
- Customizable filters and search
- Data visualization with interactive charts

## Database Integration
### Properties Table Schema (Mailhaus DB)
```mermaid
erDiagram
    PROPERTIES {
        integer property_id PK
        varchar(50) radar_id UK
        integer provider_id FK
        varchar(255) property_address
        varchar(100) property_city
        varchar(2) property_state
        varchar(10) property_zip
        numeric avm
        numeric available_equity
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    PROPERTIES }o--|| LEAD_PROVIDERS : "provider_id"
```

## Installation & Setup
```bash
git clone https://github.com/yourrepo/error-dashboard.git
cd error-dashboard
npm install
cp .env.example .env
```

## Configuration
`.env` requirements:
```ini
VITE_API_ENDPOINT=http://localhost:3000
DB_CONNECTION_STRING=postgres://user:pass@mailhaus-db:5432/mailhaus
MAX_HISTORY_DAYS=30
```

## Development
```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture
```mermaid
flowchart TD
    A[Client] --> B[Vite Server]
    B --> C[Express API]
    C --> D[Mailhaus Database]
    C --> E[Error Processing]
    E --> F[Real-time Updates]
```

## License
MIT License
