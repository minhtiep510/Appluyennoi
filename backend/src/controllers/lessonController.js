const lessonService = require('../services/lessonService');

// 1. Lấy danh sách tất cả bài học
exports.getLessons = async (req, res) => {
  try {
    const lessons = await lessonService.getAllLessons();
    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài học:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi khi lấy danh sách bài học.'
    });
  }
};

// 2. Lấy chi tiết bài học kèm danh sách câu thoại (dialogues)
exports.getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await lessonService.getLessonById(lessonId);
    return res.status(200).json({ lesson });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bài học:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi lấy chi tiết bài học.'
    });
  }
};

// 3. Tạo mới bài học (Admin)
exports.postLesson = async (req, res) => {
  try {
    const { title, description, level, dialogues } = req.body;
    const newLesson = await lessonService.createLesson({
      title,
      description,
      level,
      dialogues
    });

    return res.status(201).json({
      message: 'Tạo bài học thành công!',
      lesson: newLesson
    });
  } catch (error) {
    console.error('Lỗi tạo bài học:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi khi tạo bài học mới.'
    });
  }
};

// 4. Cập nhật thông tin bài học (Admin)
exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, description, level } = req.body;
    const updated = await lessonService.updateLesson(lessonId, { title, description, level });

    return res.status(200).json({
      message: 'Cập nhật bài học thành công!',
      lesson: updated
    });
  } catch (error) {
    console.error('Lỗi cập nhật bài học:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi khi cập nhật bài học.'
    });
  }
};

// 5. Xóa bài học (Admin)
exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    await lessonService.deleteLesson(lessonId);
    return res.status(200).json({ message: 'Xóa bài học thành công!' });
  } catch (error) {
    console.error('Lỗi xóa bài học:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi khi xóa bài học.'
    });
  }
};
