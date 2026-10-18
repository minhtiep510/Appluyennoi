# Khung dự án Fullstack React + Vite & Express.js

## 1. Cấu trúc thư mục

```text
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── apiController.js
│   │   ├── routes/
│   │   │   └── api.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 2. Hướng dẫn khởi chạy

### Backend (Express.js)
Mở một terminal:
```bash
cd backend
npm install
npm run dev
```
*Server chạy tại: `http://localhost:5000` (API status: `http://localhost:5000/api/status`)*

### Frontend (React + Vite)
Mở một terminal khác:
```bash
cd frontend
npm install
npm run dev
```
*Giao diện mở tại: `http://localhost:5173`*
