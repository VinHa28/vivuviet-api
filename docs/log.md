# Nhật ký làm việc VivuViet V2

Mỗi buổi thêm một mục **ở đầu file** (mới nhất nằm trên cùng), đúng ba dòng:
xong gì, mai bắt đầu từ đâu, đang mắc ở đâu. Viết trước khi tắt máy, mất 5 phút.

## 2026-10-12

- **Xong:** Chặng 1 phần backend hoàn tất. Postman (collection trong `docs/postman/`), ôn SQL (JOIN, LEFT JOIN, ràng buộc FK) trên DB thật, Swagger UI tại `/api/docs`, `ProblemDetailsFilter`, viết `compose.yaml` cho PostgreSQL 17 (chưa chạy thử). Đã bổ sung hàng Postman, Ôn SQL và Tập viết unit test vào lộ trình (112 buổi).
- **Mai bắt đầu từ:** đọc frontend để nối trang bản đồ và trang điểm đến vào API V2 (điều kiện "Xong khi" của chặng 1). Sau đó bắt đầu chặng 2 (Auth), gõ tay.
- **Đang mắc:** Docker Desktop không khởi động được, nên `compose.yaml` chưa được kiểm chứng. Cần làm trước khi viết e2e ở chặng 2: `docker compose up -d`, rồi `migration:run` và `seed` trên DB trống, phải ra 34 tỉnh. Trong lúc chờ vẫn dùng Postgres cài trên máy (cổng 5432).