export const CATEGORY = {
  leadership: { label: "Leadership", color: "#7966D8" },
  "problem-identification": { label: "Problem Identification", color: "#D98B57" },
  "business-sense": { label: "Business Sense", color: "#479B81" },
  "product-ux": { label: "Product & UI/UX", color: "#D77BA8" },
  pitching: { label: "Pitching", color: "#538BD0" },
} as const;
export type Category = keyof typeof CATEGORY;
export type Card = { id: string; category: Category; questionVi: string; questionEn: string };
export const QUESTIONS: readonly Card[] = [
  {id:"CARD-001",category:"leadership",questionVi:"Bạn thích dẫn dắt hay hỗ trợ người khác hơn? Vì sao?",questionEn:"Do you prefer leading or supporting others? Why?"},
  {id:"CARD-002",category:"leadership",questionVi:"Khi làm việc nhóm, bạn thường đảm nhận vai trò gì?",questionEn:"What role do you usually take on in a team?"},
  {id:"CARD-003",category:"leadership",questionVi:"Bạn muốn mọi người nhìn nhận mình là người như thế nào?",questionEn:"How would you like other people to see you?"},
  {id:"CARD-004",category:"problem-identification",questionVi:"Khi gặp chuyện không như mong đợi, bạn thường nghĩ đến điều gì đầu tiên?",questionEn:"When things don't go as expected, what's the first thing you think about?"},
  {id:"CARD-005",category:"problem-identification",questionVi:"Nếu có thể thay đổi một điều trên thế giới này, bạn muốn thay đổi điều gì nhất?",questionEn:"If you could change one thing in the world, what would it be?"},
  {id:"CARD-006",category:"problem-identification",questionVi:"Nếu được gặp 1 người bất kỳ để giúp bạn giải quyết 1 vấn đề, bạn sẽ gặp ai?",questionEn:"If you could meet anyone to help you solve a problem, who would you choose?"},
  {id:"CARD-007",category:"business-sense",questionVi:"Bạn sẵn sàng chi nhiều tiền nhất cho điều gì trong cuộc sống?",questionEn:"What are you most willing to spend a lot of money on in life?"},
  {id:"CARD-008",category:"business-sense",questionVi:"Nếu được giữ lại chỉ 3 apps trên điện thoại, bạn sẽ chọn những apps nào?",questionEn:"If you could keep only three apps on your phone, which would you choose?"},
  {id:"CARD-009",category:"business-sense",questionVi:"Nếu có thể biến một sở thích thành công việc, bạn sẽ chọn gì?",questionEn:"If you could turn a hobby into your job, what would you choose?"},
  {id:"CARD-010",category:"business-sense",questionVi:"Nếu được tạo ra một thứ giúp cuộc sống dễ dàng hơn, bạn muốn tạo gì?",questionEn:"If you could create something to make life easier, what would you create?"},
  {id:"CARD-011",category:"product-ux",questionVi:"Hành động nào của người khác từng khiến bạn cảm thấy được quan tâm?",questionEn:"What has someone done that made you feel cared for?"},
  {id:"CARD-012",category:"product-ux",questionVi:"Nếu được chọn một màu sắc đại diện cho bản thân, bạn sẽ chọn màu gì? Vì sao?",questionEn:"If you could choose a color to represent yourself, what would it be? Why?"},
  {id:"CARD-013",category:"pitching",questionVi:"Bạn thường là người mở đầu câu chuyện hay chờ người khác nói trước?",questionEn:"Do you usually start conversations or wait for others to speak first?"},
  {id:"CARD-014",category:"pitching",questionVi:"Bạn thích chia sẻ điều gì nhất về bản thân?",questionEn:"What do you most enjoy sharing about yourself?"},
  {id:"CARD-015",category:"pitching",questionVi:"Bạn thích thể hiện bản thân qua lời nói hay hành động hơn? Vì sao?",questionEn:"Do you prefer expressing yourself through words or actions? Why?"},
] as const;
export const TOTAL_CARDS = QUESTIONS.length;
export const getCard = (id: string | null) => QUESTIONS.find(q => q.id === id) ?? null;
