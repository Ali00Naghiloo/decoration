# راهنمای استقرار روی cPanel

## مراحل استقرار:

### 1. آپلود فایل‌ها

- تمام فایل‌های backend را روی سرور آپلود کنید
- مطمئن شوید که فولدر `uploads` در روت دایرکتوری backend وجود دارد

### 2. انتقال فایل‌های آپلود شده

اگر فایل‌هایی در `src/uploads` دارید، آنها را به `uploads` منتقل کنید:

```bash
# در ترمینال cPanel یا File Manager
cp -r src/uploads/* uploads/
```

### 3. تنظیم متغیرهای محیطی

مطمئن شوید فایل `.env` شامل این تنظیمات است:

```
NODE_ENV=production
MONGO_URI=mongodb://rokhnega_negarestan:VividPlanetDrives-2025!@rokhnegar.art:27017/rokhnega_negarestan
PORT=5000
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=1h
FILE_BASE_URL=https://api.rokhnegar.art/api
BASE_URL=https://rokhnegar.art
```

### 4. نصب dependencies و build

```bash
npm install
npm run build
```

### 5. شروع سرور

```bash
npm start
```

## تست کارکرد:

پس از استقرار، این URL باید کار کند:
`https://api.rokhnegar.art/api/uploads/FILENAME`

## ساختار فولدرها در production:

```
backend/
├── uploads/           # فایل‌های آپلود شده اینجا
├── src/
├── dist/             # فایل‌های build شده
├── .env
├── package.json
└── ...
```

## نکات مهم:

1. فولدر `uploads` باید در روت backend باشد، نه در `src`
2. URL فایل‌ها باید `/api/uploads/` باشد
3. NODE_ENV باید production تنظیم شود
