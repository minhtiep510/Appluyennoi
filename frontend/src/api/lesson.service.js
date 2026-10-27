import { apiClient } from './client';
import { createLessonPayload, createDialogueLinePayload } from '../types/lesson.dto';

/**
 * Bộ dữ liệu bài học IELTS Speaking & Giao tiếp mẫu (Fallback khi chưa bật Backend hoặc dùng thử nhanh)
 */
export const FALLBACK_LESSONS = [
  {
    id: 1,
    title: 'IELTS Speaking Part 1: Work, Study & Hometown',
    description:
      'Luyện phản xạ trả lời các câu hỏi mở đầu phổ biến nhất trong phòng thi IELTS Speaking Part 1 với từ vựng Band 7.5+.',
    level: 'B1',
    _count: { dialogues: 6 },
    dialogues: [
      {
        id: 101,
        lessonId: 1,
        speaker: 'ai',
        characterName: 'Examiner (IDP)',
        orderIndex: 1,
        text: 'Good morning. Could you tell me your full name and where you are from?',
        phonetic: '/ɡʊd ˈmɔːrnɪŋ. kʊd juː tel miː jɔːr fʊl neɪm ænd wer juː ɑːr frʌm/',
        translation: 'Chào buổi sáng. Bạn có thể cho tôi biết họ tên đầy đủ và bạn đến từ đâu không?',
      },
      {
        id: 102,
        lessonId: 1,
        speaker: 'user',
        characterName: 'Candidate',
        orderIndex: 2,
        text: 'Good morning. My name is Minh, and I come from Hanoi, the bustling capital city of Vietnam.',
        phonetic: '/ɡʊd ˈmɔːrnɪŋ. maɪ neɪm ɪz mɪn ænd aɪ kʌm frʌm hæˈnɔɪ ðə ˈbʌslɪŋ ˈkæpɪtl ˈsɪti ʌv ˌviːetˈnɑːm/',
        translation: 'Chào buổi sáng. Tên tôi là Minh, và tôi đến từ Hà Nội, thủ đô nhộn nhịp của Việt Nam.',
      },
      {
        id: 103,
        lessonId: 1,
        speaker: 'ai',
        characterName: 'Examiner (IDP)',
        orderIndex: 3,
        text: 'Do you work or are you a student at the moment?',
        phonetic: '/duː juː wɜːrk ɔːr ɑːr juː ə ˈstuːdnt æt ðə ˈmoʊmənt/',
        translation: 'Hiện tại bạn đang đi làm hay đang là sinh viên?',
      },
      {
        id: 104,
        lessonId: 1,
        speaker: 'user',
        characterName: 'Candidate',
        orderIndex: 4,
        text: 'I am currently a final year university student majoring in software engineering.',
        phonetic: '/aɪ æm ˈkɜːrəntli ə ˈfaɪnl jɪr ˌjuːnɪˈvɜːrsəti ˈstuːdnt ˈmeɪdʒərɪŋ ɪn ˈsɔːftwer ˌendʒɪˈnɪrɪŋ/',
        translation: 'Hiện tôi đang là sinh viên đại học năm cuối chuyên ngành kỹ thuật phần mềm.',
      },
      {
        id: 105,
        lessonId: 1,
        speaker: 'ai',
        characterName: 'Examiner (IDP)',
        orderIndex: 5,
        text: 'What do you enjoy most about your field of study?',
        phonetic: '/wʌt duː juː ɪnˈdʒɔɪ moʊst əˈbaʊt jɔːr fiːld ʌv ˈstʌdi/',
        translation: 'Điều bạn yêu thích nhất về ngành học của mình là gì?',
      },
      {
        id: 106,
        lessonId: 1,
        speaker: 'user',
        characterName: 'Candidate',
        orderIndex: 6,
        text: 'What fascinates me the most is solving complex real world problems through creative coding.',
        phonetic: '/wʌt ˈfæsɪneɪts miː ðə moʊst ɪz ˈsɑːlvɪŋ ˈkɑːmpleks ˈriːəl wɜːrld ˈprɑːbləmz θruː kriˈeɪtɪv ˈkoʊdɪŋ/',
        translation: 'Điều cuốn hút tôi nhất là giải quyết các bài toán thực tế phức tạp thông qua lập trình sáng tạo.',
      },
    ],
  },
  {
    id: 2,
    title: 'Ordering Coffee at a Specialty Cafe',
    description:
      'Tình huống giao tiếp thực tế tại quán cà phê: Gọi đồ uống, tùy chỉnh lượng đường đá và thanh toán tự nhiên như người bản xứ.',
    level: 'A1',
    _count: { dialogues: 6 },
    dialogues: [
      {
        id: 201,
        lessonId: 2,
        speaker: 'ai',
        characterName: 'Barista',
        orderIndex: 1,
        text: 'Hi there! Welcome to Lexi Cafe. What can I get started for you today?',
        phonetic: '/haɪ ðer ˈwelkəm tuː ˈleksi kæˈfeɪ wʌt kæn aɪ ɡet ˈstɑːrtɪd fɔːr juː təˈdeɪ/',
        translation: 'Xin chào! Chào mừng bạn đến với Lexi Cafe. Hôm nay tôi có thể làm món gì cho bạn nhỉ?',
      },
      {
        id: 202,
        lessonId: 2,
        speaker: 'user',
        characterName: 'Customer',
        orderIndex: 2,
        text: 'Hi! Could I please get a medium iced caramel macchiato with oat milk?',
        phonetic: '/haɪ kʊd aɪ pliːz ɡet ə ˈmiːdiəm aɪst ˈkærəmel ˌmɑːkiˈɑːtoʊ wɪð oʊt mɪlk/',
        translation: 'Chào bạn! Cho mình gọi một ly caramel macchiato đá cỡ vừa pha với sữa yến mạch nhé.',
      },
      {
        id: 203,
        lessonId: 2,
        speaker: 'ai',
        characterName: 'Barista',
        orderIndex: 3,
        text: 'Sure thing! Would you like standard sweetness or less sweet?',
        phonetic: '/ʃʊr θɪŋ wʊd juː laɪk ˈstændərd ˈswiːtnəs ɔːr les swiːt/',
        translation: 'Chắc chắn rồi! Bạn muốn độ ngọt tiêu chuẩn hay ít ngọt hơn?',
      },
      {
        id: 204,
        lessonId: 2,
        speaker: 'user',
        characterName: 'Customer',
        orderIndex: 4,
        text: 'Half sweet please, and could I also have a warm almond croissant?',
        phonetic: '/hæf swiːt pliːz ænd kʊd aɪ ˈɔːlsoʊ hæv ə wɔːrm ˈɑːmənd kwɑːˈsɑːnt/',
        translation: 'Cho mình giảm nửa đường nhé, và lấy thêm một chiếc bánh sừng bò hạnh nhân hâm nóng.',
      },
      {
        id: 205,
        lessonId: 2,
        speaker: 'ai',
        characterName: 'Barista',
        orderIndex: 5,
        text: 'Absolutely. Will that be for here or to go?',
        phonetic: '/ˌæbsəˈluːtli wɪl ðæt biː fɔːr hɪr ɔːr tuː ɡoʊ/',
        translation: 'Tuyệt vời. Bạn dùng tại quán hay mang đi ạ?',
      },
      {
        id: 206,
        lessonId: 2,
        speaker: 'user',
        characterName: 'Customer',
        orderIndex: 6,
        text: 'For here please. I will pay by contactless card.',
        phonetic: '/fɔːr hɪr pliːz aɪ wɪl peɪ baɪ ˈkɑːntæktləs kɑːrd/',
        translation: 'Mình dùng tại quán nhé. Mình sẽ thanh toán bằng thẻ chạm.',
      },
    ],
  },
  {
    id: 3,
    title: 'IELTS Speaking Part 2 & 3: Artificial Intelligence',
    description:
      'Thảo luận chuyên sâu về tác động của Trí tuệ Nhân tạo (AI) đối với giáo dục và công việc tương lai (Mục tiêu Band 8.0).',
    level: 'C1',
    _count: { dialogues: 4 },
    dialogues: [
      {
        id: 301,
        lessonId: 3,
        speaker: 'ai',
        characterName: 'Examiner (BC)',
        orderIndex: 1,
        text: 'How has artificial intelligence transformed the way people learn foreign languages?',
        phonetic: '/haʊ hæz ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns trænsˈfɔːrmd ðə weɪ ˈpiːpl lɜːrn ˈfɔːrən ˈlæŋɡwɪdʒɪz/',
        translation: 'Trí tuệ nhân tạo đã thay đổi cách mọi người học ngoại ngữ như thế nào?',
      },
      {
        id: 302,
        lessonId: 3,
        speaker: 'user',
        characterName: 'Candidate',
        orderIndex: 2,
        text: 'Artificial intelligence provides instant personalized feedback on pronunciation and fluency.',
        phonetic: '/ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns prəˈvaɪdz ˈɪnstənt ˈpɜːrsənəlaɪzd ˈfiːdbæk ɑːn prəˌnʌnsiˈeɪʃn ænd ˈfluːənsi/',
        translation: 'Trí tuệ nhân tạo cung cấp phản hồi cá nhân hóa tức thì về phát âm và độ trôi chảy.',
      },
      {
        id: 303,
        lessonId: 3,
        speaker: 'ai',
        characterName: 'Examiner (BC)',
        orderIndex: 3,
        text: 'Do you think technology will eventually replace human teachers in the classroom?',
        phonetic: '/duː juː θɪŋk tekˈnɑːlədʒi wɪl ɪˈventʃuəli rɪˈpleɪs ˈhjuːmən ˈtiːtʃərz ɪn ðə ˈklæsruːm/',
        translation: 'Bạn có nghĩ công nghệ cuối cùng sẽ thay thế giáo viên con người trong lớp học không?',
      },
      {
        id: 304,
        lessonId: 3,
        speaker: 'user',
        characterName: 'Candidate',
        orderIndex: 4,
        text: 'While technology is a powerful supplement, human empathy and mentorship remain irreplaceable.',
        phonetic: '/waɪl tekˈnɑːlədʒi ɪz ə ˈpaʊərfl ˈsʌplɪmənt ˈhjuːmən ˈempəθi ænd ˈmentɔːrʃɪp rɪˈmeɪn ˌɪrɪˈpleɪsəbl/',
        translation: 'Mặc dù công nghệ là công cụ bổ trợ mạnh mẽ, sự thấu cảm và dẫn dắt của con người vẫn không thể thay thế.',
      },
    ],
  },
  {
    id: 4,
    title: 'Job Interview: Software Engineer Role',
    description:
      'Luyện phỏng vấn xin việc bằng tiếng Anh tại công ty công nghệ đa quốc gia: Giới thiệu bản thân, điểm mạnh và kinh nghiệm dự án.',
    level: 'B2',
    _count: { dialogues: 4 },
    dialogues: [
      {
        id: 401,
        lessonId: 4,
        speaker: 'ai',
        characterName: 'Hiring Manager',
        orderIndex: 1,
        text: 'Thank you for joining us today. Could you walk me through your background?',
        phonetic: '/θæŋk juː fɔːr ˈdʒɔɪnɪŋ ʌs təˈdeɪ kʊd juː wɔːk miː θruː jɔːr ˈbækɡraʊnd/',
        translation: 'Cảm ơn bạn đã tham gia hôm nay. Bạn có thể giới thiệu sơ lược về nền tảng của mình không?',
      },
      {
        id: 402,
        lessonId: 4,
        speaker: 'user',
        characterName: 'Applicant',
        orderIndex: 2,
        text: 'Certainly. I have two years of experience building scalable fullstack web applications.',
        phonetic: '/ˈsɜːrtnli aɪ hæv tuː jɪrz ʌv ɪkˈspɪriəns ˈbɪldɪŋ ˈskeɪləbl ˈfʊlstæk web ˌæplɪˈkeɪʃnz/',
        translation: 'Chắc chắn rồi. Tôi có hai năm kinh nghiệm xây dựng các ứng dụng web fullstack có khả năng mở rộng.',
      },
      {
        id: 403,
        lessonId: 4,
        speaker: 'ai',
        characterName: 'Hiring Manager',
        orderIndex: 3,
        text: 'How do you handle tight deadlines when working on a complex team project?',
        phonetic: '/haʊ duː juː ˈhændl taɪt ˈdedlaɪnz wen ˈwɜːrkɪŋ ɑːn ə ˈkɑːmpleks tiːm ˈprɑːdʒekt/',
        translation: 'Bạn xử lý các hạn chót gấp gáp như thế nào khi làm việc trong một dự án nhóm phức tạp?',
      },
      {
        id: 404,
        lessonId: 4,
        speaker: 'user',
        characterName: 'Applicant',
        orderIndex: 4,
        text: 'I prioritize critical tasks, communicate transparently with my team, and deliver incrementally.',
        phonetic: '/aɪ praɪˈɔːrətaɪz ˈkrɪtɪkl tæsks kəˈmjuːnɪkeɪt trænsˈpærəntli wɪð maɪ tiːm ænd dɪˈlɪvər ˌɪŋkrəˈmentəli/',
        translation: 'Tôi ưu tiên các đầu việc quan trọng, giao tiếp minh bạch với nhóm và bàn giao theo từng giai đoạn.',
      },
    ],
  },
];

