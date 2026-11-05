import {describe,it,expect} from 'vitest';
import {QUESTIONS,CATEGORY} from '../src/data/questions';
const approved = [
'Bạn thích dẫn dắt hay hỗ trợ người khác hơn? Vì sao?',
'Khi làm việc nhóm, bạn thường đảm nhận vai trò gì?',
'Bạn muốn mọi người nhìn nhận mình là người như thế nào?',
'Khi gặp chuyện không như mong đợi, bạn thường nghĩ đến điều gì đầu tiên?',
'Nếu có thể thay đổi một điều trên thế giới này, bạn muốn thay đổi điều gì nhất?',
'Nếu được gặp 1 người bất kỳ để giúp bạn giải quyết 1 vấn đề, bạn sẽ gặp ai?',
'Bạn sẵn sàng chi nhiều tiền nhất cho điều gì trong cuộc sống?',
'Nếu được giữ lại chỉ 3 apps trên điện thoại, bạn sẽ chọn những apps nào?',
'Nếu có thể biến một sở thích thành công việc, bạn sẽ chọn gì?',
'Nếu được tạo ra một thứ giúp cuộc sống dễ dàng hơn, bạn muốn tạo gì?',
'Hành động nào của người khác từng khiến bạn cảm thấy được quan tâm?',
'Nếu được chọn một màu sắc đại diện cho bản thân, bạn sẽ chọn màu gì? Vì sao?',
'Bạn thường là người mở đầu câu chuyện hay chờ người khác nói trước?',
'Bạn thích chia sẻ điều gì nhất về bản thân?',
'Bạn thích thể hiện bản thân qua lời nói hay hành động hơn? Vì sao?',
];
describe('approved content',()=>{
 it('contains exactly 15 unique IDs',()=>{expect(QUESTIONS).toHaveLength(15);expect(new Set(QUESTIONS.map(x=>x.id)).size).toBe(15)});
 it('preserves approved Vietnamese text byte-for-byte',()=>expect(QUESTIONS.map(x=>x.questionVi)).toEqual(approved));
 it('has sequential IDs and translations',()=>QUESTIONS.forEach((q,i)=>{expect(q.id).toBe(`CARD-${String(i+1).padStart(3,'0')}`);expect(q.questionEn.length).toBeGreaterThan(10);expect(CATEGORY[q.category]).toBeDefined()}));
 it('has the right category counts',()=>{const counts=Object.fromEntries(Object.keys(CATEGORY).map(k=>[k,QUESTIONS.filter(q=>q.category===k).length]));expect(counts).toEqual({'leadership':3,'problem-identification':3,'business-sense':4,'product-ux':2,'pitching':3})});
});
