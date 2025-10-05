# Siloam Hospital Backend API

RESTful API for the Siloam Hospital Management System.

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Winston Logger

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Doctors
- `GET /api/v1/doctors` - List all doctors
- `GET /api/v1/doctors/:id` - Get doctor details
- `POST /api/v1/doctors` - Create doctor (Admin)

### Appointments
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments/my-appointments` - Get user appointments

### Hospitals
- `GET /api/v1/hospitals` - List all hospitals
- `GET /api/v1/hospitals/:id` - Get hospital details

## Testing

```bash
npm test
npm run lint
```

## Project Structure

```
src/
├── controllers/    - Request handlers
├── models/         - Database models
├── routes/         - API routes
├── middlewares/    - Custom middlewares
├── utils/          - Utilities
└── index.ts        - Entry point
```

## Database Backup & Restore

### Backup Database

Untuk melakukan backup database (SQLite/PostgreSQL), jalankan:

```bash
bash ./scripts/backup_db.sh [backup_dir]
```

Backup akan disimpan di folder `db_backups` (default) atau folder yang Anda tentukan.

### Restore Database

Untuk melakukan restore database dari file backup:

```bash
bash ./scripts/restore_db.sh [backup_file]
```

Pastikan file backup (`.sqlite` untuk SQLite, `.sql` untuk PostgreSQL) sudah tersedia.

### Otomatisasi Backup

Anda dapat menambahkan cron job di server untuk backup otomatis, contoh:

```cron
0 2 * * * /bin/bash /path/to/scripts/backup_db.sh /path/to/db_backups
```

Backup akan dijalankan setiap hari pukul 02:00.

### Enkripsi Data At Rest

Field sensitif pada rekam medis (diagnosis, treatment, prescription, notes) telah dienkripsi secara otomatis menggunakan AES-256. Pastikan variabel lingkungan `ENCRYPTION_KEY` diatur pada file `.env` untuk keamanan maksimal.

Untuk keamanan tambahan, disarankan mengaktifkan enkripsi disk/volume (misal: LUKS, BitLocker, atau fitur cloud provider) dan/atau Transparent Data Encryption (TDE) pada database server (PostgreSQL).

### Audit Log

Semua perubahan dan akses data penting (rekam medis, billing, farmasi, lab, rawat inap) dicatat secara otomatis di audit log (`logs/audit.log`). Audit log mencatat user, waktu, aksi, resource, dan data terkait untuk keperluan compliance dan keamanan.

## API Documentation

Dokumentasi API tersedia dalam format OpenAPI/Swagger di file `swagger.yaml`.

Anda dapat menggunakan Swagger Editor (https://editor.swagger.io/) untuk melihat dan mencoba endpoint secara interaktif:

1. Buka https://editor.swagger.io/
2. Upload file `swagger.yaml` dari folder backend
3. Lihat dan coba endpoint API

## SOP Keamanan, Backup, Restore, dan Disaster Recovery

- **Keamanan:**
  - Gunakan HTTPS untuk semua komunikasi API
  - Atur variabel lingkungan `ENCRYPTION_KEY` untuk enkripsi data sensitif
  - Gunakan role-based access control (RBAC) untuk semua endpoint
  - Audit log aktif untuk semua perubahan data penting

- **Backup:**
  - Gunakan script `scripts/backup_db.sh` untuk backup database secara manual atau otomatis (cron)
  - Simpan backup di lokasi aman dan terenkripsi

- **Restore:**
  - Gunakan script `scripts/restore_db.sh` untuk restore database dari file backup
  - Pastikan hanya admin yang dapat melakukan restore

- **Disaster Recovery:**
  - Simpan backup di lokasi berbeda (offsite/cloud)
  - Lakukan uji restore secara berkala
  - Dokumentasikan prosedur pemulihan sistem dan data

## Monitoring & Observability

- Endpoint Prometheus metrics tersedia di `/metrics`.
- Integrasikan Prometheus dan Grafana untuk visualisasi performa dan alerting.
- Untuk error tracking, integrasikan Sentry dengan menambahkan SDK Sentry di `src/utils/logger.ts` dan konfigurasi DSN di `.env`.

## Integrasi Sistem Eksternal

- Endpoint integrasi eksternal tersedia di `/api/v1/integrations`.
- Contoh endpoint:
  - `POST /api/v1/integrations/bpjs/claim` — Kirim klaim ke BPJS (dummy endpoint, siap diintegrasikan ke API BPJS).
  - `POST /api/v1/integrations/lab/external` — Kirim hasil lab ke laboratorium eksternal.
  - `POST /api/v1/integrations/pharmacy/external` — Kirim resep ke farmasi eksternal.
- Untuk integrasi nyata, tambahkan logic pemanggilan API eksternal pada controller/route terkait.
