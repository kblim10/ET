// User Types
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'superadmin' | 'guru' | 'murid' | 'masyarakat';
  schoolId?: string;
  profileImage?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'guru' | 'murid' | 'masyarakat';
  schoolDomain?: string;
}

// School Types
export interface School {
  id: string;
  name: string;
  domain: string;
  address: string;
  phone?: string;
  email?: string;
  principalName?: string;
  isActive: boolean;
  registeredAt: string;
}

// Quiz Types
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: QuizQuestion[];
  timeLimit: number;
  maxAttempts: number;
  passingScore: number;
  createdBy: User;
  schoolId?: string;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  attemptsLeft?: number;
  userAttempts?: number;
}

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  timeSpent: number;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  attemptNumber: number;
  isPassed: boolean;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  submittedAt: string;
}

// Community Types
export interface Post {
  id: string;
  content: string;
  images?: string[];
  tags?: string[];
  author: User;
  schoolId?: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
  visibility: 'public' | 'school' | 'private';
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

// Schedule Types
export interface Schedule {
  id: string;
  title: string;
  description?: string;
  type: 'kelas' | 'quiz' | 'tugas' | 'event';
  startTime: string;
  endTime: string;
  location?: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  reminders?: number[];
  participants?: User[];
  createdBy: User;
  schoolId?: string;
  metadata?: {
    quizId?: string;
    taskId?: string;
    subject?: string;
  };
  createdAt: string;
}

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'quiz' | 'community' | 'learning' | 'streak' | 'special';
  criteria: {
    target: number;
    current?: number;
    requirement: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface UserProgress {
  id: string;
  userId: string;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  quizzesCompleted: number;
  averageScore: number;
  streakDays: number;
  achievements: Achievement[];
  lastActivity: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Quiz: { quizId: string };
  QuizResult: { resultId: string };
  Community: undefined;
  Profile: undefined;
  Settings: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  Schedule: undefined;
  Achievements: undefined;
  Leaderboard: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Quiz: undefined;
  Community: undefined;
  Schedule: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'quiz' | 'community' | 'achievement' | 'reminder' | 'system';
  data?: {
    quizId?: string;
    postId?: string;
    achievementId?: string;
    scheduleId?: string;
  };
  isRead: boolean;
  userId: string;
  createdAt: string;
}

// Chat Types (untuk fitur chat real-time)
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  chatRoomId: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
  };
  isEdited: boolean;
  editedAt?: string;
  sentAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'private' | 'group' | 'class';
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdBy: User;
  schoolId?: string;
  isActive: boolean;
  createdAt: string;
}

// Form Types
export interface FormField {
  label: string;
  value: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
}

// File Upload Types
export interface FileUpload {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Redux Store Types
export interface RootState {
  auth: AuthState;
  quiz: QuizState;
  community: CommunityState;
  notification: NotificationState;
  user: UserState;
}

export interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  results: QuizResult[];
  isLoading: boolean;
  error: string | null;
}

export interface CommunityState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  profile: User | null;
  progress: UserProgress | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}

// Constants
export const COLORS = {
  primary: '#2c5530',
  secondary: '#4CAF50',
  accent: '#81C784',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  error: '#f44336',
  success: '#4CAF50',
  warning: '#ff9800',
  info: '#2196F3',
} as const;

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
