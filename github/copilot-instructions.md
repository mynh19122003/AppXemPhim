# .github/copilot-instructions.md

# Ngữ cảnh dự án
Dự án là một ứng dụng xem phim trên di động, xây dựng bằng React Native và TypeScript.  
Ứng dụng giao tiếp với backend API để lấy dữ liệu phim, trailer, đánh giá, và tài khoản người dùng.  
Mọi code, giải thích và phản hồi đều phải bằng **tiếng Việt**.  
Tất cả các thay đổi và implement phải **tuân thủ file Detail Design** của dự án.

# Quy tắc chung
- Luôn sử dụng **TypeScript** cho cả frontend và backend.  
- Tuân thủ chuẩn code style của dự án (ESLint + Prettier).  
- Viết code có comment rõ ràng, giải thích bằng tiếng Việt.  
- Nếu có nhiều cách tiếp cận, ưu tiên cách phù hợp với **Detail Design** đã được duyệt.  
- Nếu không chắc, cần đưa ra gợi ý nhưng KHÔNG tự ý thay đổi design.  

# Hướng dẫn cho React Native (Frontend)
- Sử dụng React Native với TypeScript.  
- Ưu tiên dùng **React Navigation** cho điều hướng.  
- Component phải **function-based component** + **React Hooks**.  
- State management dùng **Redux Toolkit** (nếu trong Detail Design có).  
- Luôn tách riêng phần UI (presentational) và logic (container).  
- Khi gọi API, phải thông qua service layer, không gọi trực tiếp trong component.  
- Viết UI thân thiện, tuân thủ mockup từ Detail Design.  

# Hướng dẫn cho API (Backend)
- Sử dụng Node.js với TypeScript.  
- Framework chính: **Express** hoặc **NestJS** (tùy theo Detail Design).  
- Luôn viết API theo mô hình RESTful (hoặc GraphQL nếu đã định trong Detail Design).  
- Đảm bảo validate dữ liệu đầu vào (sử dụng Joi / class-validator).  
- Tuân thủ cấu trúc folder chuẩn đã định trong Detail Design.  
- Tách biệt rõ: controller → service → repository.  
- Viết test unit (Jest) cho các hàm logic quan trọng.  
- API trả về dữ liệu JSON theo chuẩn response trong Detail Design.  

# Hướng dẫn khi viết tài liệu / phản hồi
- Luôn giải thích bằng **tiếng Việt**.  
- Trình bày gọn gàng, rõ ràng, dễ hiểu.  
- Nếu có lỗi, đề xuất cách fix dựa theo Detail Design.  
- Nếu tạo thêm function hoặc API mới, phải gợi ý update Detail Design.  
# .github/copilot-instructions.md

# Ngữ cảnh dự án
Dự án là ứng dụng xem phim di động (React Native, TypeScript).  
App lấy dữ liệu từ API phimapi.com, hiển thị danh sách phim, chi tiết phim, tìm kiếm, lọc theo thể loại/quốc gia/năm.  
Mọi phản hồi và code luôn bằng **tiếng Việt**.  
Tất cả phải tuân thủ **Detail Design** đã được phê duyệt.

# Quy tắc chung
- Luôn dùng **TypeScript** cho frontend và backend.  
- Code sạch, có comment bằng tiếng Việt.  
- Không gọi API trực tiếp trong component, phải thông qua **service layer**.  
- Response API phải được **define rõ type/interface** trong `types/` để đảm bảo type-safety.  
- Nếu API thay đổi hoặc thêm mới, gợi ý cập nhật Detail Design.  

# React Native (Frontend)
- Dùng React Native + TypeScript.  
- Điều hướng bằng **React Navigation**.  
- State management: **Redux Toolkit** hoặc Context API (theo Detail Design).  
- Màn hình chính cần: Trang chủ (phim mới), Danh mục phim, Chi tiết phim, Tìm kiếm, Bộ lọc (thể loại/quốc gia/năm).  
- Ảnh phim phải gọi qua API chuyển đổi WEBP:  
  `GET https://phimapi.com/image.php?url={image_url}`  

# API (Service Layer)
- Tạo thư mục `services/api` để chứa function gọi API.  
- Mỗi API endpoint trong file tham chiếu:  

  ## Danh sách phim mới  
  ```ts
  GET https://phimapi.com/danh-sach/phim-moi-cap-nhat?page={page}
