const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const practiceService = require('../services/practiceService');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123456';

function initPracticeSocket(httpServer, clientUrl) {
  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware xác thực JWT cho kết nối Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
      socket.user = decoded; // { userId, email, role }
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log(`⚡ [Socket.IO] Học viên kết nối: ${socket.user.email} (${socket.id})`);

    /**
     * 1. Sự kiện STREAMING REAL-TIME khi học viên ĐANG NÓI từng từ vào Micro
     * Payload: { dialogueLineId, targetText, spokenText }
     */
    socket.on('practice:stream', (payload) => {
      try {
        const { dialogueLineId, targetText, spokenText } = payload || {};
        if (!targetText) return;

        // Chấm điểm tức thì từng chữ trong bộ nhớ (Real-time < 2ms)
        const liveEval = practiceService.evaluateLive(targetText, spokenText || '');

        socket.emit('practice:live-score', {
          dialogueLineId,
          spokenText,
          ...liveEval,
        });
      } catch (err) {
        console.error('Lỗi practice:stream:', err);
      }
    });

    /**
     * 2. Sự kiện HOÀN TẤT CÂU NÓI (Tự động chấm điểm cuối & Lưu vào Database)
     * Payload: { dialogueLineId, spokenText }
     */
    socket.on('practice:finish', async (payload, callback) => {
      try {
        const { dialogueLineId, spokenText } = payload || {};
        if (!dialogueLineId) return;

        const saved = await practiceService.submitPractice(socket.user.userId, {
          dialogueLineId,
          spokenText: spokenText || '',
        });

        // Gửi kết quả đã lưu về client qua cả event và callback
        socket.emit('practice:completed', saved.result);
        if (typeof callback === 'function') {
          callback({ success: true, result: saved.result });
        }
      } catch (err) {
        console.error('Lỗi practice:finish:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.IO] Ngắt kết nối: ${socket.user.email}`);
    });
  });

  return io;
}

module.exports = initPracticeSocket;
