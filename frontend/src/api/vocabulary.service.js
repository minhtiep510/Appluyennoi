import { apiClient } from './client';

export const FALLBACK_VOCAB_TOPICS = [
  {
    "id": "topic-work-study",
    "name": "Work & Study",
    "level": "B1",
    "imageUrl": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    "description": "Các cụm từ vựng và collocations cho chủ đề Công việc, Ngành học và Quê hương trong IELTS Speaking Part 1.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-ai-tech",
    "name": "AI & Technology",
    "level": "C1",
    "imageUrl": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng học thuật nâng cao cho chủ đề Trí tuệ nhân tạo, Tự động hóa và Tương lai giáo dục.",
    "_count": {
      "vocabularies": 4
    }
  },
  {
    "id": "topic-job-business",
    "name": "Job & Business",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng phỏng vấn xin việc ngành IT/Kỹ thuật và thuyết trình dự án trong môi trường doanh nghiệp quốc tế.",
    "_count": {
      "vocabularies": 4
    }
  },
  {
    "id": "topic-travel-daily",
    "name": "Travel & Daily",
    "level": "A2",
    "imageUrl": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
    "description": "Cụm từ giao tiếp thông dụng khi đi du lịch, làm thủ tục sân bay, khách sạn và gọi đồ tại quán cà phê.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-environment-climate",
    "name": "Environment & Climate",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về bảo vệ môi trường, biến đổi khí hậu toàn cầu và các nguồn năng lượng tái tạo.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-education-schooling",
    "name": "Education & Schooling",
    "level": "B1",
    "imageUrl": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng chủ đề giáo dục, phương pháp học tập trực tuyến và phát triển kỹ năng mềm cho học sinh sinh viên.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-health-fitness",
    "name": "Health & Fitness",
    "level": "B1",
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về lối sống lành mạnh, chăm sóc thể chất, chế độ ăn uống cân bằng và rèn luyện thể thao.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-food-culinary",
    "name": "Food & Culinary",
    "level": "A1",
    "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về ẩm thực truyền thống, văn hóa ẩm thực đường phố, hương vị và các kỹ năng nấu nướng.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-science-innovation",
    "name": "Science & Innovation",
    "level": "C1",
    "imageUrl": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng học thuật về các phát minh khoa học, công nghệ lượng tử, sinh học và cách mạng công nghiệp.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-art-culture",
    "name": "Art & Culture",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về hội họa, kiến trúc, bảo tồn di sản nghệ thuật và bản sắc văn hóa dân tộc.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-media-entertainment",
    "name": "Media & Entertainment",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về mạng xã hội, phim ảnh, báo chí truyền thông và ảnh hưởng của truyền thông đại chúng.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-economy-finance",
    "name": "Economy & Finance",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về quản lý tài chính cá nhân, lạm phát, đầu tư chứng khoán và phát triển kinh tế vĩ mô.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-city-life-urbanization",
    "name": "City Life & Urbanization",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về quy hoạch đô thị, giao thông thành phố, nhịp sống bận rộn và thành phố thông minh.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-family-relationships",
    "name": "Family & Relationships",
    "level": "A1",
    "imageUrl": "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về tình cảm gia đình, tình bạn tri kỷ, sự hòa thuận và gắn kết giữa các thế hệ.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-sports-leisure",
    "name": "Sports & Leisure",
    "level": "A2",
    "imageUrl": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về các môn thể thao thi đấu, tinh thần đồng đội, sở thích cá nhân và rèn luyện thể lực.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-fashion-appearance",
    "name": "Fashion & Appearance",
    "level": "A2",
    "imageUrl": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về phong cách thời trang, trang phục công sở, xu hướng thời trang bền vững và ngoại hình.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-crime-law",
    "name": "Crime & Law",
    "level": "C1",
    "imageUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng học thuật về hệ thống tư pháp, luật pháp, phòng chống tội phạm và quyền con người.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-society-global-issues",
    "name": "Society & Global Issues",
    "level": "C1",
    "imageUrl": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về công bằng xã hội, xóa đói giảm nghèo, di cư quốc tế và hợp tác đa phương.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-psychology-personality",
    "name": "Psychology & Personality",
    "level": "C1",
    "imageUrl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về tính cách, trí tuệ cảm xúc (EQ), sự đồng cảm và phát triển sức mạnh nội tâm.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-history-heritage",
    "name": "History & Heritage",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về các thời kỳ lịch sử, hiện vật khảo cổ, bảo tàng và giá trị truyền thống dân tộc.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-space-astronomy",
    "name": "Space & Astronomy",
    "level": "C2",
    "imageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng nâng cao về khám phá vũ trụ, thiên văn học, các thiên thể và nhiệm vụ liên hành tinh.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-philosophy-ethics",
    "name": "Philosophy & Ethics",
    "level": "C2",
    "imageUrl": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng triết học và đạo đức học, lý luận logic, chuẩn mực xã hội và triết lý nhân sinh.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-tourism-hospitality",
    "name": "Tourism & Hospitality",
    "level": "B1",
    "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về dịch vụ khách sạn nghỉ dưỡng, đón tiếp khách hàng, đặt tour du lịch và trải nghiệm lữ hành.",
    "_count": {
      "vocabularies": 3
    }
  },
  {
    "id": "topic-marketing-advertising",
    "name": "Marketing & Advertising",
    "level": "B2",
    "imageUrl": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80",
    "description": "Từ vựng về tiếp thị kỹ thuật số, định vị thương hiệu, chiến dịch quảng cáo và hành vi người tiêu dùng.",
    "_count": {
      "vocabularies": 3
    }
  }
];

