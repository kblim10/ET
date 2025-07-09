# Ecoterra Backend API

Backend API untuk aplikasi pembelajaran Ecoterra yang dibangun dengan Node.js, Express.js, TypeScript, dan MongoDB.

## 🚀 Fitur

- **Autentikasi & Autorisasi**: JWT-based authentication dengan role-based access control
- **Manajemen Quiz**: CRUD quiz dengan scoring otomatis dan tracking attempts
- **Komunitas**: Forum diskusi dengan posting, komentar, dan sistem like
- **Real-time Chat**: Socket.IO untuk chat pribadi dan notifikasi real-time
- **Upload File**: Dukungan upload file dengan Azure Blob Storage
- **Push Notifications**: Firebase Cloud Messaging untuk notifikasi mobile
- **Rate Limiting**: Perlindungan terhadap abuse dengan express-rate-limit
- **Security**: Helmet.js untuk security headers, CORS, dan input validation

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB dengan Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time**: Socket.IO
- **File Storage**: Azure Blob Storage
- **Push Notifications**: Firebase Cloud Messaging
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: Joi validation library

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 atau lebih baru)
- MongoDB (lokal atau MongoDB Atlas)
- Azure Storage Account (untuk file upload)
- Firebase Project (untuk push notifications)

### Installation

1. Clone repository dan masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy dan edit environment variables:
```bash
cp .env.example .env
```

4. Edit file `.env` dengan konfigurasi yang sesuai:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ecoterra

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
AZURE_STORAGE_ACCOUNT_KEY=your_storage_key
AZURE_STORAGE_CONTAINER_NAME=ecoterra-files

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. Build dan jalankan aplikasi:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

## 📁 Struktur Project

```
src/
├── config/
│   └── db.ts                 # Konfigurasi database MongoDB
├── controllers/
│   ├── authController.ts     # Controller untuk autentikasi
│   ├── quizController.ts     # Controller untuk quiz
│   └── communityController.ts # Controller untuk komunitas
├── middleware/
│   ├── authMiddleware.ts     # Middleware autentikasi & autorisasi
│   └── uploadMiddleware.ts   # Middleware upload file
├── models/
│   ├── User.ts              # Model pengguna
│   ├── School.ts            # Model sekolah
│   ├── Quiz.ts              # Model quiz
│   ├── Post.ts              # Model postingan komunitas
│   ├── Comment.ts           # Model komentar
│   ├── Schedule.ts          # Model jadwal
│   └── Achievement.ts       # Model pencapaian quiz
├── routes/
│   ├── authRoutes.ts        # Routes autentikasi
│   ├── quizRoutes.ts        # Routes quiz
│   └── communityRoutes.ts   # Routes komunitas
├── utils/
│   ├── socket.ts            # Socket.IO configuration
│   └── notification.ts      # Firebase notification utils
└── server.ts                # Entry point aplikasi
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `GET /api/auth/profile` - Get profil pengguna (protected)
- `PUT /api/auth/profile` - Update profil pengguna (protected)
- `PUT /api/auth/change-password` - Ubah password (protected)

### Quiz
- `GET /api/quiz` - Get semua quiz (optional auth)
- `GET /api/quiz/:id` - Get quiz by ID (optional auth)
- `POST /api/quiz` - Buat quiz baru (guru/admin only)
- `PUT /api/quiz/:id` - Update quiz (guru/admin only)
- `DELETE /api/quiz/:id` - Hapus quiz (guru/admin only)
- `POST /api/quiz/:id/submit` - Submit jawaban quiz (protected)
- `GET /api/quiz/:id/results` - Get hasil quiz user (protected)

### Community
- `GET /api/community/posts` - Get semua postingan (optional auth)
- `GET /api/community/posts/:id` - Get postingan by ID (optional auth)
- `POST /api/community/posts` - Buat postingan baru (protected)
- `PUT /api/community/posts/:id` - Update postingan (protected)
- `DELETE /api/community/posts/:id` - Hapus postingan (protected)
- `POST /api/community/posts/:id/like` - Like/unlike postingan (protected)
- `POST /api/community/posts/:id/comments` - Tambah komentar (protected)
- `GET /api/community/my-posts` - Get postingan user (protected)

## 🔐 Authentication & Authorization

### JWT Token
Setiap request yang memerlukan autentikasi harus menyertakan header:
```
Authorization: Bearer <jwt_token>
```

### User Roles
- **superadmin**: Akses penuh sistem
- **guru**: Mengelola quiz, materi, dan moderasi komunitas
- **murid**: Mengakses quiz dan aktivitas sekolah
- **masyarakat**: Akses komunitas dan konten publik

### Domain Validation
- Guru dan murid harus menggunakan email dengan domain sekolah yang terdaftar
- Masyarakat umum dapat mendaftar dengan email apapun

## 📡 Real-time Features (Socket.IO)

### Events yang didukung:
- `private_message` - Chat pribadi antar pengguna
- `typing_start/typing_stop` - Indikator typing
- `join_community/leave_community` - Join/leave room komunitas
- `join_quiz_room/leave_quiz_room` - Join/leave room quiz

### Authentication
Socket.IO menggunakan JWT token untuk autentikasi:
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## 🔔 Push Notifications

Aplikasi mendukung push notification melalui Firebase Cloud Messaging (FCM) untuk:
- Quiz baru dari guru
- Hasil quiz
- Postingan baru di komunitas
- Komentar baru
- Perubahan jadwal
- Pesan pribadi
- Pencapaian/achievement

## 📊 Database Schema

### Collections:
- **users**: Data pengguna (guru, murid, masyarakat, superadmin)
- **schools**: Data sekolah dan domain
- **quizzes**: Data quiz dan soal-soal
- **posts**: Postingan komunitas
- **comments**: Komentar pada postingan
- **achievements**: Hasil dan pencapaian quiz
- **schedules**: Jadwal pelajaran

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 menit per IP
- **Input Validation**: Mongoose validation dan Joi
- **Password Hashing**: bcryptjs dengan salt rounds 12
- **JWT Security**: Secure token dengan expiration

## 📈 Performance

- **Database Indexing**: Index pada field yang sering di-query
- **Pagination**: Limit results untuk performa yang lebih baik
- **Connection Pooling**: MongoDB connection pooling
- **Graceful Shutdown**: Proper cleanup on server shutdown

## 🧪 Testing

```bash
npm test
```

## 🚀 Deployment

### Azure App Service

1. Build aplikasi:
```bash
npm run build
```

2. Deploy ke Azure menggunakan Azure CLI atau GitHub Actions

3. Set environment variables di Azure Portal

4. Configure domain dan SSL certificate

### Environment Variables untuk Production
Pastikan semua environment variables sudah diset dengan nilai production yang sesuai.

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // validation errors (optional)
  ]
}
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 👥 Tim Pengembang

Ecoterra Development Team

## 📞 Support

Untuk bantuan dan support, silakan hubungi tim pengembang atau buat issue di repository ini.
