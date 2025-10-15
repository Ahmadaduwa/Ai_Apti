# Ai-Apit

ระบบต้นแบบ (MVP) สำหรับงานบริหารโรงเรียน พร้อมโมดูลวิเคราะห์แนวถนัด/อาชีพด้วย AI

## เทคโนโลยีหลัก
- Backend API: Node.js (Express + TypeScript)
- ML Service: Python (FastAPI)
- Frontend: React (Vite)
- Database: PostgreSQL
- Cache/Session/Queue: Redis
- รันด้วย Docker Compose

## รันโครงการ (แนะนำใช้ Docker)

1) ติดตั้งข้อกำหนด
- ติดตั้ง Docker Desktop และเปิดให้ทำงาน (หรือใช้งาน Docker daemon ใน WSL)
- พอร์ตที่ต้องว่าง (ค่าเริ่มต้นของ compose):
  - API: 3001
  - ML: 8001 (mapped to container 8000)
  - Web (dev): 5173
  - Postgres: 5432
  - Redis: 6379

2) ตั้งค่า environment
- คัดลอกไฟล์ตัวอย่างไปเป็นไฟล์จริง
```
cp infra/.env.sample infra/.env
```
- ปรับค่าใน `infra/.env` ตามความต้องการ (สำคัญ: `DATABASE_URL`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`)

3) สตาร์ททั้งหมดด้วย Docker Compose
```
docker compose up -d --build
```
- คำสั่งนี้จะสร้างและรันบริการทั้งหมด: Postgres, Redis, API, ML, Web
- ระหว่างการ build ตัว API จะรัน `npx prisma generate` และใน entrypoint จะรัน `npx prisma migrate deploy` ก่อนสตาร์ทเซิร์ฟเวอร์

4) ตรวจสอบสถานะบริการ / health
- ตรวจสอบคอนเทนเนอร์ที่รัน:
```
docker compose ps
```
- ดู logs ของ API (ตัวอย่าง):
```
docker compose logs -f api
```
- Health endpoints ที่ใช้ใน compose/entrypoint:
  - API health: `GET http://localhost:3001/health` (returns 200)
  - ML health (ถ้ามี): `http://localhost:8001` (ขึ้นกับการตั้งค่า ML)
  - Web dev server: `http://localhost:5173` (Vite)

5) รีเซ็ตฐานข้อมูล (ถ้าต้องการเริ่มใหม่)
- คำเตือน: จะลบข้อมูลใน volume ของ Postgres
```
docker compose down -v
docker compose up -d --build
```

6) การล็อกอิน/ทดสอบ API
- ระบบตัวอย่างมี endpoints สำหรับ auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
- ขณะนี้ไม่มีการ seed ผู้ดูแล (admin) อัตโนมัติ ในกรณีต้องการ ให้สร้างผู้ใช้ผ่าน endpoint ข้างต้นหรือลงข้อมูลโดยตรงในฐานข้อมูล

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

## Frontend

Dev (fast feedback)
- ถ้าต้องการรันเฉพาะ frontend ในโหมด dev (ไม่ใช้ Docker):
```
cd apps/web
npm install
npm run dev -- --host
```
จากนั้นเปิด http://localhost:5173

Docker (dev inside container)
- Compose ใน repo ถูกตั้งให้ใช้ `web` builder stage ในการรัน dev (มี `npm` อยู่ใน builder) — ถ้าต้องการให้ compose รัน builder stage และ `npm run dev` ให้รัน:
```
docker compose up --build web
```

Production / static serving
- Dockerfile ของ `apps/web` มีสอง stage (builder + nginx runtime). สำหรับ production ให้ใช้ nginx runtime (ลบ/ไม่ตั้ง `target: builder` ใน compose) เพื่อให้ได้ภาพที่เล็กลงและเสิร์ฟไฟล์ static โดย nginx


## เคล็ดลับ/ปัญหาที่พบบ่อย
- ถ้าเว็บไม่สามารถเรียก API ข้ามโดเมน ให้ตรวจค่า `CORS_ORIGIN` ใน `infra/.env`
- ถ้า API ต่อฐานข้อมูลไม่ได้ ให้ตรวจ `DATABASE_URL` และดูว่า container `postgres` รันอยู่ (`docker ps`) และ health ของ postgres ผ่าน (`pg_isready`)
- ถ้ามีการแก้ schema ของ Prisma แล้วต้องการอัพเดตฐานข้อมูลใน production ให้ใช้ migration flow (`npx prisma migrate dev` หรือ `npx prisma migrate deploy` ใน pipeline) — entrypoint ของ API จะเรียก `prisma migrate deploy` ตอนสตาร์ท
- ถ้าติดปัญหา native modules (เช่น `argon2`) ให้แน่ใจว่า `node_modules` ถูกติดตั้งและคอมไพล์ภายในภาพ (ไม่ใช่คัดลอกจากเครื่อง host) — compose ถูกปรับให้ติดตั้ง deps ใน builder stage

## คำแนะนำเพิ่มเติม
- แยกการตั้งค่า dev/production โดยใช้ `docker-compose.override.yml` สำหรับการ mount โฟลเดอร์ และตั้ง `web` เป็น builder target ใน dev
- เพิ่มขั้นตอน CI ที่รัน `docker compose build` และ `npx prisma migrate deploy` เพื่อจับปัญหา build/migrations ก่อน deploy

---

หากต้องการให้ผมสร้าง `docker-compose.override.yml` สำหรับ dev หรือแก้ README เป็นภาษาอังกฤษด้วย แจ้งได้เลย

## แผนพัฒนาต่อ
- เติมตาราง/เอ็นพอยต์ Attendance, Grades, Announcements, Payments ให้ครบ
- บังคับใช้ RBAC เต็มรูปแบบ และเช็คสิทธิ์ parent-child ทุกจุด
- เชื่อมต่อ ML อย่าง async และบันทึกผลลง `ai_profiles`
- ทำหน้า Report/Export PDF และ Consent/Privacy สำหรับผู้ปกครอง