export const FALLBACK_VOCABULARIES = [
  {
    "id": 1,
    "topicId": "topic-work-study",
    "word": "Major in",
    "pos": "Phrasal Verb",
    "ipa": "/ˈmeɪdʒər ɪn/",
    "meaning": "Chuyên ngành học về (ở bậc đại học)",
    "level": "B1",
    "synonyms": "Specialize in, Focus on",
    "example": "I am currently a final year university student majoring in software engineering.",
    "exampleTrans": "Hiện tại tôi đang là sinh viên năm cuối đại học chuyên ngành kỹ thuật phần mềm.",
    "topic": {
      "id": "topic-work-study",
      "name": "Work & Study"
    }
  },
  {
    "id": 2,
    "topicId": "topic-work-study",
    "word": "Passionate about",
    "pos": "Adjective Phrase",
    "ipa": "/ˈpæʃənət əˈbaʊt/",
    "meaning": "Đam mê, nhiệt huyết với điều gì",
    "level": "B2",
    "synonyms": "Enthusiastic about, Keen on",
    "example": "I have always been passionate about building practical applications.",
    "exampleTrans": "Tôi luôn đam mê việc xây dựng các ứng dụng mang tính thực tiễn.",
    "topic": {
      "id": "topic-work-study",
      "name": "Work & Study"
    }
  },
  {
    "id": 3,
    "topicId": "topic-work-study",
    "word": "Peaceful atmosphere",
    "pos": "Noun Phrase",
    "ipa": "/ˈpiːsfl ˈætməsfɪr/",
    "meaning": "Bầu không khí yên bình, tĩnh lặng",
    "level": "B1",
    "synonyms": "Tranquil environment, Calm vibe",
    "example": "What I love most about my hometown is its peaceful atmosphere and friendly neighbors.",
    "exampleTrans": "Điều tôi yêu nhất ở quê hương mình là bầu không khí yên bình và hàng xóm thân thiện.",
    "topic": {
      "id": "topic-work-study",
      "name": "Work & Study"
    }
  },
  {
    "id": 4,
    "topicId": "topic-ai-tech",
    "word": "Artificial Intelligence",
    "pos": "Noun",
    "ipa": "/ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns/",
    "meaning": "Trí tuệ nhân tạo (AI)",
    "level": "B2",
    "synonyms": "Machine intelligence, AI systems",
    "example": "Artificial intelligence is transforming language learning by providing real-time personalized feedback.",
    "exampleTrans": "Trí tuệ nhân tạo đang làm thay đổi việc học ngôn ngữ bằng cách cung cấp phản hồi cá nhân hóa tức thời.",
    "topic": {
      "id": "topic-ai-tech",
      "name": "AI & Technology"
    }
  },
  {
    "id": 5,
    "topicId": "topic-ai-tech",
    "word": "Autonomous agent",
    "pos": "Noun Phrase",
    "ipa": "/ɔːˈtɑːnəməs ˈeɪdʒənt/",
    "meaning": "Tác tử tự hành thông minh có khả năng tự ra quyết định",
    "level": "C1",
    "synonyms": "Self-governing system, Intelligent bot",
    "example": "An autonomous agent can analyze user speech patterns and recommend targeted practice lessons.",
    "exampleTrans": "Một tác tử tự hành có thể phân tích cách nói của người dùng và đề xuất các bài luyện tập nhắm đúng trọng tâm.",
    "topic": {
      "id": "topic-ai-tech",
      "name": "AI & Technology"
    }
  },
  {
    "id": 6,
    "topicId": "topic-ai-tech",
    "word": "Speech recognition",
    "pos": "Noun Phrase",
    "ipa": "/spiːtʃ ˌrekəɡˈnɪʃn/",
    "meaning": "Công nghệ nhận diện giọng nói tự động",
    "level": "B2",
    "synonyms": "Voice recognition, Audio transcription",
    "example": "Our speech recognition engine scores user pronunciation accuracy down to each phoneme.",
    "exampleTrans": "Công cụ nhận diện giọng nói của chúng tôi chấm độ chính xác phát âm của người dùng tới từng âm tiết.",
    "topic": {
      "id": "topic-ai-tech",
      "name": "AI & Technology"
    }
  },
  {
    "id": 7,
    "topicId": "topic-ai-tech",
    "word": "Paradigm shift",
    "pos": "Noun Phrase",
    "ipa": "/ˈpærədaɪm ʃɪft/",
    "meaning": "Sự chuyển dịch mang tính thời đại / bước ngoặt nhận thức",
    "level": "C2",
    "synonyms": "Revolutionary change, Transformation",
    "example": "Generative AI has brought a paradigm shift to automated education systems.",
    "exampleTrans": "AI tạo sinh đã mang lại một bước ngoặt thời đại cho các hệ thống giáo dục tự động.",
    "topic": {
      "id": "topic-ai-tech",
      "name": "AI & Technology"
    }
  },
  {
    "id": 8,
    "topicId": "topic-job-business",
    "word": "Prioritize tasks",
    "pos": "Verb Phrase",
    "ipa": "/praɪˈɔːrətaɪz tæsks/",
    "meaning": "Sắp xếp thứ tự ưu tiên công việc",
    "level": "B2",
    "synonyms": "Organize workload, Rank priorities",
    "example": "I prioritize tasks clearly and communicate early with my teammates.",
    "exampleTrans": "Tôi sắp xếp thứ tự ưu tiên công việc rõ ràng và trao đổi sớm với đồng đội.",
    "topic": {
      "id": "topic-job-business",
      "name": "Job & Business"
    }
  },
  {
    "id": 9,
    "topicId": "topic-job-business",
    "word": "Scalable architecture",
    "pos": "Noun Phrase",
    "ipa": "/ˈskeɪləbl ˈɑːrkɪtektʃər/",
    "meaning": "Kiến trúc hệ thống có khả năng mở rộng lớn",
    "level": "C1",
    "synonyms": "Expandable system, High-capacity design",
    "example": "I aim to become a senior software architect leading scalable cloud products.",
    "exampleTrans": "Tôi hướng tới vị trí kiến trúc sư phần mềm cấp cao dẫn dắt các sản phẩm đám mây mở rộng lớn.",
    "topic": {
      "id": "topic-job-business",
      "name": "Job & Business"
    }
  },
  {
    "id": 10,
    "topicId": "topic-job-business",
    "word": "Potential bottleneck",
    "pos": "Noun Phrase",
    "ipa": "/pəˈtenʃl ˈbɑːtlnek/",
    "meaning": "Điểm nghẽn tiềm ẩn làm chậm tiến độ",
    "level": "C2",
    "synonyms": "Obstacle, Constraint",
    "example": "Are there any potential bottlenecks we should be aware of before the product launch?",
    "exampleTrans": "Có điểm nghẽn tiềm ẩn nào chúng ta cần lưu ý trước đợt ra mắt sản phẩm không?",
    "topic": {
      "id": "topic-job-business",
      "name": "Job & Business"
    }
  },
  {
    "id": 11,
    "topicId": "topic-job-business",
    "word": "Seamless experience",
    "pos": "Noun Phrase",
    "ipa": "/ˈsiːmləs ɪkˈspɪriəns/",
    "meaning": "Trải nghiệm mượt mà, liền mạch không gián đoạn",
    "level": "C1",
    "synonyms": "Smooth interaction, Flawless experience",
    "example": "We optimize voice streaming latency to ensure a seamless user experience.",
    "exampleTrans": "Chúng tôi tối ưu độ trễ truyền giọng nói để đảm bảo trải nghiệm người dùng mượt mà.",
    "topic": {
      "id": "topic-job-business",
      "name": "Job & Business"
    }
  },
  {
    "id": 12,
    "topicId": "topic-travel-daily",
    "word": "Recharge my energy",
    "pos": "Idiom / Phrase",
    "ipa": "/ˌriːˈtʃɑːrdʒ maɪ ˈenərdʒi/",
    "meaning": "Nạp lại năng lượng, thư giãn sau khi làm việc căng thẳng",
    "level": "B1",
    "synonyms": "Unwind, Refresh myself",
    "example": "Traveling allows me to recharge my energy and experience diverse cultures firsthand.",
    "exampleTrans": "Đi du lịch giúp tôi nạp lại năng lượng và trực tiếp trải nghiệm những nền văn hóa đa dạng.",
    "topic": {
      "id": "topic-travel-daily",
      "name": "Travel & Daily"
    }
  },
  {
    "id": 13,
    "topicId": "topic-travel-daily",
    "word": "Unforgettable memories",
    "pos": "Noun Phrase",
    "ipa": "/ˌʌnfərˈɡetəbl ˈmeməriz/",
    "meaning": "Những kỷ niệm đáng nhớ, khó quên",
    "level": "B2",
    "synonyms": "Lasting impressions, Memorable moments",
    "example": "I prefer traveling with close friends because we can share unforgettable memories.",
    "exampleTrans": "Tôi thích đi du lịch cùng bạn thân vì chúng tôi có thể chia sẻ những kỷ niệm khó quên.",
    "topic": {
      "id": "topic-travel-daily",
      "name": "Travel & Daily"
    }
  },
  {
    "id": 14,
    "topicId": "topic-travel-daily",
    "word": "Carry-on bag",
    "pos": "Noun",
    "ipa": "/ˈkæri ɑːn bæɡ/",
    "meaning": "Hành lý xách tay mang lên máy bay",
    "level": "B1",
    "synonyms": "Hand luggage, Cabin baggage",
    "example": "I have one suitcase to check in and this small carry-on bag.",
    "exampleTrans": "Tôi có một vali ký gửi và chiếc túi hành lý xách tay nhỏ này.",
    "topic": {
      "id": "topic-travel-daily",
      "name": "Travel & Daily"
    }
  },
  {
    "id": 15,
    "topicId": "topic-environment-climate",
    "word": "Renewable energy",
    "pos": "Noun Phrase",
    "ipa": "/rɪˈnuːəbl ˈenərdʒi/",
    "meaning": "Năng lượng tái tạo (điện gió, mặt trời)",
    "level": "B2",
    "synonyms": "Clean energy, Sustainable power",
    "example": "Governments should invest heavily in renewable energy to reduce reliance on fossil fuels.",
    "exampleTrans": "Các chính phủ nên đầu tư mạnh vào năng lượng tái tạo để giảm bớt sự phụ thuộc vào nhiên liệu hóa thạch.",
    "topic": {
      "id": "topic-environment-climate",
      "name": "Environment & Climate"
    }
  },
  {
    "id": 16,
    "topicId": "topic-environment-climate",
    "word": "Carbon footprint",
    "pos": "Noun Phrase",
    "ipa": "/ˈkɑːrbən ˈfʊtprɪnt/",
    "meaning": "Dấu chân carbon (lượng khí thải gây hiệu ứng nhà kính)",
    "level": "B2",
    "synonyms": "Greenhouse emission, Environmental impact",
    "example": "Using public transport is an effective way to minimize your individual carbon footprint.",
    "exampleTrans": "Sử dụng phương tiện công cộng là một cách hiệu quả để giảm thiểu dấu chân carbon của cá nhân bạn.",
    "topic": {
      "id": "topic-environment-climate",
      "name": "Environment & Climate"
    }
  },
  {
    "id": 17,
    "topicId": "topic-environment-climate",
    "word": "Biodiversity loss",
    "pos": "Noun Phrase",
    "ipa": "/ˌbaɪoʊdaɪˈvɜːrsəti lɔːs/",
    "meaning": "Sự suy giảm đa dạng sinh học",
    "level": "C1",
    "synonyms": "Species extinction, Ecological disruption",
    "example": "Deforestation in the Amazon rainforest accelerates biodiversity loss worldwide.",
    "exampleTrans": "Nạn phá rừng ở rừng nhiệt đới Amazon làm gia tăng tốc độ suy giảm đa dạng sinh học trên toàn thế giới.",
    "topic": {
      "id": "topic-environment-climate",
      "name": "Environment & Climate"
    }
  },
  {
    "id": 18,
    "topicId": "topic-education-schooling",
    "word": "Academic performance",
    "pos": "Noun Phrase",
    "ipa": "/ˌækəˈdemɪk pərˈfɔːrməns/",
    "meaning": "Kết quả học tập, thành tích học thuật",
    "level": "B1",
    "synonyms": "Scholastic achievement, Grades",
    "example": "Consistent self-study significantly boosts students academic performance.",
    "exampleTrans": "Việc kiên trì tự học nâng cao đáng kể kết quả học tập của học sinh.",
    "topic": {
      "id": "topic-education-schooling",
      "name": "Education & Schooling"
    }
  },
  {
    "id": 19,
    "topicId": "topic-education-schooling",
    "word": "Distance learning",
    "pos": "Noun Phrase",
    "ipa": "/ˈdɪstəns ˈlɜːrnɪŋ/",
    "meaning": "Học từ xa, học trực tuyến qua mạng",
    "level": "B1",
    "synonyms": "Online education, E-learning",
    "example": "Distance learning offers great flexibility for working adults pursuing higher degrees.",
    "exampleTrans": "Học từ xa mang lại sự linh hoạt lớn cho người đi làm theo đuổi các bằng cấp cao hơn.",
    "topic": {
      "id": "topic-education-schooling",
      "name": "Education & Schooling"
    }
  },
  {
    "id": 20,
    "topicId": "topic-education-schooling",
    "word": "Well-rounded curriculum",
    "pos": "Noun Phrase",
    "ipa": "/ˌwel ˈraʊndɪd kəˈrɪkjələm/",
    "meaning": "Chương trình học toàn diện (kết hợp lý thuyết và kỹ năng thực tế)",
    "level": "B2",
    "synonyms": "Comprehensive syllabus, Balanced education",
    "example": "Modern high schools aim to provide a well-rounded curriculum including arts and coding.",
    "exampleTrans": "Các trường trung học hiện đại hướng tới cung cấp chương trình học toàn diện bao gồm cả nghệ thuật và lập trình.",
    "topic": {
      "id": "topic-education-schooling",
      "name": "Education & Schooling"
    }
  },
  {
    "id": 21,
    "topicId": "topic-health-fitness",
    "word": "Balanced diet",
    "pos": "Noun Phrase",
    "ipa": "/ˌbælənst ˈdaɪət/",
    "meaning": "Chế độ ăn uống cân bằng dinh dưỡng",
    "level": "B1",
    "synonyms": "Nutritious meals, Healthy eating",
    "example": "Maintaining a balanced diet rich in vegetables prevents many chronic diseases.",
    "exampleTrans": "Duy trì một chế độ ăn uống cân bằng giàu rau củ giúp ngăn ngừa nhiều bệnh mãn tính.",
    "topic": {
      "id": "topic-health-fitness",
      "name": "Health & Fitness"
    }
  },
  {
    "id": 22,
    "topicId": "topic-health-fitness",
    "word": "Sedentary lifestyle",
    "pos": "Noun Phrase",
    "ipa": "/ˈsednteri ˈlaɪfstaɪl/",
    "meaning": "Lối sống ít vận động, ngồi nhiều một chỗ",
    "level": "B2",
    "synonyms": "Inactive lifestyle, Desk-bound routine",
    "example": "Office workers are at higher risk of back pain due to a sedentary lifestyle.",
    "exampleTrans": "Dân văn phòng có nguy cơ đau lưng cao hơn do lối sống ngồi nhiều ít vận động.",
    "topic": {
      "id": "topic-health-fitness",
      "name": "Health & Fitness"
    }
  },
  {
    "id": 23,
    "topicId": "topic-health-fitness",
    "word": "Mental wellbeing",
    "pos": "Noun Phrase",
    "ipa": "/ˈmentl ˌwelˈbiːɪŋ/",
    "meaning": "Sức khỏe tinh thần, trạng thái an yên trong tâm trí",
    "level": "B2",
    "synonyms": "Psychological health, Peace of mind",
    "example": "Daily meditation and physical workouts contribute greatly to your mental wellbeing.",
    "exampleTrans": "Thiền định hàng ngày và rèn luyện thể chất đóng góp rất lớn vào sức khỏe tinh thần của bạn.",
    "topic": {
      "id": "topic-health-fitness",
      "name": "Health & Fitness"
    }
  },
  {
    "id": 24,
    "topicId": "topic-food-culinary",
    "word": "Street food delicacies",
    "pos": "Noun Phrase",
    "ipa": "/striːt fuːd ˈdelɪkəsiz/",
    "meaning": "Các món ngon ẩm thực đường phố",
    "level": "B1",
    "synonyms": "Local cuisine, Traditional street snacks",
    "example": "Foreign tourists in Hanoi always enjoy tasting famous street food delicacies.",
    "exampleTrans": "Khách du lịch nước ngoài tại Hà Nội luôn thích thưởng thức các món ẩm thực đường phố nổi tiếng.",
    "topic": {
      "id": "topic-food-culinary",
      "name": "Food & Culinary"
    }
  },
  {
    "id": 25,
    "topicId": "topic-food-culinary",
    "word": "Mouth-watering aroma",
    "pos": "Noun Phrase",
    "ipa": "/ˈmaʊθ wɔːtərɪŋ əˈroʊmə/",
    "meaning": "Mùi hương thơm nức mũi khiến thèm ăn",
    "level": "B2",
    "synonyms": "Tempting scent, Delicious smell",
    "example": "The mouth-watering aroma of freshly baked bread filled the entire neighborhood.",
    "exampleTrans": "Mùi thơm nức mũi của bánh mì mới nướng lan tỏa khắp cả khu phố.",
    "topic": {
      "id": "topic-food-culinary",
      "name": "Food & Culinary"
    }
  },
  {
    "id": 26,
    "topicId": "topic-food-culinary",
    "word": "Authentic flavor",
    "pos": "Noun Phrase",
    "ipa": "/ɔːˈθentɪk ˈfleɪvər/",
    "meaning": "Hương vị nguyên bản, chính gốc truyền thống",
    "level": "B2",
    "synonyms": "Genuine taste, Original recipe",
    "example": "This restaurant preserves the authentic flavor of traditional pho passed down through generations.",
    "exampleTrans": "Nhà hàng này gìn giữ hương vị chính gốc của món phở truyền thống qua nhiều thế hệ.",
    "topic": {
      "id": "topic-food-culinary",
      "name": "Food & Culinary"
    }
  },
  {
    "id": 27,
    "topicId": "topic-science-innovation",
    "word": "Technological breakthrough",
    "pos": "Noun Phrase",
    "ipa": "/ˌteknəˈlɑːdʒɪkl ˈbreɪkθruː/",
    "meaning": "Bước đột phá mang tính công nghệ",
    "level": "C1",
    "synonyms": "Major advancement, Cutting-edge invention",
    "example": "The development of mRNA vaccines was considered a monumental technological breakthrough.",
    "exampleTrans": "Việc phát triển vắc-xin mRNA được coi là một bước đột phá công nghệ mang tính lịch sử.",
    "topic": {
      "id": "topic-science-innovation",
      "name": "Science & Innovation"
    }
  },
  {
    "id": 28,
    "topicId": "topic-science-innovation",
    "word": "Quantum computing",
    "pos": "Noun Phrase",
    "ipa": "/ˈkwɑːntəm kəmˈpjuːtɪŋ/",
    "meaning": "Điện toán lượng tử",
    "level": "C1",
    "synonyms": "Subatomic computation, Next-gen computing",
    "example": "Quantum computing has the potential to solve computational problems in seconds rather than years.",
    "exampleTrans": "Điện toán lượng tử có tiềm năng giải quyết các bài toán tính toán trong vài giây thay vì nhiều năm.",
    "topic": {
      "id": "topic-science-innovation",
      "name": "Science & Innovation"
    }
  },
  {
    "id": 29,
    "topicId": "topic-science-innovation",
    "word": "Empirical evidence",
    "pos": "Noun Phrase",
    "ipa": "/ɪmˈpɪrɪkl ˈevɪdəns/",
    "meaning": "Bằng chứng thực nghiệm (được kiểm chứng qua thí nghiệm)",
    "level": "C2",
    "synonyms": "Observable data, Scientific proof",
    "example": "Scientific theories must be substantiated by rigorous empirical evidence.",
    "exampleTrans": "Các lý thuyết khoa học phải được chứng minh bằng những bằng chứng thực nghiệm chặt chẽ.",
    "topic": {
      "id": "topic-science-innovation",
      "name": "Science & Innovation"
    }
  },
  {
    "id": 30,
    "topicId": "topic-art-culture",
    "word": "Cultural heritage",
    "pos": "Noun Phrase",
    "ipa": "/ˈkʌltʃərəl ˈherɪtɪdʒ/",
    "meaning": "Di sản văn hóa truyền thống",
    "level": "B2",
    "synonyms": "Historic legacy, Cultural traditions",
    "example": "Preserving cultural heritage helps future generations understand their roots.",
    "exampleTrans": "Bảo tồn di sản văn hóa giúp các thế hệ tương lai hiểu rõ cội nguồn của mình.",
    "topic": {
      "id": "topic-art-culture",
      "name": "Art & Culture"
    }
  },
  {
    "id": 31,
    "topicId": "topic-art-culture",
    "word": "Visual masterpiece",
    "pos": "Noun Phrase",
    "ipa": "/ˈvɪʒuəl ˈmæstərpiːs/",
    "meaning": "Kiệt tác nghệ thuật thị giác",
    "level": "C1",
    "synonyms": "Magnum opus, Artistic triumph",
    "example": "The Mona Lisa is widely recognized as a timeless visual masterpiece of the Renaissance.",
    "exampleTrans": "Bức tranh Mona Lisa được công nhận rộng rãi là một kiệt tác thị giác vượt thời gian của thời kỳ Phục hưng.",
    "topic": {
      "id": "topic-art-culture",
      "name": "Art & Culture"
    }
  },
  {
    "id": 32,
    "topicId": "topic-art-culture",
    "word": "Architectural wonder",
    "pos": "Noun Phrase",
    "ipa": "/ˌɑːrkɪˈtektʃərəl ˈwʌndər/",
    "meaning": "Kỳ quan kiến trúc",
    "level": "B2",
    "synonyms": "Structural marvel, Iconic landmark",
    "example": "The Sydney Opera House is regarded as an astonishing architectural wonder of the 20th century.",
    "exampleTrans": "Nhà hát Opera Sydney được xem là một kỳ quan kiến trúc đáng kinh ngạc của thế kỷ 20.",
    "topic": {
      "id": "topic-art-culture",
      "name": "Art & Culture"
    }
  },
  {
    "id": 33,
    "topicId": "topic-media-entertainment",
    "word": "Viral phenomenon",
    "pos": "Noun Phrase",
    "ipa": "/ˈvaɪrəl fəˈnɑːmɪnən/",
    "meaning": "Hiện tượng lan truyền chóng mặt trên mạng xã hội",
    "level": "B2",
    "synonyms": "Internet sensation, Trending topic",
    "example": "The music video became an overnight viral phenomenon with millions of views.",
    "exampleTrans": "Video ca nhạc đã trở thành một hiện tượng lan truyền chỉ sau một đêm với hàng triệu lượt xem.",
    "topic": {
      "id": "topic-media-entertainment",
      "name": "Media & Entertainment"
    }
  },
  {
    "id": 34,
    "topicId": "topic-media-entertainment",
    "word": "Streaming platform",
    "pos": "Noun Phrase",
    "ipa": "/ˈstriːmɪŋ ˈplætfɔːrm/",
    "meaning": "Nền tảng phát nội dung trực tuyến (Netflix, Spotify)",
    "level": "B1",
    "synonyms": "Digital streaming service, Media provider",
    "example": "Subscription streaming platforms have fundamentally altered how people consume movies.",
    "exampleTrans": "Các nền tảng phát phim trực tuyến theo thuê bao đã thay đổi căn bản cách con người xem phim.",
    "topic": {
      "id": "topic-media-entertainment",
      "name": "Media & Entertainment"
    }
  },
  {
    "id": 35,
    "topicId": "topic-media-entertainment",
    "word": "Sensational journalism",
    "pos": "Noun Phrase",
    "ipa": "/senˈseɪʃənl ˈdʒɜːrnəlɪzəm/",
    "meaning": "Báo chí giật gân, câu tương tác (clickbait)",
    "level": "C1",
    "synonyms": "Yellow journalism, Tabloid reporting",
    "example": "Sensational journalism often distorts facts to capture reader attention.",
    "exampleTrans": "Báo chí giật gân thường bóp méo sự thật để thu hút sự chú ý của độc giả.",
    "topic": {
      "id": "topic-media-entertainment",
      "name": "Media & Entertainment"
    }
  },
  {
    "id": 36,
    "topicId": "topic-economy-finance",
    "word": "Inflation rate",
    "pos": "Noun Phrase",
    "ipa": "/ɪnˈfleɪʃn reɪt/",
    "meaning": "Tỷ lệ lạm phát",
    "level": "B2",
    "synonyms": "Cost of living index, Price increase",
    "example": "Central banks adjust interest rates to keep the national inflation rate under control.",
    "exampleTrans": "Các ngân hàng trung ương điều chỉnh lãi suất để giữ tỷ lệ lạm phát quốc gia trong tầm kiểm soát.",
    "topic": {
      "id": "topic-economy-finance",
      "name": "Economy & Finance"
    }
  },
  {
    "id": 37,
    "topicId": "topic-economy-finance",
    "word": "Financial literacy",
    "pos": "Noun Phrase",
    "ipa": "/faɪˈnænʃl ˈlɪtərəsi/",
    "meaning": "Hiểu biết và kỹ năng quản lý tài chính cá nhân",
    "level": "B2",
    "synonyms": "Money management skills, Fiscal awareness",
    "example": "Teaching financial literacy to teenagers prepares them for independent adulthood.",
    "exampleTrans": "Dạy kỹ năng quản lý tài chính cho thanh thiếu niên chuẩn bị cho các em bước vào tuổi trưởng thành độc lập.",
    "topic": {
      "id": "topic-economy-finance",
      "name": "Economy & Finance"
    }
  },
  {
    "id": 38,
    "topicId": "topic-economy-finance",
    "word": "Investment portfolio",
    "pos": "Noun Phrase",
    "ipa": "/ɪnˈvestmənt pɔːrtˈfoʊlioʊ/",
    "meaning": "Danh mục đầu tư tài chính",
    "level": "C1",
    "synonyms": "Asset allocation, Financial holdings",
    "example": "Diversifying your investment portfolio minimizes risks during economic downturns.",
    "exampleTrans": "Đa dạng hóa danh mục đầu tư giúp giảm thiểu rủi ro trong các giai đoạn suy thoái kinh tế.",
    "topic": {
      "id": "topic-economy-finance",
      "name": "Economy & Finance"
    }
  },
  {
    "id": 39,
    "topicId": "topic-city-life-urbanization",
    "word": "Hustle and bustle",
    "pos": "Idiom / Phrase",
    "ipa": "/ˈhʌsl ænd ˈbʌsl/",
    "meaning": "Nhịp sống hối hả, nhộn nhịp nơi đô thị",
    "level": "B2",
    "synonyms": "Fast-paced rhythm, Vibrant urban life",
    "example": "Many young professionals thrive on the hustle and bustle of major metropolises.",
    "exampleTrans": "Nhiều bạn trẻ phát triển mạnh mẽ trong nhịp sống hối hả và nhộn nhịp của các đại đô thị.",
    "topic": {
      "id": "topic-city-life-urbanization",
      "name": "City Life & Urbanization"
    }
  },
  {
    "id": 40,
    "topicId": "topic-city-life-urbanization",
    "word": "Urban sprawl",
    "pos": "Noun Phrase",
    "ipa": "/ˈɜːrbən sprɔːl/",
    "meaning": "Sự mở rộng đô thị tự phát thiếu quy hoạch",
    "level": "C1",
    "synonyms": "City expansion, Suburban creep",
    "example": "Unchecked urban sprawl puts immense pressure on public infrastructure and farmland.",
    "exampleTrans": "Sự mở rộng đô thị thiếu kiểm soát gây áp lực lớn lên cơ sở hạ tầng công cộng và đất nông nghiệp.",
    "topic": {
      "id": "topic-city-life-urbanization",
      "name": "City Life & Urbanization"
    }
  },
  {
    "id": 41,
    "topicId": "topic-city-life-urbanization",
    "word": "Smart city infrastructure",
    "pos": "Noun Phrase",
    "ipa": "/smɑːrt ˈsɪti ˌɪnfrəˈstrʌktʃər/",
    "meaning": "Cơ sở hạ tầng thành phố thông minh",
    "level": "C1",
    "synonyms": "Digital public amenities, Tech-enabled urban system",
    "example": "Smart city infrastructure uses IoT sensors to manage traffic flow and reduce power waste.",
    "exampleTrans": "Cơ sở hạ tầng thành phố thông minh sử dụng các cảm biến IoT để điều phối giao thông và giảm lãng phí điện năng.",
    "topic": {
      "id": "topic-city-life-urbanization",
      "name": "City Life & Urbanization"
    }
  },
  {
    "id": 42,
    "topicId": "topic-family-relationships",
    "word": "Generation gap",
    "pos": "Noun Phrase",
    "ipa": "/ˌdʒenəˈreɪʃn ɡæp/",
    "meaning": "Khoảng cách thế hệ (giữa cha mẹ và con cái)",
    "level": "B1",
    "synonyms": "Age divide, Generational difference",
    "example": "Open communication helps bridge the generation gap between parents and teenagers.",
    "exampleTrans": "Giao tiếp cởi mở giúp thu hẹp khoảng cách thế hệ giữa cha mẹ và con cái tuổi dậy thì.",
    "topic": {
      "id": "topic-family-relationships",
      "name": "Family & Relationships"
    }
  },
  {
    "id": 43,
    "topicId": "topic-family-relationships",
    "word": "Close-knit family",
    "pos": "Noun Phrase",
    "ipa": "/ˌkloʊs ˈnɪt ˈfæməli/",
    "meaning": "Gia đình gắn bó khăng khít, yêu thương nhau",
    "level": "B2",
    "synonyms": "Tight-knit household, Loving family",
    "example": "Growing up in a close-knit family gave her confidence and emotional resilience.",
    "exampleTrans": "Lớn lên trong một gia đình gắn bó khăng khít đã mang lại cho cô ấy sự tự tin và bản lĩnh cảm xúc.",
    "topic": {
      "id": "topic-family-relationships",
      "name": "Family & Relationships"
    }
  },
  {
    "id": 44,
    "topicId": "topic-family-relationships",
    "word": "Mutual respect",
    "pos": "Noun Phrase",
    "ipa": "/ˈmjuːtʃuəl rɪˈspekt/",
    "meaning": "Sự tôn trọng lẫn nhau",
    "level": "B2",
    "synonyms": "Reciprocal esteem, Shared appreciation",
    "example": "Any lasting friendship is founded upon honest communication and mutual respect.",
    "exampleTrans": "Bất kỳ tình bạn lâu bền nào cũng được xây dựng dựa trên sự giao tiếp chân thành và tôn trọng lẫn nhau.",
    "topic": {
      "id": "topic-family-relationships",
      "name": "Family & Relationships"
    }
  },
  {
    "id": 45,
    "topicId": "topic-sports-leisure",
    "word": "Team spirit",
    "pos": "Noun Phrase",
    "ipa": "/tiːm ˈspɪrɪt/",
    "meaning": "Tinh thần đồng đội, đoàn kết tập thể",
    "level": "B1",
    "synonyms": "Camaraderie, Solidarity",
    "example": "Playing football teaches children the value of team spirit and mutual cooperation.",
    "exampleTrans": "Chơi bóng đá dạy cho trẻ em giá trị của tinh thần đồng đội và sự hợp tác lẫn nhau.",
    "topic": {
      "id": "topic-sports-leisure",
      "name": "Sports & Leisure"
    }
  },
  {
    "id": 46,
    "topicId": "topic-sports-leisure",
    "word": "Physical endurance",
    "pos": "Noun Phrase",
    "ipa": "/ˈfɪzɪkl ɪnˈdʊrəns/",
    "meaning": "Sức bền thể lực",
    "level": "B2",
    "synonyms": "Stamina, Athletic stamina",
    "example": "Marathon runners undergo rigorous training to build long-term physical endurance.",
    "exampleTrans": "Các vận động viên chạy marathon trải qua quá trình huấn luyện khắt khe để rèn luyện sức bền thể lực lâu dài.",
    "topic": {
      "id": "topic-sports-leisure",
      "name": "Sports & Leisure"
    }
  },
  {
    "id": 47,
    "topicId": "topic-sports-leisure",
    "word": "Recreational activity",
    "pos": "Noun Phrase",
    "ipa": "/ˌrekriˈeɪʃənl ækˈtɪvəti/",
    "meaning": "Hoạt động vui chơi giải trí lành mạnh",
    "level": "B1",
    "synonyms": "Pastime, Leisure pursuit",
    "example": "Kayaking on the lake is my favorite recreational activity during summer weekends.",
    "exampleTrans": "Chèo thuyền kayak trên hồ là hoạt động giải trí yêu thích của tôi vào những ngày cuối tuần mùa hè.",
    "topic": {
      "id": "topic-sports-leisure",
      "name": "Sports & Leisure"
    }
  },
  {
    "id": 48,
    "topicId": "topic-fashion-appearance",
    "word": "Dress code",
    "pos": "Noun Phrase",
    "ipa": "/dres koʊd/",
    "meaning": "Quy tắc trang phục (trong công ty hoặc sự kiện)",
    "level": "B1",
    "synonyms": "Attire guidelines, Clothing standard",
    "example": "Our technology company has a casual dress code that encourages personal comfort.",
    "exampleTrans": "Công ty công nghệ của chúng tôi có quy tắc trang phục thoải mái khuyến khích sự tự tin của mỗi cá nhân.",
    "topic": {
      "id": "topic-fashion-appearance",
      "name": "Fashion & Appearance"
    }
  },
  {
    "id": 49,
    "topicId": "topic-fashion-appearance",
    "word": "Sustainable fashion",
    "pos": "Noun Phrase",
    "ipa": "/səˈsteɪnəbl ˈfæʃn/",
    "meaning": "Thời trang bền vững (thân thiện với môi trường)",
    "level": "B2",
    "synonyms": "Eco-friendly clothing, Ethical apparel",
    "example": "Young consumers increasingly prioritize sustainable fashion made from recycled fibers.",
    "exampleTrans": "Người tiêu dùng trẻ ngày càng ưu tiên thời trang bền vững làm từ sợi tái chế.",
    "topic": {
      "id": "topic-fashion-appearance",
      "name": "Fashion & Appearance"
    }
  },
  {
    "id": 50,
    "topicId": "topic-fashion-appearance",
    "word": "Impeccable style",
    "pos": "Noun Phrase",
    "ipa": "/ɪmˈpekəbl staɪl/",
    "meaning": "Phong cách ăn mặc chỉn chu, hoàn hảo không tì vết",
    "level": "C1",
    "synonyms": "Flawless taste, Elegant fashion sense",
    "example": "He is admired for his impeccable style and sophisticated choice of business attire.",
    "exampleTrans": "Anh ấy được ngưỡng mộ bởi phong cách ăn mặc chỉn chu và sự lựa chọn trang phục công sở tinh tế.",
    "topic": {
      "id": "topic-fashion-appearance",
      "name": "Fashion & Appearance"
    }
  },
  {
    "id": 51,
    "topicId": "topic-crime-law",
    "word": "Deterrent effect",
    "pos": "Noun Phrase",
    "ipa": "/dɪˈtɜːrənt ɪˈfekt/",
    "meaning": "Tác dụng răn đe, ngăn ngừa tội phạm",
    "level": "C1",
    "synonyms": "Discouraging factor, Preventive power",
    "example": "Stricter penalties for traffic violations have had a visible deterrent effect.",
    "exampleTrans": "Các hình phạt nghiêm khắc hơn đối với vi phạm giao thông đã tạo ra tác dụng răn đe rõ rệt.",
    "topic": {
      "id": "topic-crime-law",
      "name": "Crime & Law"
    }
  },
  {
    "id": 52,
    "topicId": "topic-crime-law",
    "word": "Cybercrime syndicate",
    "pos": "Noun Phrase",
    "ipa": "/ˈsaɪbərkraɪm ˈsɪndɪkət/",
    "meaning": "Tổ chức tội phạm mạng xuyên quốc gia",
    "level": "C1",
    "synonyms": "Hacking ring, Cyber gang",
    "example": "International police forces collaborated to dismantle an infamous cybercrime syndicate.",
    "exampleTrans": "Lực lượng cảnh sát quốc tế đã phối hợp để triệt phá một tổ chức tội phạm mạng khét tiếng.",
    "topic": {
      "id": "topic-crime-law",
      "name": "Crime & Law"
    }
  },
  {
    "id": 53,
    "topicId": "topic-crime-law",
    "word": "Rehabilitation program",
    "pos": "Noun Phrase",
    "ipa": "/ˌriːəˌbɪlɪˈteɪʃn ˈproʊɡræm/",
    "meaning": "Chương trình tái hòa nhập cộng đồng cho người lầm lỡ",
    "level": "C1",
    "synonyms": "Reintegration initiative, Reformative course",
    "example": "Effective rehabilitation programs reduce the likelihood of ex-offenders committing new offenses.",
    "exampleTrans": "Các chương trình tái hòa nhập hiệu quả làm giảm khả năng người từng phạm tội tái phạm.",
    "topic": {
      "id": "topic-crime-law",
      "name": "Crime & Law"
    }
  },
  {
    "id": 54,
    "topicId": "topic-society-global-issues",
    "word": "Wealth disparity",
    "pos": "Noun Phrase",
    "ipa": "/welθ dɪˈspærəti/",
    "meaning": "Sự chênh lệch giàu nghèo trong xã hội",
    "level": "C1",
    "synonyms": "Income inequality, Economic divide",
    "example": "Progressive taxation policies are designed to narrow the widening wealth disparity.",
    "exampleTrans": "Chính sách thuế lũy tiến được thiết kế nhằm thu hẹp sự chênh lệch giàu nghèo đang ngày càng gia tăng.",
    "topic": {
      "id": "topic-society-global-issues",
      "name": "Society & Global Issues"
    }
  },
  {
    "id": 55,
    "topicId": "topic-society-global-issues",
    "word": "Humanitarian aid",
    "pos": "Noun Phrase",
    "ipa": "/hjuːˌmænɪˈteriən eɪd/",
    "meaning": "Viện trợ nhân đạo cho vùng thiên tai/chiến sự",
    "level": "B2",
    "synonyms": "Emergency relief, Charity assistance",
    "example": "Convoys of humanitarian aid were dispatched to provide clean water to disaster survivors.",
    "exampleTrans": "Các đoàn xe viện trợ nhân đạo đã được điều động để cung cấp nước sạch cho người sống sót sau thảm họa.",
    "topic": {
      "id": "topic-society-global-issues",
      "name": "Society & Global Issues"
    }
  },
  {
    "id": 56,
    "topicId": "topic-society-global-issues",
    "word": "Social cohesion",
    "pos": "Noun Phrase",
    "ipa": "/ˈsoʊʃl koʊˈhiːʒn/",
    "meaning": "Sự gắn kết và đồng thuận xã hội",
    "level": "C1",
    "synonyms": "Community unity, Social harmony",
    "example": "Multicultural neighborhoods foster social cohesion through community festivals and mutual understanding.",
    "exampleTrans": "Các khu dân cư đa văn hóa bồi đắp sự gắn kết xã hội thông qua các lễ hội cộng đồng và sự thấu hiểu lẫn nhau.",
    "topic": {
      "id": "topic-society-global-issues",
      "name": "Society & Global Issues"
    }
  },
  {
    "id": 57,
    "topicId": "topic-psychology-personality",
    "word": "Emotional intelligence",
    "pos": "Noun Phrase",
    "ipa": "/ɪˈmoʊʃənl ɪnˈtelɪdʒəns/",
    "meaning": "Trí tuệ cảm xúc (khả năng thấu hiểu và quản lý cảm xúc)",
    "level": "C1",
    "synonyms": "EQ, Emotional quotient",
    "example": "Leaders with high emotional intelligence inspire greater loyalty and teamwork among staff.",
    "exampleTrans": "Những nhà lãnh đạo có trí tuệ cảm xúc cao truyền cảm hứng cho sự trung thành và tinh thần đồng đội lớn hơn giữa các nhân viên.",
    "topic": {
      "id": "topic-psychology-personality",
      "name": "Psychology & Personality"
    }
  },
  {
    "id": 58,
    "topicId": "topic-psychology-personality",
    "word": "Introverted personality",
    "pos": "Noun Phrase",
    "ipa": "/ˈɪntrəvɜːrtɪd ˌpɜːrsəˈnæləti/",
    "meaning": "Tính cách hướng nội",
    "level": "B2",
    "synonyms": "Quiet disposition, Reflective nature",
    "example": "People with an introverted personality often recharge energy through quiet moments of solitude.",
    "exampleTrans": "Những người có tính cách hướng nội thường nạp lại năng lượng qua những khoảnh khắc tĩnh lặng một mình.",
    "topic": {
      "id": "topic-psychology-personality",
      "name": "Psychology & Personality"
    }
  },
  {
    "id": 59,
    "topicId": "topic-psychology-personality",
    "word": "Cognitive resilience",
    "pos": "Noun Phrase",
    "ipa": "/ˈkɑːɡnətɪv rɪˈzɪliəns/",
    "meaning": "Bản lĩnh và khả năng phục hồi nhận thức trước áp lực",
    "level": "C2",
    "synonyms": "Mental toughness, Psychological grit",
    "example": "Developing cognitive resilience enables professionals to stay calm in high-pressure crises.",
    "exampleTrans": "Việc phát triển bản lĩnh nhận thức cho phép các chuyên gia giữ được bình tĩnh trong các cuộc khủng hoảng nhiều áp lực.",
    "topic": {
      "id": "topic-psychology-personality",
      "name": "Psychology & Personality"
    }
  },
  {
    "id": 60,
    "topicId": "topic-history-heritage",
    "word": "Historical artifact",
    "pos": "Noun Phrase",
    "ipa": "/hɪˈstɔːrɪkl ˈɑːrtɪfækt/",
    "meaning": "Hiện vật, cổ vật lịch sử có giá trị",
    "level": "B2",
    "synonyms": "Ancient relic, Archaeological treasure",
    "example": "Archaeologists uncovered a rare historical artifact dating back over two thousand years.",
    "exampleTrans": "Các nhà khảo cổ học đã khai quật được một hiện vật lịch sử quý hiếm có niên đại hơn hai nghìn năm.",
    "topic": {
      "id": "topic-history-heritage",
      "name": "History & Heritage"
    }
  },
  {
    "id": 61,
    "topicId": "topic-history-heritage",
    "word": "Ancient civilization",
    "pos": "Noun Phrase",
    "ipa": "/ˈeɪnʃənt ˌsɪvələˈzeɪʃn/",
    "meaning": "Nền văn minh cổ đại",
    "level": "B2",
    "synonyms": "Early society, Classical era",
    "example": "The architectural brilliance of ancient civilizations continues to astonish modern engineers.",
    "exampleTrans": "Sự tài hoa trong kiến trúc của các nền văn minh cổ đại tiếp tục làm kinh ngạc các kỹ sư hiện đại.",
    "topic": {
      "id": "topic-history-heritage",
      "name": "History & Heritage"
    }
  },
  {
    "id": 62,
    "topicId": "topic-history-heritage",
    "word": "Ancestral tradition",
    "pos": "Noun Phrase",
    "ipa": "/ænˈsestrəl trəˈdɪʃn/",
    "meaning": "Truyền thống của tổ tiên để lại",
    "level": "B2",
    "synonyms": "Inherited custom, Longstanding folklore",
    "example": "Vietnamese people honor ancestral traditions by gathering with family every Lunar New Year.",
    "exampleTrans": "Người Việt Nam tôn vinh các truyền thống của tổ tiên bằng việc quây quần bên gia đình mỗi dịp Tết Nguyên Đán.",
    "topic": {
      "id": "topic-history-heritage",
      "name": "History & Heritage"
    }
  },
  {
    "id": 63,
    "topicId": "topic-space-astronomy",
    "word": "Celestial body",
    "pos": "Noun Phrase",
    "ipa": "/səˈlestʃl ˈbɑːdi/",
    "meaning": "Thiên thể trong vũ trụ (hành tinh, ngôi sao, sao chổi)",
    "level": "C2",
    "synonyms": "Astronomical object, Extraterrestrial entity",
    "example": "Telescopes track distant celestial bodies to decipher the origins of our universe.",
    "exampleTrans": "Kính viễn vọng theo dõi các thiên thể ở xa để giải mã nguồn gốc của vũ trụ chúng ta.",
    "topic": {
      "id": "topic-space-astronomy",
      "name": "Space & Astronomy"
    }
  },
  {
    "id": 64,
    "topicId": "topic-space-astronomy",
    "word": "Interplanetary exploration",
    "pos": "Noun Phrase",
    "ipa": "/ˌɪntərˈplænəteri ˌekspləˈreɪʃn/",
    "meaning": "Chuyến thám hiểm liên hành tinh",
    "level": "C1",
    "synonyms": "Space voyage, Deep space mission",
    "example": "Manned interplanetary exploration to Mars is no longer science fiction but a realistic goal.",
    "exampleTrans": "Thám hiểm liên hành tinh có người lái lên sao Hỏa không còn là viễn tưởng mà là một mục tiêu thực tế.",
    "topic": {
      "id": "topic-space-astronomy",
      "name": "Space & Astronomy"
    }
  },
  {
    "id": 65,
    "topicId": "topic-space-astronomy",
    "word": "Gravitational pull",
    "pos": "Noun Phrase",
    "ipa": "/ˌɡrævɪˈteɪʃənl pʊl/",
    "meaning": "Lực hút hấp dẫn",
    "level": "C1",
    "synonyms": "Gravity force, Orbital attraction",
    "example": "The gravitational pull of the moon is the primary cause of ocean tides on Earth.",
    "exampleTrans": "Lực hút hấp dẫn của mặt trăng là nguyên nhân chính gây ra thủy triều trên Trái Đất.",
    "topic": {
      "id": "topic-space-astronomy",
      "name": "Space & Astronomy"
    }
  },
  {
    "id": 66,
    "topicId": "topic-philosophy-ethics",
    "word": "Ethical dilemma",
    "pos": "Noun Phrase",
    "ipa": "/ˈeθɪkl daɪˈlemə/",
    "meaning": "Thế tiến thoái lưỡng nan về mặt đạo đức",
    "level": "C1",
    "synonyms": "Moral paradox, Difficult moral choice",
    "example": "Autonomous driving algorithms face a serious ethical dilemma during unavoidable accidents.",
    "exampleTrans": "Các thuật toán xe tự lái đối mặt với thế tiến thoái lưỡng nan về đạo đức khi xảy ra tai nạn bất khả kháng.",
    "topic": {
      "id": "topic-philosophy-ethics",
      "name": "Philosophy & Ethics"
    }
  },
  {
    "id": 67,
    "topicId": "topic-philosophy-ethics",
    "word": "Utilitarian perspective",
    "pos": "Noun Phrase",
    "ipa": "/ˌjuːtɪlɪˈteriən pərˈspektɪv/",
    "meaning": "Góc nhìn theo thuyết vị lợi (hướng tới điều tốt đẹp cho số đông)",
    "level": "C2",
    "synonyms": "Consequentialist viewpoint, Pragmatic ethics",
    "example": "From a utilitarian perspective, public policies should maximize overall social happiness.",
    "exampleTrans": "Từ góc nhìn vị lợi, các chính sách công nên tối đa hóa hạnh phúc chung của toàn xã hội.",
    "topic": {
      "id": "topic-philosophy-ethics",
      "name": "Philosophy & Ethics"
    }
  },
  {
    "id": 68,
    "topicId": "topic-philosophy-ethics",
    "word": "Intrinsic value",
    "pos": "Noun Phrase",
    "ipa": "/ɪnˈtrɪnzɪk ˈvæljuː/",
    "meaning": "Giá trị nội tại, tự thân vốn có",
    "level": "C2",
    "synonyms": "Inherent worth, Essential merit",
    "example": "Philosophers argue that human life possesses intrinsic value beyond economic utility.",
    "exampleTrans": "Các nhà triết học lập luận rằng sự sống của con người sở hữu giá trị nội tại vượt ra ngoài công năng kinh tế.",
    "topic": {
      "id": "topic-philosophy-ethics",
      "name": "Philosophy & Ethics"
    }
  },
  {
    "id": 69,
    "topicId": "topic-tourism-hospitality",
    "word": "Hospitable reception",
    "pos": "Noun Phrase",
    "ipa": "/ˈhɑːspɪtəbl rɪˈsepʃn/",
    "meaning": "Sự đón tiếp hiếu khách, nồng hậu",
    "level": "B1",
    "synonyms": "Warm welcome, Cordial greeting",
    "example": "Guests were touched by the hospitable reception from the resort staff upon arrival.",
    "exampleTrans": "Du khách rất xúc động trước sự đón tiếp nồng hậu từ nhân viên khu nghỉ dưỡng ngay khi vừa đến nơi.",
    "topic": {
      "id": "topic-tourism-hospitality",
      "name": "Tourism & Hospitality"
    }
  },
  {
    "id": 70,
    "topicId": "topic-tourism-hospitality",
    "word": "Tailor-made itinerary",
    "pos": "Noun Phrase",
    "ipa": "/ˌteɪlər ˈmeɪd aɪˈtɪnəreri/",
    "meaning": "Lịch trình du lịch được thiết kế riêng theo yêu cầu",
    "level": "B2",
    "synonyms": "Customized schedule, Personalized travel plan",
    "example": "The agency arranged a tailor-made itinerary suited to our family preferences.",
    "exampleTrans": "Đại lý du lịch đã sắp xếp một lịch trình thiết kế riêng phù hợp với sở thích của gia đình chúng tôi.",
    "topic": {
      "id": "topic-tourism-hospitality",
      "name": "Tourism & Hospitality"
    }
  },
  {
    "id": 71,
    "topicId": "topic-tourism-hospitality",
    "word": "Complimentary amenities",
    "pos": "Noun Phrase",
    "ipa": "/ˌkɑːmplɪˈmentri əˈmenətiz/",
    "meaning": "Tiện ích miễn phí đi kèm (bữa sáng, hồ bơi, wifi)",
    "level": "B2",
    "synonyms": "Free perks, Included conveniences",
    "example": "The hotel provides complimentary amenities including high-speed internet and access to the gym.",
    "exampleTrans": "Khách sạn cung cấp các tiện ích miễn phí bao gồm internet tốc độ cao và quyền sử dụng phòng gym.",
    "topic": {
      "id": "topic-tourism-hospitality",
      "name": "Tourism & Hospitality"
    }
  },
  {
    "id": 72,
    "topicId": "topic-marketing-advertising",
    "word": "Brand awareness",
    "pos": "Noun Phrase",
    "ipa": "/brænd əˈwernəs/",
    "meaning": "Độ nhận diện thương hiệu trong tâm trí khách hàng",
    "level": "B2",
    "synonyms": "Brand recognition, Market visibility",
    "example": "Influencer marketing has proven highly effective in boosting brand awareness among Gen Z.",
    "exampleTrans": "Tiếp thị qua người có tầm ảnh hưởng đã chứng minh hiệu quả cao trong việc nâng cao độ nhận diện thương hiệu với Gen Z.",
    "topic": {
      "id": "topic-marketing-advertising",
      "name": "Marketing & Advertising"
    }
  },
  {
    "id": 73,
    "topicId": "topic-marketing-advertising",
    "word": "Target audience",
    "pos": "Noun Phrase",
    "ipa": "/ˈtɑːrɡɪt ˈɔːdiəns/",
    "meaning": "Đối tượng khách hàng mục tiêu",
    "level": "B2",
    "synonyms": "Intended demographic, Potential customers",
    "example": "Defining your target audience accurately ensures your advertising budget is well spent.",
    "exampleTrans": "Xác định chính xác khách hàng mục tiêu đảm bảo ngân sách quảng cáo của bạn được chi tiêu hiệu quả.",
    "topic": {
      "id": "topic-marketing-advertising",
      "name": "Marketing & Advertising"
    }
  },
  {
    "id": 74,
    "topicId": "topic-marketing-advertising",
    "word": "Compelling call-to-action",
    "pos": "Noun Phrase",
    "ipa": "/kəmˈpelɪŋ kɔːl tuː ˈækʃn/",
    "meaning": "Lời kêu gọi hành động thuyết phục (CTA)",
    "level": "C1",
    "synonyms": "Persuasive prompt, High-converting CTA",
    "example": "Each email campaign should culminate in a clear, compelling call-to-action.",
    "exampleTrans": "Mỗi chiến dịch email nên kết thúc bằng một lời kêu gọi hành động rõ ràng và thuyết phục.",
    "topic": {
      "id": "topic-marketing-advertising",
      "name": "Marketing & Advertising"
    }
  }
];

