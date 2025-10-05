# 🏥 Panduan Aktivasi Layanan Medis Siloam Hospital

**Tanggal**: 4 Oktober 2025  
**Status**: Ready to Deploy

---

## 📋 **Layanan yang Akan Diaktifkan**

Sistem ini sudah dikonfigurasi untuk 5 layanan medis utama:

1. **Emergency Care** 🚑  
   *Layanan gawat darurat 24/7 dengan tim trauma dan critical care*

2. **Surgery** 🔪  
   *Bedah umum, laparoskopi, dan bedah robotik*

3. **Maternity** 👶  
   *Perawatan kehamilan, persalinan, dan NICU*

4. **Cardiology** ❤️  
   *Perawatan jantung dan pembuluh darah*

5. **Oncology** 🎗️  
   *Layanan kanker lengkap dengan kemoterapi dan radioterapi*

---

## 🚀 **Cara Menjalankan (Windows)**

### **Metode 1: Otomatis (Recommended)**

Jalankan file batch yang sudah disediakan:

```batch
cd backend
ACTIVATE-SERVICES.bat
```

Script ini akan otomatis:
- ✅ Install dependencies (speakeasy, qrcode)
- ✅ Build TypeScript
- ✅ Menjalankan database migration
- ✅ Mengisi database dengan 5 layanan

---

### **Metode 2: Manual (Step by Step)**

#### **Step 1: Install Dependencies**

```bash
cd backend
npm install speakeasy qrcode
npm install @types/speakeasy @types/qrcode --save-dev
```

#### **Step 2: Build TypeScript**

```bash
npm run build
```

#### **Step 3: Run Database Migration**

**Menggunakan Sequelize CLI:**
```bash
npx sequelize-cli db:migrate
```

**Atau Manual SQL (PostgreSQL):**
```sql
-- Connect to database
psql -U hospital_admin -d hospital_db

-- Run migration
CREATE TABLE specializations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctor_specializations (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  specialization_id INTEGER NOT NULL REFERENCES specializations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, specialization_id)
);

CREATE INDEX idx_doctor_spec_doctor ON doctor_specializations(doctor_id);
CREATE INDEX idx_doctor_spec_specialization ON doctor_specializations(specialization_id);
```

#### **Step 4: Run Seeder**

```bash
# Using ts-node (development)
npx ts-node src/seeders/specializationSeeder.ts

# Or using compiled JavaScript (production)
node dist/seeders/specializationSeeder.js
```

#### **Step 5: Start Server**

```bash
npm run dev
```

---

## ✅ **Verifikasi Instalasi**

### **1. Check Health Endpoint**

```bash
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "checks": {
    "server": "up",
    "database": "up",
    ...
  }
}
```

### **2. Get All Specializations**

```bash
curl http://localhost:4000/api/v1/specializations
```

**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Emergency Care",
      "description": "Comprehensive 24/7 emergency medical services...",
      "createdAt": "2025-10-04T14:00:00.000Z",
      "updatedAt": "2025-10-04T14:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Surgery",
      "description": "Advanced surgical services...",
      ...
    },
    ...
  ]
}
```

### **3. Get Single Specialization**

```bash
curl http://localhost:4000/api/v1/specializations/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Emergency Care",
    "description": "Comprehensive 24/7 emergency medical services including trauma care..."
  }
}
```

---

## 📡 **API Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/specializations` | Public | Get all specializations |
| `GET` | `/api/v1/specializations/:id` | Public | Get single specialization |
| `POST` | `/api/v1/specializations` | Admin | Create new specialization |
| `PUT` | `/api/v1/specializations/:id` | Admin | Update specialization |
| `DELETE` | `/api/v1/specializations/:id` | Admin | Delete specialization |

---

## 🔧 **Testing dengan Postman**

### **Test 1: Get All Specializations**

```http
GET http://localhost:4000/api/v1/specializations
```

### **Test 2: Create New Specialization (Admin Only)**

