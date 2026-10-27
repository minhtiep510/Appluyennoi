const practiceService = require('../services/practiceService');

// 1. Nộp kết quả luyện nói (chấm điểm phát âm)
exports.submitPractice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await practiceService.submitPractice(userId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi nộp bài luyện tập:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi nộp bài luyện tập.',
    });
  }
};

// 2. Lấy danh sách lịch sử luyện tập của người dùng
exports.getMyPracticeHistories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page, limit, lessonId } = req.query;
    const result = await practiceService.getMyPracticeHistories(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      lessonId,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi lấy lịch sử luyện tập:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi lấy lịch sử luyện tập.',
    });
  }
};

// 3. Lấy tổng kết tiến độ học cá nhân
exports.getMyProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await practiceService.getUserProgress(userId);
    return res.status(200).json({ progress: result });
  } catch (error) {
    console.error('Lỗi lấy tiến độ cá nhân:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi lấy tiến độ cá nhân.',
    });
  }
};

