const prisma = require('../config/prisma');

class LessonService {
  async getAllLessons() {
    const lessons = await prisma.lesson.findMany({
      include: {
        _count: {
          select: { dialogues: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return lessons;
  }

  async getLessonById(lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        dialogues: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!lesson) {
      const error = new Error('Không tìm thấy bài học.');
      error.statusCode = 404;
      throw error;
    }

    return lesson;
  }

  async createLesson({ title, description, level, dialogues }) {
    if (!title || !level) {
      const error = new Error('Vui lòng cung cấp tiêu đề (title) và cấp độ (level).');
      error.statusCode = 400;
      throw error;
    }

    const newLesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        level: level.trim(),
        description: description ? description.trim() : null,
        dialogues: {
          create: Array.isArray(dialogues) ? dialogues.map((d, index) => ({
            orderIndex: d.orderIndex || (index + 1),
            speaker: d.speaker || 'ai',
            characterName: d.characterName || (d.speaker === 'user' ? 'You' : 'Partner'),
            text: d.text,
            ipa: d.ipa || null,
            translation: d.translation || null
          })) : []
        }
      },
      include: {
        dialogues: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return newLesson;
  }

  async updateLesson(lessonId, { title, description, level }) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      const error = new Error('Bài học không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: title ? title.trim() : undefined,
        description: description !== undefined ? description?.trim() : undefined,
        level: level ? level.trim() : undefined
      }
    });

    return updated;
  }

  async deleteLesson(lessonId) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      const error = new Error('Bài học không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    await prisma.lesson.delete({ where: { id: lessonId } });
    return true;
  }
}

module.exports = new LessonService();

