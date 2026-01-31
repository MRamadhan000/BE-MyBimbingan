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

### 3. Setup Environment Variables

Project ini memiliki 3 environment yang berbeda:

#### Environment Development (`.env.dev`)
Untuk pengembangan lokal:
- PostgreSQL Port: `5435`
- Database: `mybimbingan_dev`
- Redis Port: `6379`

#### Environment Staging (`.env.staging`)
Untuk testing/staging:
- PostgreSQL Port: `5436`
- Database: `mybimbingan_staging`
- Redis Port: `6380`

#### Environment Production (`.env.production`)
Untuk production:
- PostgreSQL Port: `5437`
- Database: `mybimbingan_production`
- Redis Port: `6381`

### 4. Menjalankan Services dengan Docker Compose

#### 🔧 Development Environment

**Start services:**
```bash
docker compose --profile dev --env-file .env.dev up -d
```

**Stop services:**
```bash
docker compose --profile dev --env-file .env.dev down
```

#### 🧪 Staging Environment

**Start services:**
```bash
docker compose --profile staging --env-file .env.staging up -d
```

**Stop services:**
```bash
docker compose --profile staging --env-file .env.staging down
```

#### 🚀 Production Environment

**Start services:**
```bash
docker compose --profile production --env-file .env.production up -d
```

**Stop services:**
```bash
docker compose --profile production --env-file .env.production down
```

### 5. Setup Database

Setelah services berjalan, setup database dengan commands berikut:

#### Untuk Development Environment
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

#### Untuk Environment Lain
Pastikan environment variables sesuai dengan environment yang digunakan sebelum menjalankan database commands.

### 6. Menjalankan Aplikasi

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

## 📦 Services yang Berjalan

Ketika Docker Compose dijalankan, services berikut akan tersedia:

### PostgreSQL Database
- **Development**: `localhost:5435`
- **Staging**: `localhost:5436`
- **Production**: `localhost:5437`

### Redis Cache
- **Development**: `localhost:6379`
- **Staging**: `localhost:6380`
- **Production**: `localhost:6381`

### NestJS Application
- **Default**: `localhost:3000`

## 🔧 Database Commands

```bash
# Reset semua (drop + sync + seed)
npm run db:reset

# Drop database
npm run db:drop

# Sync database schema
npm run db:sync

# Seed database dengan sample data
npm run db:seed
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
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

## 🔒 Environment Variables

Setiap environment file (`.env.dev`, `.env.staging`, `.env.production`) berisi:

```bash
# Database Configuration
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
POSTGRES_PORT=your_postgres_port

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=your_redis_port

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=your_jwt_expiry

# Other configurations...
```

## 🐳 Docker Commands

```bash
# Melihat status containers
docker compose ps

# Melihat logs
docker compose --profile dev --env-file .env.dev logs

# Melihat logs specific service
docker compose --profile dev --env-file .env.dev logs postgres
docker compose --profile dev --env-file .env.dev logs redis

# Remove containers dan volumes
docker compose --profile dev --env-file .env.dev down -v
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
3. Check Redis logs: `docker compose logs redis`

---

## 📄 API Documentation

Setelah aplikasi berjalan, API documentation tersedia di:
- **Swagger UI**: `http://localhost:3000/api`
- **JSON**: `http://localhost:3000/api-json`

---

**Happy Coding! 🎉**
