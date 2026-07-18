# NanoLink - Backend API

This directory contains the core infrastructure and application code for the NanoLink backend.

## Microservice Architecture
The backend is split into two independent services that communicate via Apache Kafka:

1. **API Server (`index.ts` & `controllers/`)**: A Fastify server that handles incoming HTTP requests. It resolves short URLs from Redis (cache-aside) and publishes click events to Kafka without blocking the HTTP response.
2. **Analytics Worker (`analytics/analyticsWorker.ts`)**: A headless Kafka consumer that runs in the background, batches incoming click events, and performs bulk inserts into PostgreSQL.

## API Endpoints

### 1. Health Check
Checks if the server is up and running.
- **URL**: `/`
- **Method**: `GET`
- **Response**: `{"Status": "OK"}`

### 2. Shorten URL
Accepts a long URL, validates it using Zod, and generates a short link using Base62.
- **URL**: `/url`
- **Method**: `POST`
- **Body**: `{"url": "https://www.google.com"}`
- **Response**: `{"Shortened URL": "http://localhost:3000/a1B2c3D"}`

### 3. Redirect (The Core Engine)
Redirects the user to the original website. 
*Behind the scenes: Hits Redis first. If Cache Miss, falls back to Postgres. Publishes a Fire-And-Forget event to Kafka.*
- **URL**: `/:shortId`
- **Method**: `GET`
- **Behavior**: HTTP 302 Redirect to the original `long_url`. Returns 404 if not found.

### 4. View All URLs
Returns all saved URLs in the database with pagination.
- **URL**: `/all`
- **Method**: `GET`
- **Response**: `{"RESULT": [{"id": 1, "short_code": "a1B2c3D", "long_url": "https://... "}]}`

### 5. View Analytics Dashboard
Returns an aggregated list of all URLs joined with their total click counts.
- **URL**: `/analytics`
- **Method**: `GET`
- **Response**: `{"results": [{"short_code": "a1B2c3D", "total_clicks": 42}]}`

## Docker Infrastructure

The backend is fully containerized. The `compose.yaml` file defines 5 distinct services:
1. `url_shortner`: The main Fastify API.
2. `analytics_worker`: The headless background worker.
3. `postgres_db`: The relational database.
4. `redis_cache`: The in-memory cache for ultra-fast reads.
5. `kafka_kraft`: The message broker running in KRaft mode (no Zookeeper).