/**
 * Service lấy danh sách chủ đề, câu thoại và quản lý bài học (Admin)
 */
export const lessonService = {
  // Lấy tất cả chủ đề bài học (Tự động fallback sang dữ liệu mẫu nếu Backend chưa bật)
  async getLessons() {
    try {
      const res = await apiClient('/lessons');
      if (res.lessons && res.lessons.length > 0) {
        return res.lessons;
      }
      return FALLBACK_LESSONS;
    } catch {
      return FALLBACK_LESSONS;
    }
  },

  // Lấy chi tiết bài học kèm các câu thoại
  async getLessonById(lessonId) {
    try {
      const res = await apiClient(`/lessons/${lessonId}`);
      if (res.lesson) return res.lesson;
    } catch {
      // Fallback tìm trong danh sách bài học mẫu
    }
    const found = FALLBACK_LESSONS.find((l) => Number(l.id) === Number(lessonId));
    return found || FALLBACK_LESSONS[0];
  },

  // Admin: Tạo bài học
  async createLesson(data) {
    return apiClient('/admin/lessons', {
      method: 'POST',
      body: JSON.stringify(createLessonPayload(data)),
    });
  },

  // Admin: Cập nhật bài học
  async updateLesson(lessonId, data) {
    return apiClient(`/admin/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(createLessonPayload(data)),
    });
  },

  // Admin: Xóa bài học
  async deleteLesson(lessonId) {
    return apiClient(`/admin/lessons/${lessonId}`, {
      method: 'DELETE',
    });
  },

  // Admin: Lấy danh sách câu thoại của bài học
  async getDialoguesByLesson(lessonId) {
    try {
      const res = await apiClient(`/admin/lessons/${lessonId}/dialogues`);
      return res.dialogues || [];
    } catch {
      const found = FALLBACK_LESSONS.find((l) => Number(l.id) === Number(lessonId));
      return found?.dialogues || [];
    }
  },

  // Admin: Thêm câu thoại
  async createDialogueLine(lessonId, data) {
    return apiClient(`/admin/lessons/${lessonId}/dialogues`, {
      method: 'POST',
      body: JSON.stringify(createDialogueLinePayload(data)),
    });
  },

  // Admin: Sửa câu thoại
  async updateDialogueLine(dialogueId, data) {
    return apiClient(`/admin/dialogues/${dialogueId}`, {
      method: 'PUT',
      body: JSON.stringify(createDialogueLinePayload(data)),
    });
  },

  // Admin: Xóa câu thoại
  async deleteDialogueLine(dialogueId) {
    return apiClient(`/admin/dialogues/${dialogueId}`, {
      method: 'DELETE',
    });
  },

  // Admin: Sắp xếp lại thứ tự câu thoại
  async reorderDialogues(lessonId, items) {
    return apiClient(`/admin/lessons/${lessonId}/dialogues/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  },
};
