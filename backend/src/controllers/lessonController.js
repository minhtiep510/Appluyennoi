const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Lấy danh sách tất cả bài học
exports.getLessons = async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        _count: {
          select: { dialogues: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài học:', error);
    return res.status(500).json({ error: 'Lỗi khi lấy danh sách bài học.' });
  }
};

// 2. Lấy chi tiết bài học kèm danh sách câu thoại (dialogues)
exports.getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        dialogues: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Không tìm thấy bài học.' });
    }

    return res.status(200).json({ lesson });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bài học:', error);
    return res.status(500).json({ error: 'Lỗi server khi lấy chi tiết bài học.' });
  }
};

// 3. Tạo mới bài học (Admin)
exports.postLesson = async (req, res) => {
  try {
    const { title, description, level, dialogues } = req.body;
    if (!title || !level) {
      return res.status(400).json({ error: 'Vui lòng cung cấp tiêu đề (title) và cấp độ (level).' });
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

    return res.status(201).json({
      message: 'Tạo bài học thành công!',
      lesson: newLesson
    });
  } catch (error) {
    console.error('Lỗi tạo bài học:', error);
    return res.status(500).json({ error: 'Lỗi khi tạo bài học mới.' });
  }
};

// 4. Cập nhật thông tin bài học (Admin)
exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, description, level } = req.body;

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return res.status(404).json({ error: 'Bài học không tồn tại.' });
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: title ? title.trim() : undefined,
        description: description !== undefined ? description?.trim() : undefined,
        level: level ? level.trim() : undefined
      }
    });

    return res.status(200).json({
      message: 'Cập nhật bài học thành công!',
      lesson: updated
    });
  } catch (error) {
    console.error('Lỗi cập nhật bài học:', error);
    return res.status(500).json({ error: 'Lỗi khi cập nhật bài học.' });
  }
};

// 5. Xóa bài học (Admin)
exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return res.status(404).json({ error: 'Bài học không tồn tại.' });
    }

    await prisma.lesson.delete({ where: { id: lessonId } });
    return res.status(200).json({ message: 'Xóa bài học thành công!' });
  } catch (error) {
    console.error('Lỗi xóa bài học:', error);
    return res.status(500).json({ error: 'Lỗi khi xóa bài học.' });
  }
};
