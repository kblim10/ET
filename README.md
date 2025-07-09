# 🌍 Ecoterra - Platform Pembelajaran Berbasis Ekosistem Daratan

Aplikasi pembelajaran digital untuk lingkungan pendidikan formal (sekolah) dan komunitas masyarakat luas yang fokus pada edukasi seputar ekosistem darat dan keberlanjutan.

## 📋 Daftar Isi

- [Deskripsi](#-deskripsi)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Struktur Project](#-struktur-project)
- [Instalasi dan Setup](#-instalasi-dan-setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 📝 Deskripsi

Ecoterra adalah platform pembelajaran modern yang dirancang untuk mendukung proses pendidikan dalam konteks sekolah dan edukasi lingkungan hidup. Nama "Ecoterra" berasal dari kata "Eco" (lingkungan) dan "Terra" (daratan), mencerminkan fokus utamanya pada edukasi seputar ekosistem darat dan keberlanjutan.

### 👤 Peran Pengguna

1. **Super Admin**
   - Akses penuh untuk mengelola sistem
   - Mengelola daftar sekolah, guru, murid, dan hak akses
   - Validasi domain sekolah

2. **Guru**
   - Mengelola materi pelajaran dan membuat kuis
   - Melihat statistik dan analisis performa siswa
   - Berkontribusi di komunitas dan moderasi konten

3. **Murid**
   - Mengakses kuis dan jadwal pelajaran
   - Melihat informasi prestasi dan ranking
   - Melacak aktivitas belajar harian

4. **Masyarakat Umum**
   - Mendaftar mandiri tanpa verifikasi domain
   - Berpartisipasi di komunitas
   - Upload buku dan materi edukasi
   - Chat dengan sesama pengguna

## 🚀 Fitur Utama

### 🏫 Bagian Sekolah (Guru & Murid)
- ✅ Registrasi sekolah dengan validasi domain
- ✅ Jadwal pelajaran dinamis (dapat diubah waktu)
- ✅ Kuis interaktif dengan timer & scoring otomatis
- ✅ Informasi pencapaian, ranking, dan aktivitas harian siswa
- ✅ Profil lengkap siswa & riwayat belajar
- ✅ Dashboard guru dengan analisis performa siswa
- ✅ Upload soal, materi, tugas, evaluasi (PDF, Video, Audio)

### 🌐 Bagian Komunitas (Umum & Guru)
- ✅ Forum diskusi publik
- ✅ Posting artikel/buku/edukasi lingkungan
- ✅ Sistem komentar, like, dan share
- ✅ Chat pribadi antar pengguna
- ✅ Upload buku/modul edukasi (PDF, ePub, dll)
- ✅ Moderasi konten oleh guru/super admin

### ⚙️ Profil & Pengaturan
- ✅ Ganti tema (Dark/Light Mode)
- ✅ Notifikasi real-time (Push & In-App)
- ✅ Batasan waktu penggunaan (Parental Control)
- ✅ Update profil & keamanan akun
- ✅ Riwayat aktivitas pengguna

## 🧩 Teknologi

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB dengan Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **File Storage**: Azure Blob Storage
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Security**: Helmet, CORS, express-rate-limit
- **Deployment**: Microsoft Azure

### Frontend Mobile
- **Framework**: React Native CLI
- **Language**: TypeScript (.tsx)
- **State Management**: Redux Toolkit
- **Persistence**: Redux Persist + AsyncStorage
- **Navigation**: React Navigation v6
- **UI Components**: Custom components
- **Real-time**: Socket.IO Client
- **Notifications**: Firebase Cloud Messaging
- **Build**: EAS Build (Expo)

## 📁 Struktur Project

```
ecoterra/
├── backend/                          # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                # Database configuration
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Authentication controller
│   │   │   ├── quizController.ts    # Quiz management
│   │   │   ├── communityController.ts # Community features
│   │   │   └── scheduleController.ts # Schedule management
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts    # JWT authentication
│   │   │   └── uploadMiddleware.ts  # File upload handling
│   │   ├── models/
│   │   │   ├── User.ts             # User model
│   │   │   ├── School.ts           # School model
│   │   │   ├── Quiz.ts             # Quiz model
│   │   │   ├── Post.ts             # Community post model
│   │   │   ├── Comment.ts          # Comment model
│   │   │   ├── Schedule.ts         # Schedule model
│   │   │   └── Achievement.ts      # Achievement model
│   │   ├── routes/
│   │   │   ├── authRoutes.ts       # Authentication routes
│   │   │   ├── quizRoutes.ts       # Quiz routes
│   │   │   ├── communityRoutes.ts  # Community routes
│   │   │   └── scheduleRoutes.ts   # Schedule routes
│   │   ├── utils/
│   │   │   ├── socket.ts           # Socket.IO configuration
│   │   │   └── notification.ts     # FCM notification utils
│   │   └── server.ts               # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
└── frontend/                        # Frontend Mobile App (React Native)
    ├── src/
    │   ├── components/
    │   │   ├── AuthInput.tsx        # Input component for auth
    │   │   ├── Header.tsx           # Header component
    │   │   ├── CardQuiz.tsx         # Quiz card component
    │   │   └── CommunityPost.tsx    # Community post component
    │   ├── screens/
    │   │   ├── LoginScreen.tsx      # Login screen
    │   │   ├── RegisterScreen.tsx   # Registration screen
    │   │   ├── HomeScreen.tsx       # Home dashboard
    │   │   ├── QuizScreen.tsx       # Quiz list screen
    │   │   ├── CommunityScreen.tsx  # Community screen
    │   │   ├── ProfileScreen.tsx    # User profile
    │   │   └── SettingsScreen.tsx   # App settings
    │   ├── navigation/
    │   │   └── AppNavigator.tsx     # Navigation configuration
    │   ├── services/
    │   │   ├── api.ts              # API service layer
    │   │   └── socketService.ts     # Socket.IO client
    │   ├── redux/
    │   │   ├── store.ts            # Redux store configuration
    │   │   ├── authSlice.ts        # Authentication state
    │   │   ├── userSlice.ts        # User state
    │   │   └── quizSlice.ts        # Quiz state
    │   ├── utils/
    │   │   ├── theme.ts            # Theme configuration
    │   │   └── helpers.ts          # Utility functions
    │   └── types/
    │       └── index.ts            # TypeScript type definitions
    ├── App.tsx                     # Main app component
    ├── index.js                    # App entry point
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## 🛠️ Instalasi dan Setup

### Prerequisites
- Node.js (v16 atau lebih baru)
- MongoDB (lokal atau MongoDB Atlas)
- React Native development environment
- Android Studio atau Xcode
- Azure Storage Account (untuk file upload)
- Firebase Project (untuk push notifications)

### Backend Setup

1. **Clone repository dan masuk ke folder backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env
```

4. **Edit file `.env` dengan konfigurasi yang sesuai:**
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
```

5. **Jalankan backend:**
```bash
npm run dev
```

### Frontend Setup

1. **Masuk ke folder frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup React Native environment:**
- Ikuti panduan [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

4. **Jalankan aplikasi:**

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 📱 Penggunaan

### Untuk Sekolah

1. **Super Admin mendaftarkan sekolah** dengan domain yang valid
2. **Guru dan murid** mendaftar menggunakan email dengan domain sekolah
3. **Guru** dapat:
   - Membuat dan mengelola kuis
   - Melihat analisis performa siswa
   - Mengelola jadwal pelajaran
   - Moderasi konten komunitas

4. **Murid** dapat:
   - Mengerjakan kuis dan melihat hasil
   - Melihat jadwal pelajaran
   - Melacak prestasi dan ranking
   - Berpartisipasi di komunitas

### Untuk Masyarakat Umum

1. **Registrasi mandiri** tanpa verifikasi domain
2. **Berpartisipasi di komunitas:**
   - Membuat postingan edukasi
   - Berkomentar dan berinteraksi
   - Upload buku dan materi
   - Chat pribadi dengan pengguna lain

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login pengguna
- `GET /api/auth/profile` - Get profil pengguna (protected)
- `PUT /api/auth/profile` - Update profil pengguna (protected)
- `PUT /api/auth/change-password` - Ubah password (protected)

### Quiz Endpoints
- `GET /api/quiz` - Get semua quiz
- `GET /api/quiz/:id` - Get quiz by ID
- `POST /api/quiz` - Buat quiz baru (guru only)
- `PUT /api/quiz/:id` - Update quiz (guru only)
- `DELETE /api/quiz/:id` - Hapus quiz (guru only)
- `POST /api/quiz/:id/submit` - Submit jawaban quiz
- `GET /api/quiz/:id/results` - Get hasil quiz user

### Community Endpoints
- `GET /api/community/posts` - Get semua postingan
- `GET /api/community/posts/:id` - Get postingan by ID
- `POST /api/community/posts` - Buat postingan baru
- `PUT /api/community/posts/:id` - Update postingan
- `DELETE /api/community/posts/:id` - Hapus postingan
- `POST /api/community/posts/:id/like` - Like/unlike postingan
- `POST /api/community/posts/:id/comments` - Tambah komentar

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // validation errors (optional)
  ]
}
```

## 🚀 Deployment

### Backend (Azure App Service)

1. **Build aplikasi:**
```bash
npm run build
```

2. **Deploy ke Azure** menggunakan Azure CLI atau GitHub Actions

3. **Set environment variables** di Azure Portal

4. **Configure domain** dan SSL certificate

### Frontend (Mobile App)

**Android:**
```bash
npm run build-android
```

**Menggunakan EAS Build:**
```bash
eas build -p android
```

**Upload ke Play Store** setelah build selesai

## 🔒 Security Features

- **JWT Authentication** dengan expiration
- **Role-based Access Control** (RBAC)
- **Input Validation** dengan Joi dan Mongoose
- **Rate Limiting** (100 requests per 15 menit)
- **CORS Protection**
- **Helmet.js** untuk security headers
- **Password Hashing** dengan bcryptjs
- **Domain Validation** untuk pengguna sekolah

## 🧪 Testing

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

## 📊 Features Roadmap

### Phase 1 (Current) ✅
- Authentication & Authorization
- Basic Quiz Management
- Community Features
- Real-time Chat

### Phase 2 (Upcoming) 🚧
- Advanced Analytics Dashboard
- Video Call Integration
- Offline Mode Support
- Advanced File Management

### Phase 3 (Future) 📋
- AI-powered Recommendations
- Gamification System
- Multi-language Support
- Advanced Reporting

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Development Guidelines

- Gunakan TypeScript untuk type safety
- Ikuti ESLint dan Prettier configuration
- Tulis unit tests untuk fitur baru
- Update documentation sesuai perubahan
- Gunakan conventional commits

## 🐛 Bug Reports & Feature Requests

Gunakan [GitHub Issues](../../issues) untuk melaporkan bug atau request fitur baru.

## 📄 License

Distributed under the MIT License. Lihat `LICENSE` file untuk detail.

## 👥 Tim Pengembang

- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **UI/UX Designer**: [Your Name]
- **Project Manager**: [Your Name]

## 📞 Support & Contact

- **Email**: support@ecoterra.app
- **Website**: https://ecoterra.app
- **Documentation**: https://docs.ecoterra.app

## 🙏 Acknowledgments

- React Native Community
- MongoDB Community
- Firebase Team
- Azure Cloud Services
- Open Source Contributors

---

**Dibuat dengan ❤️ untuk pendidikan dan lingkungan yang berkelanjutan** 🌱
