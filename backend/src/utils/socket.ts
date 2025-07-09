import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface SocketUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

declare module 'socket.io' {
  interface Socket {
    user?: SocketUser;
  }
}

let io: Server;

export const initializeSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return next(new Error('JWT secret not configured'));
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName
      };

      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user?.fullName} (${socket.user?.email})`);

    // Join user to their personal room
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
      
      // Join school room if user is from a school
      if (socket.user.role === 'guru' || socket.user.role === 'murid') {
        // You can add school room logic here
        // socket.join(`school:${schoolId}`);
      }
    }

    // Handle private messages
    socket.on('private_message', async (data) => {
      try {
        const { recipientId, message, messageType = 'text' } = data;
        
        if (!socket.user) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        // Validate recipient exists
        const recipient = await User.findById(recipientId).select('_id fullName');
        if (!recipient) {
          socket.emit('error', { message: 'Recipient not found' });
          return;
        }

        const messageData = {
          id: Date.now().toString(),
          senderId: socket.user.id,
          senderName: socket.user.fullName,
          recipientId,
          recipientName: recipient.fullName,
          message,
          messageType,
          timestamp: new Date()
        };

        // Send to recipient
        socket.to(`user:${recipientId}`).emit('private_message', messageData);
        
        // Send confirmation to sender
        socket.emit('message_sent', messageData);

        console.log(`Private message from ${socket.user.fullName} to ${recipient.fullName}`);
      } catch (error) {
        console.error('Private message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { recipientId } = data;
      if (socket.user && recipientId) {
        socket.to(`user:${recipientId}`).emit('user_typing', {
          userId: socket.user.id,
          userName: socket.user.fullName,
          isTyping: true
        });
      }
    });

    socket.on('typing_stop', (data) => {
      const { recipientId } = data;
      if (socket.user && recipientId) {
        socket.to(`user:${recipientId}`).emit('user_typing', {
          userId: socket.user.id,
          userName: socket.user.fullName,
          isTyping: false
        });
      }
    });

    // Handle community post notifications
    socket.on('join_community', () => {
      socket.join('community');
      console.log(`${socket.user?.fullName} joined community room`);
    });

    socket.on('leave_community', () => {
      socket.leave('community');
      console.log(`${socket.user?.fullName} left community room`);
    });

    // Handle quiz notifications
    socket.on('join_quiz_room', (quizId) => {
      socket.join(`quiz:${quizId}`);
      console.log(`${socket.user?.fullName} joined quiz room: ${quizId}`);
    });

    socket.on('leave_quiz_room', (quizId) => {
      socket.leave(`quiz:${quizId}`);
      console.log(`${socket.user?.fullName} left quiz room: ${quizId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.fullName}`);
    });
  });

  return io;
};

// Helper functions to emit events
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToCommunity = (event: string, data: any) => {
  if (io) {
    io.to('community').emit(event, data);
  }
};

export const emitToQuizRoom = (quizId: string, event: string, data: any) => {
  if (io) {
    io.to(`quiz:${quizId}`).emit(event, data);
  }
};

export const emitToSchool = (schoolId: string, event: string, data: any) => {
  if (io) {
    io.to(`school:${schoolId}`).emit(event, data);
  }
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
