const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu gieo dữ liệu mẫu (Seeding)...');

  // 1. Tạo tài khoản Admin mẫu
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      fullName: 'Quản trị viên',
      password: 'Admin@123',
      role: 'ADMIN',
      isVerified: true
    }
  });
  console.log(`✅ Đã tạo/kiểm tra Admin: ${adminUser.email} (Mật khẩu: Admin@123)`);

  // 2. Tạo tài khoản Học viên mẫu
  const userPasswordHash = await bcrypt.hash('User@123', 10);
  const normalUser = await prisma.user.upsert({
    where: { email: 'learner@example.com' },
    update: {},
    create: {
      email: 'learner@example.com',
      fullName: 'Nguyễn Văn Học',
      password: userPasswordHash,
      role: 'USER',
      isVerified: true
    }
  });
  console.log(`✅ Đã tạo/kiểm tra Học viên: ${normalUser.email} (Mật khẩu: User@123)`);

  // 3. Xóa bài học mẫu cũ (nếu có để làm mới)
  const existingLesson = await prisma.lesson.findFirst({
    where: { title: 'Ordering Coffee at a Cafe' }
  });

  if (existingLesson) {
    await prisma.lesson.delete({ where: { id: existingLesson.id } });
  }

  // 4. Tạo bài học mẫu kèm các câu thoại đối thoại (Dialogue lines)
  const coffeeLesson = await prisma.lesson.create({
    data: {
      title: 'Ordering Coffee at a Cafe',
      level: 'A1 - Beginner',
      description: 'Luyện tập hội thoại giao tiếp cơ bản khi đi gọi đồ uống tại quán cà phê.',
      dialogues: {
        create: [
          {
            orderIndex: 1,
            speaker: 'ai',
            characterName: 'Barista',
            text: 'Hi there! Welcome to Star Coffee. What can I get for you today?',
            ipa: '/haɪ ðɛr! ˈwɛlkəm tu stɑr ˈkɔfi. wʌt kæn aɪ gɛt fɔr ju təˈdeɪ?/',
            translation: 'Xin chào! Chào mừng quý khách đến Star Coffee. Quý khách muốn dùng gì hôm nay ạ?'
          },
          {
            orderIndex: 2,
            speaker: 'user',
            characterName: 'You',
            text: 'Could I have a medium iced latte with oat milk, please?',
            ipa: '/kʊd aɪ hæv ə ˈmidiəm aɪst ˈlɑteɪ wɪð oʊt mɪlk, pliz?/',
            translation: 'Cho tôi một ly latte đá cỡ vừa với sữa yến mạch được không?'
          },
          {
            orderIndex: 3,
            speaker: 'ai',
            characterName: 'Barista',
            text: 'Sure thing! Would you like any sugar or flavor syrup in that?',
            ipa: '/ʃʊr θɪŋ! wʊd ju laɪk ˈɛni ˈʃʊgər ɔr ˈfleɪvər ˈsɪrəp ɪn ðæt?/',
            translation: 'Được chứ ạ! Bạn có muốn thêm đường hay si-rô hương vị gì không?'
          },
          {
            orderIndex: 4,
            speaker: 'user',
            characterName: 'You',
            text: 'Just one pump of vanilla syrup, and less sugar please.',
            ipa: '/ʤʌst wʌn pʌmp ʌv vəˈnɪlə ˈsɪrəp, ænd lɛs ˈʃʊgər pliz./',
            translation: 'Chỉ cần một chút si-rô vani, và ít đường thôi nhé.'
          },
          {
            orderIndex: 5,
            speaker: 'ai',
            characterName: 'Barista',
            text: 'Got it. For here or to go?',
            ipa: '/gɑt ɪt. fɔr hɪr ɔr tu goʊ?/',
            translation: 'Tôi hiểu rồi. Bạn dùng ở đây hay mang đi?'
          },
          {
            orderIndex: 6,
            speaker: 'user',
            characterName: 'You',
            text: 'To go, thank you! How much is it?',
            ipa: '/tu goʊ, θæŋk ju! haʊ mʌʧ ɪz ɪt?/',
            translation: 'Mang đi, cảm ơn bạn! Hết bao nhiêu tiền vậy?'
          },
          {
            orderIndex: 7,
            speaker: 'ai',
            characterName: 'Barista',
            text: 'That will be 4 dollars and 50 cents. You can tap your card right here.',
            ipa: '/ðæt wɪl bi fɔr ˈdɑlərz ænd ˈfɪfti sɛnts. ju kæn tæp jʊər kɑrd raɪt hɪr./',
            translation: 'Tổng cộng là 4 đô 50 cent. Quý khách có thể quẹt thẻ ngay tại đây.'
          }
        ]
      }
    },
    include: {
      dialogues: true
    }
  });

  console.log(`✅ Đã tạo bài học mẫu: "${coffeeLesson.title}" gồm ${coffeeLesson.dialogues.length} câu thoại.`);
  console.log('🎉 Seed dữ liệu hoàn tất thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

