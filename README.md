# School MIS + AI Analytics (MVP)

ระบบต้นแบบ (MVP) สำหรับงานบริหารโรงเรียน + โมดูลวิเคราะห์แนวถนัด/อาชีพด้วย AI

## เทคโนโลยีหลัก
- Backend API: Node.js (Express + TypeScript)
- ML Service: Python (FastAPI)
- Frontend: React (Vite)
- Database: PostgreSQL
- Cache/Session/Queue: Redis
- รันด้วย Docker Compose

## วิธีรัน (แนะนำให้ใช้ Docker)

1) ติดตั้งสิ่งที่ต้องมี
- ติดตั้ง Docker Desktop และเปิดใช้งาน
- พอร์ตที่ต้องว่าง: 3001 (API), 8000 (ML), 5173 (Web), 5432 (Postgres), 6379 (Redis)

2) ตั้งค่า Environment
- คัดลอกไฟล์ตัวอย่างไปใช้งานจริง
```
cp infra/.env.sample infra/.env
```
- ปรับค่าใน `infra/.env` ได้ตามต้องการ โดยค่าเริ่มต้นที่สำคัญคือ:
  - `DATABASE_URL=postgresql://mis:mis_pw@postgres:5432/mis_db`
  - `CORS_ORIGIN=http://localhost:5173`
  - `ML_BASE_URL=http://ml:8000`
  - `DEMO_MODE=true` (เปิดโหมดเดโม่เพื่อทดลองเร็ว ๆ ด้วยโทเคน `demo`)

3) สตาร์ททุกบริการ
```
docker compose up -d --build
```
- คำสั่งนี้จะสตาร์ท Postgres, Redis, API, ML, และ Web ให้พร้อมใช้งาน
- ครั้งแรกของ API จะรัน `prisma generate` และ `prisma db push` ให้อัตโนมัติ (สร้างสคีมาใน Postgres)

4) เปิดใช้งาน
- API Health: http://localhost:3001/healthz
- ML Health: http://localhost:8001/healthz
- Web App: http://localhost:5173

5) การล็อกอิน/ทดสอบอย่างรวดเร็ว (โหมดเดโม่)
- ถ้า `DEMO_MODE=true` สามารถเรียก API ด้วย Header: `Authorization: Bearer demo`
- Frontend ตัวอย่างเรียกด้วยโทเคนเดโม่อยู่แล้ว เพื่อให้หน้า Student โหลดข้อมูลได้ทันที

6) บัญชีผู้ดูแลระบบ (seed อัตโนมัติ)
- ระบบจะสร้างผู้ใช้แอดมินถ้ายังไม่มี: `admin@example.com` / รหัสผ่าน `password`
- ทดสอบ Auth แบบจริงได้ที่
  - `POST http://localhost:3001/api/auth/register`
  - `POST http://localhost:3001/api/auth/login`
  - `POST http://localhost:3001/api/auth/refresh`
  - `POST http://localhost:3001/api/auth/logout`

## จุดเชื่อม API ที่มีใน MVP
- `GET /api/students/:id` (ตรวจสิทธิ: parent-owner/teacher/admin)
- `POST /api/students` (teacher/admin สร้าง)
- `GET /api/students/:id/ai-profile` (โปรไฟล์ AI แบบตัวอย่าง)
- `POST /api/students/:id/ai-run` (เรียก ML service วิเคราะห์)

## โครงสร้างโปรเจกต์
- `apps/api` — Express API + Prisma ORM
- `apps/ml` — FastAPI ML Service
- `apps/web` — Vite React Frontend
  - `src/components` — UI components (Card, ChartBar, AIInsights, ValueProp)
  - `src/pages` — Dashboard, Teacher, Admin, Student, Parent
  - `src/data` — mock data (schedule, students, announcements)
  - `src/styles` — Tailwind global styles
- `infra` — ไฟล์ env และเอกสาร

## Frontend (dev-only) Setup
หากต้องการรันเฉพาะ Frontend สำหรับการพรีเซนต์:
```
cd apps/web
npm install
npm run dev -- --host
```
เปิดที่ http://localhost:5173


## เคล็ดลับ/ปัญหาที่พบบ่อย
- ถ้าหน้าเว็บเรียก API ข้ามโดเมนไม่ได้ ให้ตรวจ `CORS_ORIGIN` ใน `infra/.env`
- ถ้า API ต่อฐานข้อมูลไม่ได้ ให้ตรวจ `DATABASE_URL` และดูว่า container `postgres` รันอยู่หรือไม่ (`docker ps`)
- ถ้ามีการแก้สคีมาของ Prisma ให้สั่ง build ใหม่ หรือเข้า container API แล้วรัน `npm run prisma:push`

## แผนพัฒนาต่อ
- เติมตาราง/เอ็นพอยต์ Attendance, Grades, Announcements, Payments ให้ครบ
- บังคับใช้ RBAC เต็มรูปแบบ และเช็คสิทธิ์ parent-child ทุกจุด
- เชื่อมต่อ ML อย่าง async และบันทึกผลลง `ai_profiles`
- ทำหน้า Report/Export PDF และ Consent/Privacy สำหรับผู้ปกครอง
