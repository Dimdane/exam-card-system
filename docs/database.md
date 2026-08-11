# Database Design

## Database

- Database : PostgreSQL
- Provider : Supabase

---

# Entity Relationship Diagram (ERD)

Belum dibuat.

---

# Tabel

## 1. schools

### Deskripsi

Menyimpan informasi profil sekolah.

| Field          | Type         | Nullable | Keterangan                   |
| -------------- | ------------ | -------- | ---------------------------- |
| id             | UUID         | No       | Primary Key                  |
| name           | VARCHAR(150) | No       | Nama sekolah                 |
| npsn           | VARCHAR(20)  | Yes      | Nomor Pokok Sekolah Nasional |
| address        | TEXT         | Yes      | Alamat sekolah               |
| phone          | VARCHAR(20)  | Yes      | Nomor telepon                |
| email          | VARCHAR(100) | Yes      | Email sekolah                |
| principal_name | VARCHAR(100) | Yes      | Nama kepala sekolah          |
| logo_url       | TEXT         | Yes      | Logo sekolah                 |
| created_at     | TIMESTAMP    | No       | Waktu dibuat                 |
| updated_at     | TIMESTAMP    | No       | Waktu diperbarui             |

---

## Tabel lainnya

Masih dalam tahap perancangan.

- users
- academic_years
- classes
- students
- subjects
- exam_rooms
- exam_cards

---

# Relasi

Masih dalam tahap perancangan.

---

# Catatan

- Menggunakan PostgreSQL.
- Primary Key menggunakan UUID.
- Timestamp menggunakan timezone UTC.

---

# Table Design

## majors

Deskripsi:

Menyimpan seluruh data jurusan yang ada di sekolah.

| Field      | Type         | Keterangan       |
| ---------- | ------------ | ---------------- |
| id         | UUID         | Primary Key      |
| code       | VARCHAR(10)  | Kode jurusan     |
| name       | VARCHAR(100) | Nama jurusan     |
| created_at | TIMESTAMP    | Waktu dibuat     |
| updated_at | TIMESTAMP    | Waktu diperbarui |
