const prisma = require('../config/prisma');

class VocabularyService {
  // ==================== 1. QUẢN LÝ CHỦ ĐỀ TỪ VỰNG (VOCABULARY TOPIC) ====================
  async getAllTopics() {
    return await prisma.vocabularyTopic.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { vocabularies: true },
        },
        vocabularies: {
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async getTopicById(topicId) {
    const topic = await prisma.vocabularyTopic.findUnique({
      where: { id: topicId },
      include: {
        vocabularies: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!topic) {
      const error = new Error('Không tìm thấy chủ đề từ vựng này.');
      error.statusCode = 404;
      throw error;
    }

    return topic;
  }

  async createTopic(data) {
    const existing = await prisma.vocabularyTopic.findUnique({
      where: { name: data.name.trim() },
    });
    if (existing) {
      const error = new Error('Tên chủ đề từ vựng này đã tồn tại.');
      error.statusCode = 400;
      throw error;
    }

    return await prisma.vocabularyTopic.create({
      data: {
        name: data.name.trim(),
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        level: data.level || 'B1',
      },
    });
  }

  async updateTopic(topicId, data) {
    await this.getTopicById(topicId);
    return await prisma.vocabularyTopic.update({
      where: { id: topicId },
      data,
    });
  }

  async deleteTopic(topicId) {
    await this.getTopicById(topicId);
    return await prisma.vocabularyTopic.delete({
      where: { id: topicId },
    });
  }

  // ==================== 2. QUẢN LÝ TỪ VỰNG (VOCABULARY) ====================
  async getAllVocabularies({ topicId, search } = {}) {
    const where = {};
    if (topicId && topicId !== 'ALL') {
      where.topicId = topicId;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { word: { contains: q } },
        { meaning: { contains: q } },
        { example: { contains: q } },
      ];
    }

    return await prisma.vocabulary.findMany({
      where,
      orderBy: { id: 'asc' },
      include: {
        topic: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
    });
  }

  async createVocabulary(data) {
    return await prisma.vocabulary.create({
      data: {
        topicId: data.topicId,
        word: data.word.trim(),
        pos: data.pos || 'Noun',
        ipa: data.ipa || '',
        meaning: data.meaning.trim(),
        level: data.level || 'B1',
        synonyms: data.synonyms || '',
        example: data.example || '',
        exampleTrans: data.exampleTrans || '',
      },
      include: {
        topic: true,
      },
    });
  }

  async updateVocabulary(id, data) {
    const vocabId = Number(id);
    const existing = await prisma.vocabulary.findUnique({
      where: { id: vocabId },
    });
    if (!existing) {
      const error = new Error('Không tìm thấy từ vựng này.');
      error.statusCode = 404;
      throw error;
    }

    return await prisma.vocabulary.update({
      where: { id: vocabId },
      data,
      include: {
        topic: true,
      },
    });
  }

  async deleteVocabulary(id) {
    const vocabId = Number(id);
    return await prisma.vocabulary.delete({
      where: { id: vocabId },
    });
  }
}

module.exports = new VocabularyService();

