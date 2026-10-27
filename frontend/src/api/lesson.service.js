import { apiClient } from './client';
import { createLessonPayload, createDialogueLinePayload } from '../types/lesson.dto';

/**
 * Bộ dữ liệu bài học IELTS Speaking & Giao tiếp mẫu (Fallback khi chưa bật Backend hoặc dùng thử nhanh)
 */
export const FALLBACK_LESSONS = [
  {
    "id": "e9ec4739-9388-4d01-bfa8-6a1aa7a5e6a2",
    "title": "IELTS Speaking Part 1: Work, Study & Hometown",
    "description": "Luyện phản xạ trả lời tự nhiên với giám khảo AI trong phần thi mở đầu IELTS Speaking Part 1 về công việc, ngành học và quê hương.",
    "level": "B1",
    "_count": {
      "dialogues": 6
    },
    "dialogues": [
      {
        "id": 137,
        "lessonId": "e9ec4739-9388-4d01-bfa8-6a1aa7a5e6a2",
        "speaker": "ai",
        "characterName": "Examiner (IDP)",
        "orderIndex": 1,
        "text": "Good morning! Could you tell me your full name and whether you are working or studying right now?",
        "phonetic": "/ɡʊd ˈmɔːrnɪŋ! kʊd juː tel miː jʊr fʊl neɪm ænd ˈweðər juː ɑːr ˈwɜːrkɪŋ ɔːr ˈstʌdiɪŋ raɪt naʊ?/",
        "translation": "Chào buổi sáng! Bạn có thể giới thiệu họ tên đầy đủ và hiện tại bạn đang đi làm hay đi học không?"
      },
      {
        "id": 138,
        "lessonId": "e9ec4739-9388-4d01-bfa8-6a1aa7a5e6a2",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 2,
        "text": "I am currently a final year university student majoring in software engineering.",
        "phonetic": "/aɪ æm ˈkɜːrəntli ə ˈfaɪnl jɪr ˌjuːnɪˈvɜːrsəti ˈstuːdnt ˈmeɪdʒərɪŋ ɪn ˈsɔːftwer ˌendʒɪˈnɪrɪŋ./",
        "translation": "Hiện tại tôi đang là sinh viên đại học năm cuối chuyên ngành kỹ thuật phần mềm."
      },
      {
        "id": 139,
        "lessonId": "e9ec4739-9388-4d01-bfa8-6a1aa7a5e6a2",
        "speaker": "ai",
        "characterName": "Examiner (IDP)",
        "orderIndex": 3,
        "text": "That sounds fascinating! Why did you choose to study software engineering?",
        "phonetic": "/ðæt saʊndz ˈfæsɪneɪtɪŋ! waɪ dɪd juː tʃuːz tuː ˈstʌdi ˈsɔːftwer ˌendʒɪˈnɪrɪŋ?/",
        "translation": "Nghe thật thú vị! Tại sao bạn lại chọn theo học ngành kỹ thuật phần mềm?"
      },
      {
        "id": 140,
        "lessonId": "e9ec4739-9388-4d01-bfa8-6a1aa7a5e6a2",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 4,
        "text": "I have always been passionate about building practical applications that solve real-world problems.",
        "phonetic": "/aɪ hæv ˈɔːlweɪz bɪn ˈpæʃənət əˈbaʊt ˈbɪldɪŋ ˈpræktɪkl ˌæplɪˈkeɪʃnz ðæt sɑːlv ˈriːəl wɜːrld ˈprɑːbləmz./",
        "translation": "Tôi luôn đam mê việc xây dựng các ứng dụng thực tiễn giúp giải quyết các bài toán ngoài đời thực."
      },
      {
        "id": 141,
        "lessonId": "e9ec4739-9388-4d01-bfa8-6a1aa7a5e6a2",
        "speaker": "ai",
        "characterName": "Examiner (IDP)",
        "orderIndex": 5,
        "text": "Let us talk about your hometown. What do you like most about living there?",
        "phonetic": "/let ʌs tɔːk əˈbaʊt jʊr ˈhoʊmtaʊn. wʌt duː juː laɪk moʊst əˈbaʊt ˈlɪvɪŋ ðer?/",
        "translation": "Hãy nói về quê hương của bạn nhé. Điều bạn yêu thích nhất khi sống ở đó là gì?"
      },
      {
        "id": 142,
        "lessonId": "e9ec4739-9388-4d01-bfa8-6a1aa7a5e6a2",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 6,
        "text": "What I love most is the peaceful atmosphere, friendly neighbors, and delicious local street food.",
        "phonetic": "/wʌt aɪ lʌv moʊst ɪz ðə ˈpiːsfl ˈætməsfɪr, ˈfrendli ˈneɪbərz, ænd dɪˈlɪʃəs ˈloʊkl striːt fuːd./",
        "translation": "Điều tôi yêu nhất là bầu không khí yên bình, hàng xóm thân thiện và ẩm thực đường phố tuyệt ngon."
      }
    ]
  },
  {
    "id": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
    "title": "Ordering Coffee at a Cafe",
    "description": "Luyện tập hội thoại giao tiếp cơ bản khi đi gọi đồ uống và bánh ngọt tại quán cà phê quốc tế.",
    "level": "A1",
    "_count": {
      "dialogues": 7
    },
    "dialogues": [
      {
        "id": 143,
        "lessonId": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
        "speaker": "ai",
        "characterName": "Barista",
        "orderIndex": 1,
        "text": "Hi there! Welcome to Star Coffee. What can I get for you today?",
        "phonetic": "/haɪ ðɛr! ˈwɛlkəm tu stɑr ˈkɔfi. wʌt kæn aɪ gɛt fɔr ju təˈdeɪ?/",
        "translation": "Xin chào! Chào mừng quý khách đến Star Coffee. Quý khách muốn dùng gì hôm nay ạ?"
      },
      {
        "id": 144,
        "lessonId": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
        "speaker": "user",
        "characterName": "You",
        "orderIndex": 2,
        "text": "Could I have a medium iced latte with oat milk, please?",
        "phonetic": "/kʊd aɪ hæv ə ˈmidiəm aɪst ˈlɑteɪ wɪð oʊt mɪlk, pliz?/",
        "translation": "Cho tôi một ly latte đá cỡ vừa với sữa yến mạch được không?"
      },
      {
        "id": 145,
        "lessonId": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
        "speaker": "ai",
        "characterName": "Barista",
        "orderIndex": 3,
        "text": "Sure thing! Would you like any sugar or flavor syrup in that?",
        "phonetic": "/ʃʊr θɪŋ! wʊd ju laɪk ˈɛni ˈʃʊgər ɔr ˈfleɪvər ˈsɪrəp ɪn ðæt?/",
        "translation": "Được chứ ạ! Bạn có muốn thêm đường hay si-rô hương vị gì không?"
      },
      {
        "id": 146,
        "lessonId": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
        "speaker": "user",
        "characterName": "You",
        "orderIndex": 4,
        "text": "Just one pump of vanilla syrup, and less sugar please.",
        "phonetic": "/ʤʌst wʌn pʌmp ʌv vəˈnɪlə ˈsɪrəp, ænd lɛs ˈʃʊgər pliz./",
        "translation": "Chỉ cần một chút si-rô vani, và ít đường thôi nhé."
      },
      {
        "id": 147,
        "lessonId": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
        "speaker": "ai",
        "characterName": "Barista",
        "orderIndex": 5,
        "text": "Got it. For here or to go?",
        "phonetic": "/gɑt ɪt. fɔr hɪr ɔr tu goʊ?/",
        "translation": "Tôi hiểu rồi. Bạn dùng ở đây hay mang đi?"
      },
      {
        "id": 148,
        "lessonId": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
        "speaker": "user",
        "characterName": "You",
        "orderIndex": 6,
        "text": "To go, thank you! How much is it?",
        "phonetic": "/tu goʊ, θæŋk ju! haʊ mʌʧ ɪz ɪt?/",
        "translation": "Mang đi, cảm ơn bạn! Hết bao nhiêu tiền vậy?"
      },
      {
        "id": 149,
        "lessonId": "d52d18fe-bec8-4ef7-8e4a-14fae4c378b2",
        "speaker": "ai",
        "characterName": "Barista",
        "orderIndex": 7,
        "text": "That will be 4 dollars and 50 cents. You can tap your card right here.",
        "phonetic": "/ðæt wɪl bi fɔr ˈdɑlərz ænd ˈfɪfti sɛnts. ju kæn tæp jʊər kɑrd raɪt hɪr./",
        "translation": "Tổng cộng là 4 đô 50 cent. Quý khách có thể quẹt thẻ ngay tại đây."
      }
    ]
  },
  {
    "id": "0fc44985-9ec0-46c0-840a-392d4fe9cf96",
    "title": "IELTS Speaking Part 2 & 3: Artificial Intelligence & Future Tech",
    "description": "Chủ đề nâng cao Band 7.5+ thảo luận sâu về tác động của Trí tuệ nhân tạo (AI) đối với giáo dục và thị trường việc làm.",
    "level": "C1",
    "_count": {
      "dialogues": 6
    },
    "dialogues": [
      {
        "id": 150,
        "lessonId": "0fc44985-9ec0-46c0-840a-392d4fe9cf96",
        "speaker": "ai",
        "characterName": "Examiner (BC)",
        "orderIndex": 1,
        "text": "In what ways has artificial intelligence transformed the way people learn foreign languages?",
        "phonetic": "/ɪn wʌt weɪz hæz ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns trænsˈfɔːrmd ðə weɪ ˈpiːpl lɜːrn ˈfɔːrən ˈlæŋɡwɪdʒɪz?/",
        "translation": "Trí tuệ nhân tạo đã thay đổi cách con người học ngoại ngữ theo những khía cạnh nào?"
      },
      {
        "id": 151,
        "lessonId": "0fc44985-9ec0-46c0-840a-392d4fe9cf96",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 2,
        "text": "Artificial intelligence enables learners to practice real-time pronunciation and receive instant personalized feedback.",
        "phonetic": "/ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns ɪˈneɪblz ˈlɜːrnərz tuː ˈpræktɪs ˈriːəl taɪm prəˌnʌnsiˈeɪʃn ænd rɪˈsiːv ˈɪnstənt ˈpɜːrsənəlaɪzd ˈfiːdbæk./",
        "translation": "Trí tuệ nhân tạo giúp người học luyện phát âm theo thời gian thực và nhận phản hồi cá nhân hóa tức thì."
      },
      {
        "id": 152,
        "lessonId": "0fc44985-9ec0-46c0-840a-392d4fe9cf96",
        "speaker": "ai",
        "characterName": "Examiner (BC)",
        "orderIndex": 3,
        "text": "Do you think AI tutors will completely replace human teachers in the near future?",
        "phonetic": "/duː juː θɪŋk ˌeɪˈaɪ ˈtuːtərz wɪl kəmˈpliːtli rɪˈpleɪs ˈhjuːmən ˈtiːtʃərz ɪn ðə nɪr ˈfjuːtʃər?/",
        "translation": "Bạn có nghĩ gia sư AI sẽ thay thế hoàn toàn giáo viên con người trong tương lai gần không?"
      },
      {
        "id": 153,
        "lessonId": "0fc44985-9ec0-46c0-840a-392d4fe9cf96",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 4,
        "text": "While AI is a powerful supplementary tool, human teachers still play an irreplaceable role in emotional intelligence and mentorship.",
        "phonetic": "/waɪl ˌeɪˈaɪ ɪz ə ˈpaʊərfl ˌsʌplɪˈmentəri tuːl, ˈhjuːmən ˈtiːtʃərz stɪl pleɪ ən ˌɪrɪˈpleɪsəbl roʊl ɪn ɪˈmoʊʃənl ɪnˈtelɪdʒəns ænd ˈmentɔːrʃɪp./",
        "translation": "Dù AI là công cụ bổ trợ mạnh mẽ, giáo viên con người vẫn đóng vai trò không thể thay thế về trí tuệ cảm xúc và sự dẫn dắt."
      },
      {
        "id": 154,
        "lessonId": "0fc44985-9ec0-46c0-840a-392d4fe9cf96",
        "speaker": "ai",
        "characterName": "Examiner (BC)",
        "orderIndex": 5,
        "text": "What skills should young people develop to stay competitive in the age of automation?",
        "phonetic": "/wʌt skɪlz ʃʊd jʌŋ ˈpiːpl dɪˈveləp tuː steɪ kəmˈpetətɪv ɪn ði eɪdʒ ʌv ˌɔːtəˈmeɪʃn?/",
        "translation": "Người trẻ nên trau dồi những kỹ năng gì để giữ vững lợi thế cạnh tranh trong kỷ nguyên tự động hóa?"
      },
      {
        "id": 155,
        "lessonId": "0fc44985-9ec0-46c0-840a-392d4fe9cf96",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 6,
        "text": "Young professionals should focus on critical thinking, creativity, and adaptability alongside digital literacy.",
        "phonetic": "/jʌŋ prəˈfeʃənlz ʃʊd ˈfoʊkəs ɑːn ˈkrɪtɪkl ˈθɪŋkɪŋ, ˌkriːeɪˈtɪvəti, ænd əˌdæptəˈbɪləti əˈlɔːŋsaɪd ˈdɪdʒɪtl ˈlɪtərəsi./",
        "translation": "Những người trẻ nên tập trung vào tư duy phản biện, sự sáng tạo và khả năng thích ứng song song với kỹ năng số."
      }
    ]
  },
  {
    "id": "9e801617-adf4-4b71-8b26-e458c3703713",
    "title": "Software Engineer & Tech Job Interview",
    "description": "Tình huống phỏng vấn xin việc ngành Công nghệ thông tin (IT / Fullstack Developer) bằng tiếng Anh với nhà tuyển dụng quốc tế.",
    "level": "B2",
    "_count": {
      "dialogues": 6
    },
    "dialogues": [
      {
        "id": 156,
        "lessonId": "9e801617-adf4-4b71-8b26-e458c3703713",
        "speaker": "ai",
        "characterName": "Tech Recruiter",
        "orderIndex": 1,
        "text": "Welcome to the interview! Could you walk me through your experience with fullstack web development?",
        "phonetic": "/ˈwelkəm tuː ði ˈɪntərvjuː! kʊd juː wɔːk miː θruː jʊr ɪkˈspɪriəns wɪð ˈfʊlstæk web dɪˈveləpmənt?/",
        "translation": "Chào mừng bạn đến buổi phỏng vấn! Bạn có thể chia sẻ về kinh nghiệm phát triển web fullstack của mình không?"
      },
      {
        "id": 157,
        "lessonId": "9e801617-adf4-4b71-8b26-e458c3703713",
        "speaker": "user",
        "characterName": "Applicant",
        "orderIndex": 2,
        "text": "I have built several web applications using React on the frontend and Node.js with SQL databases on the backend.",
        "phonetic": "/aɪ hæv bɪlt ˈsevrəl web ˌæplɪˈkeɪʃnz ˈjuːzɪŋ riˈækt ɑːn ðə ˈfrʌntend ænd noʊd dʒeɪ es wɪð ˈsiːkwəl ˈdeɪtəbeɪsɪz ɑːn ðə ˈbækend./",
        "translation": "Tôi đã xây dựng nhiều ứng dụng web sử dụng React ở frontend và Node.js kết hợp cơ sở dữ liệu SQL ở backend."
      },
      {
        "id": 158,
        "lessonId": "9e801617-adf4-4b71-8b26-e458c3703713",
        "speaker": "ai",
        "characterName": "Tech Recruiter",
        "orderIndex": 3,
        "text": "How do you usually handle challenging bugs or tight project deadlines in a team?",
        "phonetic": "/haʊ duː juː ˈjuːʒuəli ˈhændl ˈtʃælɪndʒɪŋ bʌɡz ɔːr taɪt ˈprɑːdʒekt ˈdedlaɪnz ɪn ə tiːm?/",
        "translation": "Bạn thường xử lý các lỗi phức tạp hoặc tiến độ dự án gấp rút trong nhóm như thế nào?"
      },
      {
        "id": 159,
        "lessonId": "9e801617-adf4-4b71-8b26-e458c3703713",
        "speaker": "user",
        "characterName": "Applicant",
        "orderIndex": 4,
        "text": "I prioritize tasks clearly, communicate early with my teammates, and break complex issues into smaller steps.",
        "phonetic": "/aɪ praɪˈɔːrətaɪz tæsks ˈklɪrli, kəˈmjuːnɪkeɪt ˈɜːrli wɪð maɪ ˈtiːmmeɪts, ænd breɪk kəmˈpleks ˈɪʃuːz ˈɪntuː ˈsmɔːlər steps./",
        "translation": "Tôi sắp xếp thứ tự ưu tiên rõ ràng, trao đổi sớm với đồng đội và chia nhỏ vấn đề phức tạp thành từng bước."
      },
      {
        "id": 160,
        "lessonId": "9e801617-adf4-4b71-8b26-e458c3703713",
        "speaker": "ai",
        "characterName": "Tech Recruiter",
        "orderIndex": 5,
        "text": "Impressive! Where do you see yourself professionally in the next three years?",
        "phonetic": "/ɪmˈpresɪv! wer duː juː siː jərˈself prəˈfeʃənəli ɪn ðə nekst θriː jɪrz?/",
        "translation": "Rất ấn tượng! Bạn định hướng sự nghiệp của mình trong 3 năm tới như thế nào?"
      },
      {
        "id": 161,
        "lessonId": "9e801617-adf4-4b71-8b26-e458c3703713",
        "speaker": "user",
        "characterName": "Applicant",
        "orderIndex": 6,
        "text": "I aim to become a senior software architect leading scalable cloud and AI-driven products.",
        "phonetic": "/aɪ eɪm tuː bɪˈkʌm ə ˈsiːniər ˈsɔːftwer ˈɑːrkɪtekt ˈliːdɪŋ ˈskeɪləbl klaʊd ænd ˌeɪˈaɪ ˈdrɪvn ˈprɑːdʌkts./",
        "translation": "Tôi hướng tới vị trí kiến trúc sư phần mềm cấp cao dẫn dắt các sản phẩm đám mây và AI có khả năng mở rộng lớn."
      }
    ]
  },
  {
    "id": "237d15c4-5d3e-4c1c-877f-232e9f8e58b2",
    "title": "Airport Check-in, Immigration & Flight Boarding",
    "description": "Hội thoại thiết yếu khi làm thủ tục tại sân bay quốc tế, ký gửi hành lý, chọn chỗ ngồi và qua cửa hải quan.",
    "level": "A2",
    "_count": {
      "dialogues": 6
    },
    "dialogues": [
      {
        "id": 162,
        "lessonId": "237d15c4-5d3e-4c1c-877f-232e9f8e58b2",
        "speaker": "ai",
        "characterName": "Ground Staff",
        "orderIndex": 1,
        "text": "Good afternoon! May I see your passport and flight ticket, please?",
        "phonetic": "/ɡʊd ˌæftərˈnuːn! meɪ aɪ siː jʊr ˈpæspɔːrt ænd flaɪt ˈtɪkɪt, pliːz?/",
        "translation": "Chào buổi chiều! Cho tôi xem hộ chiếu và vé máy bay của quý khách được không ạ?"
      },
      {
        "id": 163,
        "lessonId": "237d15c4-5d3e-4c1c-877f-232e9f8e58b2",
        "speaker": "user",
        "characterName": "Passenger",
        "orderIndex": 2,
        "text": "Here is my passport. Could I get a window seat near the front of the plane?",
        "phonetic": "/hɪr ɪz maɪ ˈpæspɔːrt. kʊd aɪ ɡet ə ˈwɪndoʊ siːt nɪr ðə frʌnt ʌv ðə pleɪn?/",
        "translation": "Hộ chiếu của tôi đây. Tôi có thể xin một ghế cạnh cửa sổ gần phía đầu máy bay được không?"
      },
      {
        "id": 164,
        "lessonId": "237d15c4-5d3e-4c1c-877f-232e9f8e58b2",
        "speaker": "ai",
        "characterName": "Ground Staff",
        "orderIndex": 3,
        "text": "Certainly! Are you checking in any bags today or just carrying a backpack?",
        "phonetic": "/ˈsɜːrtnli! ɑːr juː ˈtʃekɪŋ ɪn ˈeni bæɡz təˈdeɪ ɔːr dʒʌst ˈkæriɪŋ ə ˈbækpæk?/",
        "translation": "Chắc chắn rồi! Hôm nay quý khách có ký gửi hành lý nào không hay chỉ mang ba lô xách tay?"
      },
      {
        "id": 165,
        "lessonId": "237d15c4-5d3e-4c1c-877f-232e9f8e58b2",
        "speaker": "user",
        "characterName": "Passenger",
        "orderIndex": 4,
        "text": "I have one suitcase to check in and this small carry-on bag.",
        "phonetic": "/aɪ hæv wʌn ˈsuːtkeɪs tuː tʃek ɪn ænd ðɪs smɔːl ˈkæri ɑːn bæɡ./",
        "translation": "Tôi có một vali cần ký gửi và chiếc túi xách tay nhỏ này."
      },
      {
        "id": 166,
        "lessonId": "237d15c4-5d3e-4c1c-877f-232e9f8e58b2",
        "speaker": "ai",
        "characterName": "Ground Staff",
        "orderIndex": 5,
        "text": "Here is your boarding pass. Your flight boards at Gate 18 at six thirty.",
        "phonetic": "/hɪr ɪz jʊr ˈbɔːrdɪŋ pæs. jʊr flaɪt bɔːrdz æt ɡeɪt eɪˈtiːn æt sɪks ˈθɜːrti./",
        "translation": "Thẻ lên máy bay của quý khách đây. Chuyến bay sẽ mở cửa tại Cổng 18 lúc 6 giờ 30."
      },
      {
        "id": 167,
        "lessonId": "237d15c4-5d3e-4c1c-877f-232e9f8e58b2",
        "speaker": "user",
        "characterName": "Passenger",
        "orderIndex": 6,
        "text": "Thank you very much for your help! Have a great day.",
        "phonetic": "/θæŋk juː ˈveri mʌtʃ fɔːr jʊr help! hæv ə ɡreɪt deɪ./",
        "translation": "Cảm ơn sự giúp đỡ của bạn rất nhiều! Chúc bạn một ngày tốt lành."
      }
    ]
  },
  {
    "id": "5cccee50-9b72-4b9d-9162-bc6bb93837b3",
    "title": "IELTS Speaking Part 1: Travel, Holidays & Culture",
    "description": "Luyện từ vựng chủ đề Du lịch, Kỳ nghỉ và Khám phá văn hóa mới trong bài thi IELTS Speaking.",
    "level": "B2",
    "_count": {
      "dialogues": 4
    },
    "dialogues": [
      {
        "id": 168,
        "lessonId": "5cccee50-9b72-4b9d-9162-bc6bb93837b3",
        "speaker": "ai",
        "characterName": "Examiner (IDP)",
        "orderIndex": 1,
        "text": "Do you enjoy traveling to new places during your holidays?",
        "phonetic": "/duː juː ɪnˈdʒɔɪ ˈtrævlɪŋ tuː nuː ˈpleɪsɪz ˈdʊrɪŋ jʊr ˈhɑːlədeɪz?/",
        "translation": "Bạn có thích đi du lịch đến những vùng đất mới vào kỳ nghỉ của mình không?"
      },
      {
        "id": 169,
        "lessonId": "5cccee50-9b72-4b9d-9162-bc6bb93837b3",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 2,
        "text": "Yes, definitely! Traveling allows me to recharge my energy and experience diverse cultures firsthand.",
        "phonetic": "/jes, ˈdefɪnətli! ˈtrævlɪŋ əˈlaʊz miː tuː ˌriːˈtʃɑːrdʒ maɪ ˈenərdʒi ænd ɪkˈspɪriəns daɪˈvɜːrs ˈkʌltʃərz ˌfɜːrstˈhænd./",
        "translation": "Có, chắc chắn rồi! Đi du lịch giúp tôi nạp lại năng lượng và trực tiếp trải nghiệm những nền văn hóa đa dạng."
      },
      {
        "id": 170,
        "lessonId": "5cccee50-9b72-4b9d-9162-bc6bb93837b3",
        "speaker": "ai",
        "characterName": "Examiner (IDP)",
        "orderIndex": 3,
        "text": "Do you prefer traveling alone or going on a trip with your friends and family?",
        "phonetic": "/duː juː prɪˈfɜːr ˈtrævlɪŋ əˈloʊn ɔːr ˈɡoʊɪŋ ɑːn ə trɪp wɪð jʊr frendz ænd ˈfæməli?/",
        "translation": "Bạn thích đi du lịch một mình hay đi cùng bạn bè và gia đình hơn?"
      },
      {
        "id": 171,
        "lessonId": "5cccee50-9b72-4b9d-9162-bc6bb93837b3",
        "speaker": "user",
        "characterName": "Candidate",
        "orderIndex": 4,
        "text": "I prefer traveling with close friends because we can share unforgettable memories and split the travel expenses.",
        "phonetic": "/aɪ prɪˈfɜːr ˈtrævlɪŋ wɪð kloʊs frendz bɪˈkɔːz wiː kæn ʃer ˌʌnfərˈɡetəbl ˈmeməriz ænd splɪt ðə ˈtrævl ɪkˈspensɪz./",
        "translation": "Tôi thích đi cùng những người bạn thân vì chúng tôi có thể chia sẻ những kỷ niệm khó quên và chia sẻ chi phí chuyến đi."
      }
    ]
  },
  {
    "id": "a8c234a1-cb9f-4163-b340-41f4903d9e5b",
    "title": "Business Meeting & Project Pitching in English",
    "description": "Luyện kỹ năng thuyết trình dự án, báo cáo tiến độ và thảo luận chiến lược kinh doanh trong cuộc họp quốc tế.",
    "level": "C2",
    "_count": {
      "dialogues": 4
    },
    "dialogues": [
      {
        "id": 172,
        "lessonId": "a8c234a1-cb9f-4163-b340-41f4903d9e5b",
        "speaker": "ai",
        "characterName": "Product Director",
        "orderIndex": 1,
        "text": "Good morning everyone! Let us kick off today meeting with an update on the Q4 product launch.",
        "phonetic": "/ɡʊd ˈmɔːrnɪŋ ˈevriwʌn! let ʌs kɪk ɔːf təˈdeɪ ˈmiːtɪŋ wɪð ən ˈʌpdeɪt ɑːn ðə kjuː fɔːr ˈprɑːdʌkt lɔːntʃ./",
        "translation": "Chào buổi sáng mọi người! Hãy bắt đầu cuộc họp hôm nay với phần cập nhật về đợt ra mắt sản phẩm Quý 4."
      },
      {
        "id": 173,
        "lessonId": "a8c234a1-cb9f-4163-b340-41f4903d9e5b",
        "speaker": "user",
        "characterName": "Project Lead",
        "orderIndex": 2,
        "text": "Our engineering team has completed ninety percent of the core features and we are on track for beta testing next week.",
        "phonetic": "/ɑːr ˌendʒɪˈnɪrɪŋ tiːm hæz kəmˈpliːtɪd ˈnaɪnti pərˈsent ʌv ðə kɔːr ˈfiːtʃərz ænd wiː ɑːr ɑːn træk fɔːr ˈbeɪtə ˈtestɪŋ nekst wiːk./",
        "translation": "Đội ngũ kỹ thuật của chúng tôi đã hoàn thành 90% tính năng cốt lõi và đang đúng tiến độ để thử nghiệm beta vào tuần tới."
      },
      {
        "id": 174,
        "lessonId": "a8c234a1-cb9f-4163-b340-41f4903d9e5b",
        "speaker": "ai",
        "characterName": "Product Director",
        "orderIndex": 3,
        "text": "That is great progress. Are there any potential bottlenecks we should be aware of?",
        "phonetic": "/ðæt ɪz ɡreɪt ˈprɑːɡres. ɑːr ðer ˈeni pəˈtenʃl ˈbɑːtlneks wiː ʃʊd biː əˈwer ʌv?/",
        "translation": "Tiến độ rất tốt. Có điểm nghẽn tiềm ẩn nào mà chúng ta cần lưu ý không?"
      },
      {
        "id": 175,
        "lessonId": "a8c234a1-cb9f-4163-b340-41f4903d9e5b",
        "speaker": "user",
        "characterName": "Project Lead",
        "orderIndex": 4,
        "text": "We need to optimize the real-time voice streaming latency to ensure a seamless user experience under heavy traffic.",
        "phonetic": "/wiː niːd tuː ˈɑːptɪmaɪz ðə ˈriːəl taɪm vɔɪs ˈstriːmɪŋ ˈleɪtnsi tuː ɪnˈʃʊr ə ˈsiːmləs ˈjuːzər ɪkˈspɪriəns ˈʌndər ˈhevi ˈtræfɪk./",
        "translation": "Chúng ta cần tối ưu hóa độ trễ truyền tải giọng nói thời gian thực để đảm bảo trải nghiệm mượt mà khi lượng truy cập cao."
      }
    ]
  },
  {
    "id": "a5badb36-fbf1-450b-9d8b-8d890b709a45",
    "title": "Hotel Reservation & Concierge Services",
    "description": "Giao tiếp tiếng Anh khi nhận phòng khách sạn, yêu cầu dịch vụ phòng và hỏi địa điểm tham quan địa phương.",
    "level": "A2",
    "_count": {
      "dialogues": 4
    },
    "dialogues": [
      {
        "id": 176,
        "lessonId": "a5badb36-fbf1-450b-9d8b-8d890b709a45",
        "speaker": "ai",
        "characterName": "Receptionist",
        "orderIndex": 1,
        "text": "Welcome to Grand Ocean Hotel! How may I assist you with your check-in today?",
        "phonetic": "/ˈwelkəm tuː ɡrænd ˈoʊʃn hoʊˈtel! haʊ meɪ aɪ əˈsɪst juː wɪð jʊr ˈtʃek ɪn təˈdeɪ?/",
        "translation": "Chào mừng quý khách đến Khách sạn Grand Ocean! Tôi có thể hỗ trợ quý khách nhận phòng hôm nay như thế nào ạ?"
      },
      {
        "id": 177,
        "lessonId": "a5badb36-fbf1-450b-9d8b-8d890b709a45",
        "speaker": "user",
        "characterName": "Guest",
        "orderIndex": 2,
        "text": "Hello! I have a reservation under the name Nguyen Minh for three nights.",
        "phonetic": "/həˈloʊ! aɪ hæv ə ˌrezərˈveɪʃn ˈʌndər ðə neɪm ˈwɪn mɪn fɔːr θriː naɪts./",
        "translation": "Xin chào! Tôi có đặt phòng dưới tên Nguyễn Minh trong ba đêm."
      },
      {
        "id": 178,
        "lessonId": "a5badb36-fbf1-450b-9d8b-8d890b709a45",
        "speaker": "ai",
        "characterName": "Receptionist",
        "orderIndex": 3,
        "text": "I found your booking for a deluxe ocean-view room. Breakfast is served from six to ten every morning.",
        "phonetic": "/aɪ faʊnd jʊr ˈbʊkɪŋ fɔːr ə dɪˈlʌks ˈoʊʃn vjuː ruːm. ˈbrekfəst ɪz sɜːrvd frʌm sɪks tuː ten ˈevri ˈmɔːrnɪŋ./",
        "translation": "Tôi đã tìm thấy đặt phòng hạng Deluxe hướng biển của quý khách. Bữa sáng được phục vụ từ 6 giờ đến 10 giờ mỗi sáng."
      },
      {
        "id": 179,
        "lessonId": "a5badb36-fbf1-450b-9d8b-8d890b709a45",
        "speaker": "user",
        "characterName": "Guest",
        "orderIndex": 4,
        "text": "Wonderful! Could I also request a late check-out on Sunday afternoon?",
        "phonetic": "/ˈwʌndərfl! kʊd aɪ ˈɔːlsoʊ rɪˈkwest ə leɪt ˈtʃek aʊt ɑːn ˈsʌndeɪ ˌæftərˈnuːn?/",
        "translation": "Tuyệt vời! Tôi có thể yêu cầu trả phòng muộn vào chiều Chủ nhật được không?"
      }
    ]
  }
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
