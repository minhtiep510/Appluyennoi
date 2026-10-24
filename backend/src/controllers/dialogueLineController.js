const dialogueLineService = require('../services/dialogueLineService');

/**
 * 1. Lấy danh sách câu thoại theo bài học (lessonId)
 */
exports.getDialoguesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await dialogueLineService.getDialoguesByLesson(lessonId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi lấy danh sách câu thoại:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi lấy danh sách câu thoại.'
    });
  }
};

/**
 * 2. Thêm mới một câu thoại vào bài học
 */
exports.createDialogueLine = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { speaker, characterName, text, ipa, translation, orderIndex } = req.body;

    const newDialogue = await dialogueLineService.createDialogueLine(lessonId, {
      speaker,
      characterName,
      text,
      ipa,
      translation,
      orderIndex
    });

    return res.status(201).json({
      message: 'Thêm câu thoại thành công!',
      dialogue: newDialogue
    });
  } catch (error) {
    console.error('Lỗi thêm câu thoại:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi thêm câu thoại.'
    });
  }
};

/**
 * 3. Chỉnh sửa một câu thoại
 */
exports.updateDialogueLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { speaker, characterName, text, ipa, translation, orderIndex } = req.body;

    const updated = await dialogueLineService.updateDialogueLine(id, {
      speaker,
      characterName,
      text,
      ipa,
      translation,
      orderIndex
    });

    return res.status(200).json({
      message: 'Cập nhật câu thoại thành công!',
      dialogue: updated
    });
  } catch (error) {
    console.error('Lỗi cập nhật câu thoại:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi cập nhật câu thoại.'
    });
  }
};

/**
 * 4. Xóa một câu thoại
 */
exports.deleteDialogueLine = async (req, res) => {
  try {
    const { id } = req.params;
    await dialogueLineService.deleteDialogueLine(id);
    return res.status(200).json({ message: 'Xóa câu thoại thành công!' });
  } catch (error) {
    console.error('Lỗi xóa câu thoại:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi xóa câu thoại.'
    });
  }
};

/**
 * 5. Cập nhật hàng loạt / Sắp xếp lại thứ tự các câu thoại
 */
exports.reorderDialogues = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { items } = req.body;

    const dialogues = await dialogueLineService.reorderDialogues(lessonId, items);

    return res.status(200).json({
      message: 'Cập nhật thứ tự các câu thoại thành công!',
      dialogues
    });
  } catch (error) {
    console.error('Lỗi sắp xếp câu thoại:', error);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Lỗi server khi cập nhật thứ tự câu thoại.'
    });
  }
};
