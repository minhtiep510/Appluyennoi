const vocabularyService = require('../services/vocabularyService');

class VocabularyController {
  // 1. Lấy danh sách Chủ đề Từ vựng
  async getTopics(req, res) {
    try {
      const topics = await vocabularyService.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 2. Lấy chi tiết 1 Chủ đề kèm danh sách Từ vựng
  async getTopicById(req, res) {
    try {
      const topic = await vocabularyService.getTopicById(req.params.topicId);
      res.json(topic);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 3. Tạo mới Chủ đề Từ vựng (Admin)
  async createTopic(req, res) {
    try {
      const created = await vocabularyService.createTopic(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 4. Cập nhật Chủ đề Từ vựng (Admin)
  async updateTopic(req, res) {
    try {
      const updated = await vocabularyService.updateTopic(
        req.params.topicId,
        req.body
      );
      res.json(updated);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 5. Xóa Chủ đề Từ vựng (Admin)
  async deleteTopic(req, res) {
    try {
      await vocabularyService.deleteTopic(req.params.topicId);
      res.json({ message: 'Đã xóa chủ đề từ vựng thành công!' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 6. Lấy danh sách Từ vựng (hỗ trợ lọc theo topicId & search)
  async getVocabularies(req, res) {
    try {
      const list = await vocabularyService.getAllVocabularies({
        topicId: req.query.topicId,
        search: req.query.search,
      });
      res.json(list);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 7. Thêm Từ vựng mới (Admin)
  async createVocabulary(req, res) {
    try {
      const created = await vocabularyService.createVocabulary(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 8. Cập nhật Từ vựng (Admin)
  async updateVocabulary(req, res) {
    try {
      const updated = await vocabularyService.updateVocabulary(
        req.params.id,
        req.body
      );
      res.json(updated);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // 9. Xóa Từ vựng (Admin)
  async deleteVocabulary(req, res) {
    try {
      await vocabularyService.deleteVocabulary(req.params.id);
      res.json({ message: 'Đã xóa từ vựng thành công!' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new VocabularyController();

