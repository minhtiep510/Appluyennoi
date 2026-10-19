const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 1. Lấy danh sách câu thoại theo bài học (lessonId)
 * GET /api/admin/lessons/:lessonId/dialogues
 */
exports.getDialoguesByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Không tìm thấy bài học.' });
    }

    const dialogues = await prisma.dialogueLine.findMany({
      where: { lessonId },
      orderBy: { orderIndex: 'asc' }
    });

    return res.status(200).json({
      lessonTitle: lesson.title,
      dialogues
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách câu thoại:', error);
    return res.status(500).json({ error: 'Lỗi server khi lấy danh sách câu thoại.' });
  }
};

/**
 * 2. Thêm mới một câu thoại vào bài học
 * POST /api/admin/lessons/:lessonId/dialogues
 * Body: { speaker, characterName, text, ipa, translation, orderIndex }
 */
exports.createDialogueLine = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { speaker, characterName, text, ipa, translation, orderIndex } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Nội dung câu thoại (text) là bắt buộc.' });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Không tìm thấy bài học.' });
    }

    // Nếu không truyền orderIndex, tự động lấy số thứ tự tiếp theo
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined || finalOrderIndex === null) {
      const lastLine = await prisma.dialogueLine.findFirst({
        where: { lessonId },
        orderBy: { orderIndex: 'desc' }
      });
      finalOrderIndex = lastLine ? lastLine.orderIndex + 1 : 1;
    }

    const defaultSpeaker = speaker === 'user' ? 'user' : 'ai';
    const defaultCharacter = characterName
      ? characterName.trim()
      : (defaultSpeaker === 'user' ? 'You' : 'AI Partner');

    const newDialogue = await prisma.dialogueLine.create({
      data: {
        lessonId,
        orderIndex: Number(finalOrderIndex),
        speaker: defaultSpeaker,
        characterName: defaultCharacter,
        text: text.trim(),
        ipa: ipa ? ipa.trim() : null,
        translation: translation ? translation.trim() : null
      }
    });

    return res.status(201).json({
      message: 'Thêm câu thoại thành công!',
      dialogue: newDialogue
    });
  } catch (error) {
    console.error('Lỗi thêm câu thoại:', error);
    return res.status(500).json({ error: 'Lỗi server khi thêm câu thoại.' });
  }
};

/**
 * 3. Chỉnh sửa một câu thoại
 * PUT /api/admin/dialogues/:id
 * Body: { speaker, characterName, text, ipa, translation, orderIndex }
 */
exports.updateDialogueLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { speaker, characterName, text, ipa, translation, orderIndex } = req.body;

    const existing = await prisma.dialogueLine.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy câu thoại cần sửa.' });
    }

    const updateData = {};
    if (speaker !== undefined) updateData.speaker = speaker;
    if (characterName !== undefined) updateData.characterName = characterName.trim();
    if (text !== undefined) updateData.text = text.trim();
    if (ipa !== undefined) updateData.ipa = ipa ? ipa.trim() : null;
    if (translation !== undefined) updateData.translation = translation ? translation.trim() : null;
    if (orderIndex !== undefined) updateData.orderIndex = Number(orderIndex);

    const updated = await prisma.dialogueLine.update({
      where: { id: Number(id) },
      data: updateData
    });

    return res.status(200).json({
      message: 'Cập nhật câu thoại thành công!',
      dialogue: updated
    });
  } catch (error) {
    console.error('Lỗi cập nhật câu thoại:', error);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật câu thoại.' });
  }
};

/**
 * 4. Xóa một câu thoại
 * DELETE /api/admin/dialogues/:id
 */
exports.deleteDialogueLine = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.dialogueLine.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy câu thoại.' });
    }

    await prisma.dialogueLine.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({ message: 'Xóa câu thoại thành công!' });
  } catch (error) {
    console.error('Lỗi xóa câu thoại:', error);
    return res.status(500).json({ error: 'Lỗi server khi xóa câu thoại.' });
  }
};

/**
 * 5. Cập nhật hàng loạt / Sắp xếp lại thứ tự các câu thoại
 * PUT /api/admin/lessons/:lessonId/dialogues/reorder
 * Body: { items: [ { id: 1, orderIndex: 1 }, { id: 2, orderIndex: 2 } ] }
 */
exports.reorderDialogues = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Dữ liệu items phải là một mảng gồm { id, orderIndex }.' });
    }

    // Sử dụng transaction cập nhật từng câu thoại
    await prisma.$transaction(
      items.map(item =>
        prisma.dialogueLine.update({
          where: { id: Number(item.id), lessonId },
          data: { orderIndex: Number(item.orderIndex) }
        })
      )
    );

    const updatedList = await prisma.dialogueLine.findMany({
      where: { lessonId },
      orderBy: { orderIndex: 'asc' }
    });

    return res.status(200).json({
      message: 'Cập nhật thứ tự các câu thoại thành công!',
      dialogues: updatedList
    });
  } catch (error) {
    console.error('Lỗi sắp xếp câu thoại:', error);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật thứ tự câu thoại.' });
  }
};

