const prisma = require('../config/prisma');

class DialogueLineService {
  async getDialoguesByLesson(lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      const error = new Error('Không tìm thấy bài học.');
      error.statusCode = 404;
      throw error;
    }

    const dialogues = await prisma.dialogueLine.findMany({
      where: { lessonId },
      orderBy: { orderIndex: 'asc' }
    });

    return {
      lessonTitle: lesson.title,
      dialogues
    };
  }

  async createDialogueLine(lessonId, { speaker, characterName, text, ipa, translation, orderIndex }) {
    if (!text || !text.trim()) {
      const error = new Error('Nội dung câu thoại (text) là bắt buộc.');
      error.statusCode = 400;
      throw error;
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      const error = new Error('Không tìm thấy bài học.');
      error.statusCode = 404;
      throw error;
    }

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

    return newDialogue;
  }

  async updateDialogueLine(id, { speaker, characterName, text, ipa, translation, orderIndex }) {
    const existing = await prisma.dialogueLine.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      const error = new Error('Không tìm thấy câu thoại cần sửa.');
      error.statusCode = 404;
      throw error;
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

    return updated;
  }

  async deleteDialogueLine(id) {
    const existing = await prisma.dialogueLine.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      const error = new Error('Không tìm thấy câu thoại.');
      error.statusCode = 404;
      throw error;
    }

    await prisma.dialogueLine.delete({
      where: { id: Number(id) }
    });

    return true;
  }

  async reorderDialogues(lessonId, items) {
    if (!Array.isArray(items)) {
      const error = new Error('Dữ liệu items phải là một mảng gồm { id, orderIndex }.');
      error.statusCode = 400;
      throw error;
    }

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

    return updatedList;
  }
}

module.exports = new DialogueLineService();