export const vocabularyService = {
  // 1. Lấy tất cả Chủ đề Từ vựng
  async getTopics() {
    try {
      const res = await apiClient('/vocabulary-topics');
      if (Array.isArray(res) && res.length > 0) return res;
      return FALLBACK_VOCAB_TOPICS;
    } catch {
      return FALLBACK_VOCAB_TOPICS;
    }
  },

  // 2. Lấy tất cả Từ vựng (có lọc theo topicId / search)
  async getVocabularies({ topicId, search } = {}) {
    try {
      const params = new URLSearchParams();
      if (topicId && topicId !== 'ALL') params.append('topicId', topicId);
      if (search) params.append('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await apiClient(`/vocabularies${query}`);
      if (Array.isArray(res) && res.length > 0) return res;
      
      // Fallback lọc theo topicId nếu API chưa trả về
      let result = FALLBACK_VOCABULARIES;
      if (topicId && topicId !== 'ALL') {
        result = result.filter(
          (v) => v.topicId === topicId || v.topic?.id === topicId || v.topic?.name === topicId
        );
      }
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (v) =>
            v.word.toLowerCase().includes(s) ||
            v.meaning.toLowerCase().includes(s) ||
            (v.synonyms && v.synonyms.toLowerCase().includes(s))
        );
      }
      return result;
    } catch {
      let result = FALLBACK_VOCABULARIES;
      if (topicId && topicId !== 'ALL') {
        result = result.filter(
          (v) => v.topicId === topicId || v.topic?.id === topicId || v.topic?.name === topicId
        );
      }
      if (search) {
        const s = search.toLowerCase();
        result = result.filter(
          (v) =>
            v.word.toLowerCase().includes(s) ||
            v.meaning.toLowerCase().includes(s) ||
            (v.synonyms && v.synonyms.toLowerCase().includes(s))
        );
      }
      return result;
    }
  },

  // 3. Admin: Tạo Chủ đề Từ vựng
  async createTopic(data) {
    return apiClient('/admin/vocabulary-topics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 4. Admin: Cập nhật Chủ đề Từ vựng
  async updateTopic(topicId, data) {
    return apiClient(`/admin/vocabulary-topics/${topicId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 5. Admin: Xóa Chủ đề Từ vựng
  async deleteTopic(topicId) {
    return apiClient(`/admin/vocabulary-topics/${topicId}`, {
      method: 'DELETE',
    });
  },

  // 6. Admin: Tạo Từ vựng mới
  async createVocabulary(data) {
    return apiClient('/admin/vocabularies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 7. Admin: Cập nhật Từ vựng
  async updateVocabulary(id, data) {
    return apiClient(`/admin/vocabularies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 8. Admin: Xóa Từ vựng
  async deleteVocabulary(id) {
    return apiClient(`/admin/vocabularies/${id}`, {
      method: 'DELETE',
    });
  },

  // 9. Học viên: Lưu kết quả Ghi chép chính tả (DICTATION) hoặc Trắc nghiệm (QUIZ) của bộ Topic
  async submitPractice(payload) {
    try {
      return await apiClient('/vocabulary-practices', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return null;
    }
  },

  // 10. Học viên: Lấy lịch sử làm bài Chính tả & Trắc nghiệm theo Topic
  async getMyPractices(topicId) {
    try {
      const q = topicId && topicId !== 'ALL' ? `?topicId=${topicId}` : '';
      const res = await apiClient(`/vocabulary-practices/me${q}`);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  // 11. Backend Sinh bộ câu hỏi Trắc nghiệm (Quiz) theo Topic
  async getTopicQuiz(topicId = 'ALL') {
    try {
      return await apiClient(`/vocabulary-practices/quiz/${topicId}`);
    } catch {
      return null;
    }
  },

  // 12. Backend Lấy bài tập Ghi chép Chính tả (Dictation) theo Topic
  async getTopicDictation(topicId = 'ALL', mode = 'word') {
    try {
      return await apiClient(
        `/vocabulary-practices/dictation/${topicId}?mode=${mode}`
      );
    } catch {
      return null;
    }
  },

  // 13. Backend Chấm điểm đáp án Chính tả
  async checkDictation(payload) {
    try {
      return await apiClient('/vocabulary-practices/check-dictation', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return null;
    }
  },
};
