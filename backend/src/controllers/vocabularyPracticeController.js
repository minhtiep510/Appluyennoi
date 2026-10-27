const vocabularyPracticeService = require('../services/vocabularyPracticeService');

/**
 * Controller chuyên biệt xử lý API Trắc nghiệm & Ghi chép Chính tả Từ vựng
 */
class VocabularyPracticeController {
  // 1. Sinh bộ câu hỏi Trắc nghiệm (Quiz) theo Topic
  async getTopicQuiz(req, res) {
    try {
      const quizList = await vocabularyPracticeService.generateQuizByTopic(
        req.params.topicId
      );
      res.json(quizList);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 2. Lấy danh sách bài tập Ghi chép Chính tả (Dictation) theo Topic
  async getTopicDictation(req, res) {
    try {
      const exercises = await vocabularyPracticeService.getDictationExercises(
        req.params.topicId,
        req.query.mode || 'word'
      );
      res.json(exercises);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 3. Chấm điểm 1 câu Ghi chép Chính tả
  async checkDictation(req, res) {
    try {
      const result = await vocabularyPracticeService.checkDictationAnswer(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 4. Lưu kết quả phiên làm bài Chính tả (DICTATION) / Trắc nghiệm (QUIZ)
  async submitPractice(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const saved = await vocabularyPracticeService.savePractice(
        userId,
        req.body
      );
      res.status(201).json(saved);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 5. Xem lịch sử làm bài Chính tả & Trắc nghiệm của học viên
  async getMyPractices(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const list = await vocabularyPracticeService.getMyPractices(
        userId,
        req.query.topicId
      );
      res.json(list);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new VocabularyPracticeController();

