# BE MyBimbingan

Backend API untuk sistem manajemen bimbingan mahasiswa menggunakan NestJS, PostgreSQL, dan Redis.

## 🚀 Cara Menjalankan Project

### Prerequisites

Pastikan Anda telah menginstall:
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [Docker](https://www.docker.com/) dan Docker Compose
- [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone <repository-url>
cd be-mybimbingan
```

### 2. Install Dependencies

```bash
npm install
```

## 🐳 Docker Setup dengan 3 Environment Profiles

Project ini menggunakan Docker Compose dengan 3 profile yang berbeda:

### 📋 Environment Profiles
1. **dev** - Development environment
2. **staging** - Staging environment  
3. **production** - Production environment

### 🔧 Environment Configuration

#### Untuk Local Development (Running di laptop/host)

Jika Anda menjalankan aplikasi di host machine (bukan di container), gunakan konfigurasi berikut:

**`.env.dev` (Local):**
```bash
# ===== APP =====
NODE_ENV=dev
JWT_SECRET=dev-secret-key

# ===== POSTGRES =====
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=mybimbingan_dev
POSTGRES_PORT=5435
POSTGRES_HOST=localhost

# ===== REDIS =====
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Untuk Container Development (Running di Docker)

Jika aplikasi berjalan di dalam container, gunakan nama service sebagai host:

**`.env.dev` (Container):**
```bash
# ===== APP =====
NODE_ENV=dev
JWT_SECRET=dev-secret-key

# ===== POSTGRES =====
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=mybimbingan_dev
POSTGRES_PORT=5432
POSTGRES_HOST=postgres-dev

# ===== REDIS =====
REDIS_HOST=redis-dev
REDIS_PORT=6379
```

### 🔧 Development Environment Setup

```bash
# 1. Build containers
docker compose --profile dev build

# 2. Start services (detached mode)
docker compose --profile dev up -d

# 3. Check running containers
docker ps

# 4. Stop services
docker compose --profile dev down

# 5. Reset/Clean setup (remove containers, volumes, networks)
docker compose --profile dev down -v --rmi all
docker system prune -f
```

### 🧪 Staging Environment Setup

```bash
# 1. Build staging containers
docker compose --profile staging build

# 2. Start staging services
docker compose --profile staging up -d

# 3. Stop staging services
docker compose --profile staging down

# 4. Reset staging setup
docker compose --profile staging down -v --rmi all
```

### 🚀 Production Environment Setup

```bash
# 1. Build production containers
docker compose --profile production build

# 2. Start production services
docker compose --profile production up -d

# 3. Stop production services
docker compose --profile production down

# 4. Reset production setup
docker compose --profile production down -v --rmi all
```

## 📦 Services dan Port Mapping

| Environment | Service | Container Port | Host Port | Database |
|-------------|---------|----------------|-----------|----------|
| **Dev** | PostgreSQL | 5432 | 5435 | `mybimbingan_dev` |
| **Dev** | Redis | 6379 | 6379 | - |
| **Dev** | Backend | 3000 | 3000 | - |
| **Staging** | PostgreSQL | 5432 | 5436 | `mybimbingan_staging` |
| **Staging** | Redis | 6379 | 6380 | - |
| **Staging** | Backend | 3000 | 3001 | - |
| **Production** | PostgreSQL | 5432 | 5437 | `mybimbingan_prod` |
| **Production** | Redis | 6379 | 6381 | - |
| **Production** | Backend | 3000 | 3002 | - |

### Akses Aplikasi
- **Development**: `http://localhost:3000`
- **Staging**: `http://localhost:3001` 
- **Production**: `http://localhost:3002`

## 🔧 Docker Management Commands

### Monitoring & Logging

```bash
# Lihat status semua containers
docker ps

# Lihat logs aplikasi
docker compose --profile dev logs backend-dev -f
docker compose --profile staging logs backend-staging -f

# Lihat logs database
docker compose --profile dev logs postgres-dev -f

# Lihat logs redis
docker compose --profile dev logs redis-dev -f

# Lihat status services
docker compose --profile dev ps
```

### Troubleshooting & Reset

```bash
# Restart services
docker compose --profile dev restart

# Rebuild tanpa cache
docker compose --profile dev build --no-cache

# Stop dan remove containers + volumes
docker compose --profile dev down -v

# Reset lengkap (containers + images + volumes + networks)
docker compose --profile dev down -v --rmi all
docker system prune -f

# Hapus semua Docker data (HATI-HATI!)
docker system prune -a -f --volumes
```

### Database Commands

```bash
# Masuk ke container database
docker exec -it mybimbingan-postgres-dev psql -U postgres -d mybimbingan_dev

# Backup database
docker exec mybimbingan-postgres-dev pg_dump -U postgres mybimbingan_dev > backup.sql

# Restore database  
docker exec -i mybimbingan-postgres-dev psql -U postgres mybimbingan_dev < backup.sql
```

## 🛠️ Local Development Commands

### Setup Database

Setelah services berjalan, setup database dengan commands berikut:

```bash
# Set environment variables
export NODE_ENV=development

# Reset database (drop, sync, dan seed)
npm run db:reset

# Atau jalankan step by step:
npm run db:drop    # Hapus database
npm run db:sync    # Sync schema
npm run db:seed    # Insert data seed
```

### Menjalankan Aplikasi

#### Development Mode
```bash
npm run start:dev
```

#### Debug Mode
```bash
npm run start:debug
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

## 🧪 Testing

This project uses Jest for unit and e2e tests. Below are common commands and examples for running tests locally.

### Run all unit tests
```bash
npm run test
```

### Run tests for a specific folder or file
- Run all tests under a folder (e.g., `auth` module):
```bash
npm test -- src/auth
```
- Run a single spec file:
```bash
npm test -- src/auth/auth.service.spec.ts
```
- If you want more verbose output or to avoid failing when there are no matching tests, add flags:
```bash
npm test -- src/auth --verbose --passWithNoTests
```

### Run tests by name (filter)
```bash
# Run tests whose names match the provided pattern
npm test -- -t "validate student user"
```

### Watch mode (auto-run on file changes)
```bash
npm run test:watch
```

### Running with coverage report
```bash
npm run test:cov
```

### Debugging tests
```bash
npm run test:debug
# or run a single test file in band (useful for debugging):
npx jest src/auth/auth.service.spec.ts --runInBand --runTestsByPath
```

### Tips
- Use `--passWithNoTests` when running a folder that might have no tests yet to prevent Jest from exiting with a non-zero code.
- Use `-t` or `--testNamePattern` to run tests matching a name substring.
- Combine flags (e.g., `--verbose`, `--runInBand`) depending on your debugging needs.

```bash
# E2E tests
npm run test:e2e

# Test coverage (alternative)
npm run test:cov
```


## 📝 Scripts Lainnya

```bash
# Format code
npm run format

# Lint code
npm run lint

# Build application
npm run build
```

## 🗂️ Struktur Project

```
src/
├── auth/              # Authentication & authorization
├── database/          # Database scripts & seeders
├── enrollments/       # Enrollment management
├── guidance-agendas/  # Guidance agenda management
├── lecturers/         # Lecturer management
├── students/          # Student management
└── submissions/       # Submission management
```

## 🚨 Troubleshooting

### Port sudah digunakan
Jika mengalami error "port already in use", pastikan tidak ada service lain yang menggunakan port yang sama atau ubah port di file environment.

### Database connection error
1. Pastikan Docker containers berjalan: `docker compose ps`
2. Pastikan environment variables sudah benar
3. Pastikan port database tidak terblokir firewall

### Redis connection error
1. Pastikan Redis container berjalan
2. Pastikan port Redis sesuai dengan environment
3. Check Redis logs: `docker compose logs redis-dev`

### Crypto Error (Node.js v18)
Jika mendapat error `crypto is not defined`, upgrade ke Node.js v20:
```bash
# Update Dockerfile
FROM node:20-alpine
```

---

## 📄 API Documentation

Setelah aplikasi berjalan, API documentation tersedia di:
- **Development Swagger UI**: `http://localhost:3000/api`
- **Staging Swagger UI**: `http://localhost:3001/api`
- **Production Swagger UI**: `http://localhost:3002/api`

---

**Happy Coding! 🎉**
