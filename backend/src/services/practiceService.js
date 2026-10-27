const prisma = require('../config/prisma');

/**
 * Chuẩn hóa chuỗi (bỏ dấu câu, chuyển chữ thường)
 */
const normalizeText = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
};

/**
 * So khớp và chấm điểm câu nói của người dùng so với câu thoại gốc (Hỗ trợ cả chấm Real-time & Chấm cuối)
 */
const evaluatePronunciation = (originalText, spokenText) => {
  const originalWords = normalizeText(originalText);
  const spokenWords = normalizeText(spokenText);

  if (originalWords.length === 0) {
    return {
      accuracyScore: 100,
      matchedWords: [],
      mispronouncedWords: [],
      wordStatuses: [],
      feedback: 'Tuyệt vời!',
    };
  }

  if (spokenWords.length === 0) {
    return {
      accuracyScore: 0,
      matchedWords: [],
      mispronouncedWords: originalWords,
      wordStatuses: originalWords.map((w) => ({ word: w, status: 'pending' })),
      feedback: 'Chưa phát hiện được giọng nói của bạn. Hãy thử phát âm lại nhé!',
    };
  }

  const matchedWords = [];
  const mispronounced = [];
  const wordStatuses = [];
  let correctCount = 0;

  // Kiểm tra từng từ trong câu mẫu
  originalWords.forEach((word) => {
    if (spokenWords.includes(word)) {
      correctCount++;
      matchedWords.push(word);
      wordStatuses.push({ word, status: 'correct' });
    } else {
      mispronounced.push(word);
      wordStatuses.push({ word, status: 'wrong' });
    }
  });

  const accuracyScore = Math.round((correctCount / originalWords.length) * 100);

  let feedback = 'Cần luyện tập thêm một chút nhé!';
  if (accuracyScore >= 90) {
    feedback = 'Xuất sắc! Phát âm rất tự nhiên và chuẩn xác!';
  } else if (accuracyScore >= 70) {
    feedback = 'Khá tốt! Bạn đã nói đúng phần lớn câu.';
  } else if (accuracyScore >= 50) {
    feedback = 'Tạm ổn, hãy chú ý các từ bị phát âm sót/sai.';
  }

  return {
    accuracyScore,
    matchedWords,
    mispronouncedWords: mispronounced,
    wordStatuses,
    feedback,
  };
};

class PracticeService {
  /**
   * Đánh giá real-time từng từ khi người dùng đang nói (không ghi DB để tối ưu tốc độ < 2ms)
   */
  evaluateLive(originalText, spokenText) {
    return evaluatePronunciation(originalText, spokenText);
  }

  /**
   * 1. Nộp kết quả luyện phát âm cho một câu thoại (Lưu vào DB)
   */
  async submitPractice(userId, { dialogueLineId, spokenText, audioUrl }) {
    const dialogueLine = await prisma.dialogueLine.findUnique({
      where: { id: Number(dialogueLineId) },
      include: {
        lesson: {
          select: { id: true, title: true, level: true },
        },
      },
    });

    if (!dialogueLine) {
      const error = new Error('Không tìm thấy câu thoại cần luyện tập.');
      error.statusCode = 404;
      throw error;
    }

    // Chấm điểm và phân tích từ sai
    const {
      accuracyScore,
      matchedWords,
      mispronouncedWords,
      wordStatuses,
      feedback,
    } = evaluatePronunciation(dialogueLine.text, spokenText);

    // Lưu vào cơ sở dữ liệu
    const history = await prisma.practiceHistory.create({
      data: {
        userId,
        dialogueLineId: Number(dialogueLineId),
        spokenText: spokenText || '',
        accuracyScore,
        feedback,
        audioUrl: audioUrl || null,
        mispronounced_words: JSON.stringify(mispronouncedWords),
      },
      include: {
        dialogue: {
          select: {
            text: true,
            ipa: true,
            translation: true,
            characterName: true,
            lessonId: true,
          },
        },
      },
    });

    return {
      message: 'Ghi nhận kết quả luyện tập thành công!',
      result: {
        id: history.id,
        dialogueLineId: Number(dialogueLineId),
        accuracyScore,
        feedback,
        matchedWords,
        mispronouncedWords,
        wordStatuses,
        expectedText: dialogueLine.text,
        spokenText: history.spokenText,
        createdAt: history.createdAt,
      },
    };
  }

  /**
   * 2. Lấy lịch sử luyện tập cá nhân của học viên
   */
  async getMyPracticeHistories(userId, { page = 1, limit = 10, lessonId }) {
    const skip = (page - 1) * limit;
    const where = { userId };

    if (lessonId) {
      where.dialogue = { lessonId };
    }

    const [totalItems, histories] = await Promise.all([
      prisma.practiceHistory.count({ where }),
      prisma.practiceHistory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          dialogue: {
            select: {
              id: true,
              text: true,
              ipa: true,
              translation: true,
              characterName: true,
              speaker: true,
              lesson: {
                select: { id: true, title: true, level: true },
              },
            },
          },
        },
      }),
    ]);

    const formatted = histories.map((h) => ({
      id: h.id,
      spokenText: h.spokenText,
      accuracyScore: h.accuracyScore,
      feedback: h.feedback,
      audioUrl: h.audioUrl,
      createdAt: h.createdAt,
      mispronouncedWords: h.mispronounced_words ? JSON.parse(h.mispronounced_words) : [],
      dialogue: h.dialogue,
    }));

    return {
      data: formatted,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * 3. Lấy bảng tổng kết dashboard tiến độ học của người dùng
   */
  async getUserProgress(userId) {
    const totalPracticed = await prisma.practiceHistory.count({
      where: { userId },
    });

    const histories = await prisma.practiceHistory.findMany({
      where: { userId },
      select: { accuracyScore: true },
    });

    const averageScore =
      histories.length > 0
        ? Math.round(histories.reduce((acc, cur) => acc + cur.accuracyScore, 0) / histories.length)
        : 0;

    return {
      totalPracticed,
      averageScore,
    };
  }
}

module.exports = new PracticeService();
