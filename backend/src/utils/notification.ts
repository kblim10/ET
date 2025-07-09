import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('✅ Firebase Admin SDK initialized');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
};

// Send push notification to a single device
export const sendNotificationToDevice = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> => {
  try {
    initializeFirebase();

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: fcmToken,
      android: {
        notification: {
          channelId: 'ecoterra_notifications',
          priority: 'high' as const,
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully:', response);
    return true;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return false;
  }
};

// Send push notification to multiple devices
export const sendNotificationToMultipleDevices = async (
  fcmTokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<number> => {
  try {
    initializeFirebase();

    if (fcmTokens.length === 0) {
      return 0;
    }

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens: fcmTokens,
      android: {
        notification: {
          channelId: 'ecoterra_notifications',
          priority: 'high' as const,
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ Notifications sent: ${response.successCount}/${fcmTokens.length}`);
    
    if (response.failureCount > 0) {
      console.log('❌ Failed notifications:', response.responses
        .filter((resp, idx) => !resp.success)
        .map((resp, idx) => ({ token: fcmTokens[idx], error: resp.error }))
      );
    }

    return response.successCount;
  } catch (error) {
    console.error('❌ Error sending bulk notifications:', error);
    return 0;
  }
};

// Send notification to topic
export const sendNotificationToTopic = async (
  topic: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> => {
  try {
    initializeFirebase();

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      topic,
      android: {
        notification: {
          channelId: 'ecoterra_notifications',
          priority: 'high' as const,
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Topic notification sent successfully:', response);
    return true;
  } catch (error) {
    console.error('❌ Error sending topic notification:', error);
    return false;
  }
};

// Subscribe device to topic
export const subscribeToTopic = async (
  fcmToken: string,
  topic: string
): Promise<boolean> => {
  try {
    initializeFirebase();

    await admin.messaging().subscribeToTopic([fcmToken], topic);
    console.log(`✅ Device subscribed to topic: ${topic}`);
    return true;
  } catch (error) {
    console.error('❌ Error subscribing to topic:', error);
    return false;
  }
};

// Unsubscribe device from topic
export const unsubscribeFromTopic = async (
  fcmToken: string,
  topic: string
): Promise<boolean> => {
  try {
    initializeFirebase();

    await admin.messaging().unsubscribeFromTopic([fcmToken], topic);
    console.log(`✅ Device unsubscribed from topic: ${topic}`);
    return true;
  } catch (error) {
    console.error('❌ Error unsubscribing from topic:', error);
    return false;
  }
};

// Notification templates
export const NotificationTemplates = {
  newQuiz: (teacherName: string, quizTitle: string) => ({
    title: 'Kuis Baru Tersedia!',
    body: `${teacherName} telah membuat kuis baru: ${quizTitle}`,
    data: { type: 'quiz', action: 'new_quiz' }
  }),

  quizResult: (quizTitle: string, score: number, passed: boolean) => ({
    title: 'Hasil Kuis',
    body: `Kuis "${quizTitle}" - Nilai: ${score}% (${passed ? 'LULUS' : 'TIDAK LULUS'})`,
    data: { type: 'quiz', action: 'quiz_result' }
  }),

  newPost: (authorName: string, postTitle: string) => ({
    title: 'Postingan Baru di Komunitas',
    body: `${authorName}: ${postTitle}`,
    data: { type: 'community', action: 'new_post' }
  }),

  newComment: (commenterName: string, postTitle: string) => ({
    title: 'Komentar Baru',
    body: `${commenterName} berkomentar pada postingan "${postTitle}"`,
    data: { type: 'community', action: 'new_comment' }
  }),

  scheduleUpdate: (subject: string, day: string, time: string) => ({
    title: 'Perubahan Jadwal',
    body: `Jadwal ${subject} diubah menjadi ${day} pukul ${time}`,
    data: { type: 'schedule', action: 'schedule_update' }
  }),

  privateMessage: (senderName: string, message: string) => ({
    title: `Pesan dari ${senderName}`,
    body: message.length > 50 ? message.substring(0, 50) + '...' : message,
    data: { type: 'message', action: 'private_message' }
  }),

  achievementUnlocked: (achievementName: string) => ({
    title: 'Prestasi Baru!',
    body: `Selamat! Anda meraih prestasi: ${achievementName}`,
    data: { type: 'achievement', action: 'achievement_unlocked' }
  })
};

export default {
  sendNotificationToDevice,
  sendNotificationToMultipleDevices,
  sendNotificationToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
  NotificationTemplates
};
