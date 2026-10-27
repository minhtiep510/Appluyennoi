const prisma = require('../config/prisma');


class VocabularyPracticeService {
  /**
   * Sinh bộ câu hỏi Trắc nghiệm 4 đáp án theo Chủ đề (Topic)
   */
  async generateQuizByTopic(topicId) {
    const where = topicId && topicId !== 'ALL' ? { topicId } : {};
    const topicWords = await prisma.vocabulary.findMany({
      where,
      include: { topic: { select: { id: true, name: true, level: true } } },
    });

    const allWords = await prisma.vocabulary.findMany({
      select: { id: true, word: true, meaning: true },
    });

    const pool = allWords.length >= 4 ? allWords : topicWords;

    return topicWords.map((item, idx) => {
      const distractors = pool
        .filter((w) => w.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => w.meaning);

      const options = [item.meaning, ...distractors].sort((a, b) =>
        a.localeCompare(b)
      );

      return {
        questionIndex: idx + 1,
        vocabularyId: item.id,
        word: item.word,
        pos: item.pos,
        ipa: item.ipa,
        level: item.level,
        topicName: item.topic?.name || '',
        question: `Nghĩa tiếng Việt chính xác nhất của từ "${item.word}" là gì?`,
        options,
        correctAnswer: item.meaning,
        example: item.example,
        exampleTrans: item.exampleTrans,
      };
    });
  }

  /**
   * Lấy danh sách bài tập Ghi chép Chính tả theo Chủ đề (Topic)
   */
  async getDictationExercises(topicId, mode = 'word') {
    const where = topicId && topicId !== 'ALL' ? { topicId } : {};
    const words = await prisma.vocabulary.findMany({
      where,
      include: { topic: { select: { id: true, name: true, level: true } } },
    });

    return words.map((item, idx) => {
      const targetText =
        mode === 'sentence' && item.example ? item.example : item.word;

      // Masked hint: Giữ chữ đầu và cuối, che phần giữa bằng gạch dưới
      const maskedHint = targetText
        .split(' ')
        .map((w) => {
          if (w.length <= 2) return w[0] + '_';
          return (
            w[0] +
            ' ' +
            Array(w.length - 2)
              .fill('_')
              .join(' ') +
            ' ' +
            w[w.length - 1]
          );
        })
        .join('   ');

      return {
        index: idx + 1,
        vocabularyId: item.id,
        word: item.word,
        pos: item.pos,
        ipa: item.ipa,
        level: item.level,
        meaning: item.meaning,
        example: item.example,
        exampleTrans: item.exampleTrans,
        maskedHint,
        topicName: item.topic?.name || '',
      };
    });
  }

  /**
   * Chấm điểm đáp án Chính tả do học viên gửi lên
   */
  async checkDictationAnswer({ vocabularyId, userTyped, mode = 'word' }) {
    const vocab = await prisma.vocabulary.findUnique({
      where: { id: Number(vocabularyId) },
    });
    if (!vocab) {
      const error = new Error('Không tìm thấy từ vựng để chấm chính tả.');
      error.statusCode = 404;
      throw error;
    }

    const expectedText =
      mode === 'sentence' && vocab.example ? vocab.example : vocab.word;

    const clean = (str) =>
      String(str || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const cleanExpected = clean(expectedText);
    const cleanTyped = clean(userTyped);
    const isExact = cleanExpected === cleanTyped;

    const expectedWords = cleanExpected.split(' ');
    const typedWords = cleanTyped.split(' ');
    const matchedWords = expectedWords.filter((w, i) => typedWords[i] === w);
    const accuracy = isExact
      ? 100
      : Math.round((matchedWords.length / Math.max(1, expectedWords.length)) * 100);

    return {
      vocabularyId: vocab.id,
      word: vocab.word,
      meaning: vocab.meaning,
      expected: expectedText,
      userTyped: String(userTyped || '').trim(),
      isCorrect: isExact || accuracy >= 85,
      accuracy,
      example: vocab.example,
      exampleTrans: vocab.exampleTrans,
    };
  }

  /**
   * Lưu kết quả làm bài Chính tả (DICTATION) hoặc Trắc nghiệm (QUIZ) vào Database
   */
  async savePractice(userId, data) {
    const {
      topicId,
      practiceType = 'DICTATION',
      score = 0,
      correctCount = 0,
      totalQuestions = 0,
      details = [],
    } = data;

    return await prisma.vocabularyPracticeHistory.create({
      data: {
        userId,
        topicId: topicId && topicId !== 'ALL' ? topicId : null,
        practiceType,
        score: Number(score),
        correctCount: Number(correctCount),
        totalQuestions: Number(totalQuestions),
        detailsJson: JSON.stringify(details),
      },
      include: {
        topic: {
          select: { id: true, name: true, level: true },
        },
      },
    });
  }

  /**
   * Lấy lịch sử làm bài Chính tả & Trắc nghiệm của học viên
   */
  async getMyPractices(userId, topicId) {
    const where = { userId };
    if (topicId && topicId !== 'ALL') {
      where.topicId = topicId;
    }

    return await prisma.vocabularyPracticeHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        topic: {
          select: { id: true, name: true, level: true },
        },
      },
    });
  }
}

module.exports = new VocabularyPracticeService();