```http
POST http://localhost:4000/api/v1/specializations
Authorization: Bearer <your-admin-jwt-token>
Content-Type: application/json

{
  "name": "Pediatrics",
  "description": "Specialized care for children and adolescents"
}
```

### **Test 3: Search Doctors by Specialization**

```http
GET http://localhost:4000/api/v1/doctors?specialization=Emergency%20Care
```

---

## 🗄️ **Database Schema**

### **Table: `specializations`**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE |
| `description` | TEXT | NULL |
| `created_at` | TIMESTAMP | NOT NULL |
| `updated_at` | TIMESTAMP | NOT NULL |

### **Table: `doctor_specializations`** (Junction Table)

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| `doctor_id` | INTEGER | FK → doctors(id), CASCADE |
| `specialization_id` | INTEGER | FK → specializations(id), CASCADE |
| `created_at` | TIMESTAMP | NOT NULL |
| `updated_at` | TIMESTAMP | NOT NULL |

**Indexes:**
- `idx_doctor_spec_doctor` on `doctor_id`
- `idx_doctor_spec_specialization` on `specialization_id`
- UNIQUE INDEX on `(doctor_id, specialization_id)`

---

## 🔍 **Sample Queries**

### **Get All Doctors in Emergency Care**

```sql
SELECT u.first_name, u.last_name, d.license_number, s.name AS specialization
FROM users u
JOIN doctors d ON u.id = d.user_id
JOIN doctor_specializations ds ON d.id = ds.doctor_id
JOIN specializations s ON ds.specialization_id = s.id
WHERE s.name = 'Emergency Care';
```

### **Count Doctors per Specialization**

```sql
SELECT s.name, COUNT(ds.doctor_id) AS doctor_count
FROM specializations s
LEFT JOIN doctor_specializations ds ON s.id = ds.specialization_id
GROUP BY s.id, s.name
ORDER BY doctor_count DESC;
```

---

## 🛡️ **Security & Compliance**

✅ **ISO 27001 A.9.4** - Access Control  
- Public endpoints untuk read operations
- Admin-only untuk create/update/delete

✅ **ISO 25010** - Performance  
- Indexed database queries
- Optimized for high-traffic scenarios

✅ **WCAG 2.1** - Accessibility  
- RESTful API structure
- Clear response formats

---

## 📝 **Troubleshooting**

### **Error: "Table specializations does not exist"**

**Solution**: Run migration first:
```bash
npx sequelize-cli db:migrate
```

### **Error: "Specializations already seeded"**

**Solution**: This is normal. Seeder automatically skips if data already exists. To re-seed:
```bash
# Delete existing data first
psql -U hospital_admin -d hospital_db
DELETE FROM specializations;

# Then run seeder again
node dist/seeders/specializationSeeder.js
```

### **Error: "Cannot find module 'speakeasy'"**

**Solution**: Install dependencies:
```bash
npm install speakeasy qrcode
```

---

## 📊 **Next Steps**

Setelah layanan aktif, Anda bisa:

1. **Assign Specializations to Doctors**  
   Update doctor profile untuk menambahkan spesialisasi mereka.

2. **Filter Doctors by Service**  
   Pasien dapat mencari dokter berdasarkan layanan yang dibutuhkan.

3. **Service-Based Pricing**  
   Set harga konsultasi berbeda per spesialisasi.

4. **Department Management**  
   Organisir dokter berdasarkan departemen rumah sakit.

---

## 📞 **Support**

**Documentation**: `README.md`, `TECHNICAL_DOCUMENTATION.md`  
**API Docs**: http://localhost:4000/api/v1  
**Health Check**: http://localhost:4000/health

---

## ✅ **Checklist Aktivasi**

- [ ] Dependencies installed (`speakeasy`, `qrcode`)
- [ ] TypeScript compiled (`npm run build`)
- [ ] Database migration run
- [ ] Seeder executed successfully
- [ ] Server started (`npm run dev`)
- [ ] Verified `/specializations` endpoint works
- [ ] All 5 services visible in database

---

**🏥 Siloam Hospital Management System**  
**© 2025 - Healthcare with International Standards**
