# Nhật ký làm việc VivuViet V2

Mỗi buổi thêm một mục **ở đầu file** (mới nhất nằm trên cùng), đúng ba dòng:
xong gì, mai bắt đầu từ đâu, đang mắc ở đâu. Viết trước khi tắt máy, mất 5 phút.

## 2026-10-29

- **Xong:** Tách `provinces` (dữ liệu tham chiếu, 34 tỉnh) khỏi `destinations` (nội dung du lịch), quan hệ 1-N với FK `ON DELETE RESTRICT`. Thêm enum `DestinationStatus` (DRAFT | PUBLISHED), bỏ `destination_images` để làm lại sau, dựng lại migration `Init` và viết lại seed chạy trong một transaction (chạy lại không đổi gì). Thêm `GET /provinces`, `GET /provinces/:code` và bộ lọc `GET /destinations?province=<code>`; API public chỉ trả destination PUBLISHED thuộc tỉnh `isActive`. Export lại Postman theo endpoint mới. Đã commit trên nhánh `refactor/province-destination`.
- **Mai bắt đầu từ:** merge nhánh vào `develop`, rồi chọn một trong hai: làm lại ảnh điểm đến (cần quan hệ `images` OneToMany + ManyToOne) hoặc quay lại chặng 2 (Auth: Partner, đăng ký/đăng nhập, JWT). Phần auth đang nằm ở nhánh khác, cần lấy lại.
- **Đang mắc:** Frontend (`v2-api`) vẫn đọc `/destinations` theo hình dạng cũ nên bản đồ sẽ hỏng cho đến khi cấu trúc lại (bản đồ đọc `/provinces`, tô màu tỉnh có `destinationCount > 0`, thêm trang tỉnh và `/destinations/[slug]`). `CLAUDE.md` và `lo-trinh-vivuviet-v2.html` chưa cập nhật theo mô hình province/destination. `compose.yaml` vẫn chưa kiểm chứng trên DB trống nếu Docker chưa chạy được.

## 2026-10-12

- **Xong:** Chặng 1 phần backend hoàn tất. Postman (collection trong `docs/postman/`), ôn SQL (JOIN, LEFT JOIN, ràng buộc FK) trên DB thật, Swagger UI tại `/api/docs`, `ProblemDetailsFilter`, viết `compose.yaml` cho PostgreSQL 17 (chưa chạy thử). Đã bổ sung hàng Postman, Ôn SQL và Tập viết unit test vào lộ trình (112 buổi).
- **Mai bắt đầu từ:** đọc frontend để nối trang bản đồ và trang điểm đến vào API V2 (điều kiện "Xong khi" của chặng 1). Sau đó bắt đầu chặng 2 (Auth), gõ tay.
- **Đang mắc:** Docker Desktop không khởi động được, nên `compose.yaml` chưa được kiểm chứng. Cần làm trước khi viết e2e ở chặng 2: `docker compose up -d`, rồi `migration:run` và `seed` trên DB trống, phải ra 34 tỉnh. Trong lúc chờ vẫn dùng Postgres cài trên máy (cổng 5432).