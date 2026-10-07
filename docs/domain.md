# Đặc tả nghiệp vụ VivuViet V2

Tài liệu này mô tả **hành vi đúng** của hệ thống bằng lời thường: ai được làm gì, điều kiện nào, kết quả ra sao. Không chép lại hành vi hiện tại của V1, vì V1 có nhiều chỗ sai. V1 chỉ dùng để nhớ ra tính năng.

Mọi quy tắc trong file này đã được chốt cho V2. Với những chỗ V1 không có câu trả lời, quyết định và lý do nằm ở mục 11. Muốn đổi một quy tắc thì sửa file này trước, rồi mới sửa code.

## 1. Thuật ngữ

| Từ trong tài liệu | Ý nghĩa | Tên trong V1 |
|---|---|---|
| Đối tác (Partner) | Doanh nghiệp hoặc cá nhân đăng ký để quảng bá dịch vụ trên VivuViet | `user` có `role = partner` |
| Ưu đãi (Offer) | Một dịch vụ do đối tác đăng: tour, khách sạn, nhà hàng, kèm link affiliate | `service` |
| Bài viết (Post) | Nội dung giới thiệu gắn với một điểm đến | `post` |
| Điểm đến (Destination) | Một trong 34 tỉnh/thành | `destination` |
| Sự kiện (Event) | Lễ hội theo khoảng ngày | `event` |
| Gói (Tier) | Mức quyền lợi của đối tác: `BASIC`, `STANDARD`, `PREMIUM` | `partnerTier` |

## 2. Vai trò

| Vai trò | Cách có tài khoản | Làm được gì |
|---|---|---|
| Khách ẩn danh | Không cần tài khoản | Xem điểm đến, ưu đãi đã duyệt, bài viết đã duyệt, sự kiện. Bấm link affiliate. |
| Đối tác | Tự đăng ký, chờ admin duyệt | Đăng nhập, quản lý hồ sơ và nội dung của chính mình (xem mục 3 và 5). |
| Quản trị viên | Tạo bằng seed, không đăng ký công khai | Duyệt đối tác, ưu đãi, bài viết; quản lý điểm đến và sự kiện; xem thống kê. |

Một tài khoản chỉ có một vai trò. Đăng nhập dùng chung một endpoint cho cả đối tác và admin.

## 3. Đối tác

### Đăng ký

Thông tin bắt buộc: email, mật khẩu (tối thiểu 8 ký tự), tên doanh nghiệp, số điện thoại, gói muốn đăng ký. Tuỳ chọn: website, fanpage.

- Email trùng hoặc số điện thoại trùng thì trả 409 và nói rõ trùng cái nào.
- Tài khoản mới có vai trò Đối tác, trạng thái `PENDING`.
- Gói được ghi theo lựa chọn lúc đăng ký. Chưa có thanh toán, nên gói chỉ là nhãn do admin xác nhận khi duyệt.

### Máy trạng thái

```
PENDING ──duyệt──> ACTIVE ──tạm khoá──> SUSPENDED
   │                  ^                     │
   │                  └────mở khoá──────────┘
   └──từ chối (bắt buộc có lý do)──> REJECTED ──sửa hồ sơ & gửi lại──> PENDING
```

| Từ | Sang | Ai làm | Điều kiện | Hệ quả |
|---|---|---|---|---|
| PENDING | ACTIVE | Admin | Không | Ghi `approved_at`. Gửi email chúc mừng kèm link đăng nhập. |
| PENDING | REJECTED | Admin | Bắt buộc có lý do | Lưu lý do. Gửi email kèm lý do. |
| ACTIVE | SUSPENDED | Admin | Bắt buộc có lý do | Ưu đãi và bài viết của đối tác ẩn khỏi trang công khai ngay. |
| SUSPENDED | ACTIVE | Admin | Không | Nội dung đã duyệt hiện lại. |
| REJECTED | PENDING | Chính đối tác | Sửa hồ sơ rồi gửi lại | Xoá lý do từ chối cũ. |

Mọi chuyển trạng thái khác đều bị từ chối. Cụ thể, duyệt một đối tác đã `ACTIVE` trả 409, và từ chối mà thiếu lý do trả 400.

### Quyền theo trạng thái

| Trạng thái | Đăng nhập | Xem hồ sơ và nội dung của mình | Tạo hoặc sửa nội dung |
|---|---|---|---|
| PENDING | Có | Có | Không (403) |
| ACTIVE | Có | Có | Có |
| SUSPENDED | Có | Có, kèm lý do bị khoá | Không (403) |
| REJECTED | Có | Có, kèm lý do bị từ chối | Chỉ sửa hồ sơ để gửi lại |

Lý do cho phép đăng nhập ở mọi trạng thái: đối tác cần thấy được mình đang chờ duyệt hay bị từ chối vì sao. Quyền tạo nội dung do backend kiểm tra mỗi request, đọc trạng thái từ database, không tin thông tin trong token.

### Dữ liệu công khai của đối tác

Trang công khai chỉ hiện tên doanh nghiệp, logo, website, fanpage của đối tác `ACTIVE`. Email và số điện thoại đăng ký **không bao giờ** hiện ra ở API công khai. (Số điện thoại liên hệ của từng ưu đãi là dữ liệu riêng của ưu đãi, xem mục 5.)

## 4. Gói

Gói do admin gán và đổi, đối tác không tự đổi. Bảng dưới là quyền lợi theo trang giới thiệu của V1, đã chuyển thành quy tắc backend kiểm tra được.

| Quyền | BASIC | STANDARD | PREMIUM |
|---|---|---|---|
| Có hồ sơ doanh nghiệp, gắn link website/fanpage | Có | Có | Có |
| Số ưu đãi tối đa cùng lúc | 3 | 10 | 50 |
| Ưu đãi được admin bật nổi bật | Không | Có | Có |
| Viết bài viết giới thiệu | Không | Không | Có |
| Kiểm duyệt ưu tiên | Không | Không | Có |

Số ưu đãi tối đa tính trên mọi ưu đãi đang tồn tại của đối tác, bất kể trạng thái. Xoá một ưu đãi thì trả lại một suất. Vượt giới hạn thì trả 409 kèm thông báo nói rõ gói hiện tại và giới hạn. Các con số nằm trong một hằng số cấu hình duy nhất ở backend, nên đổi không cần sửa logic.

**Đổi gói.** Chỉ admin đổi gói của đối tác. Khi hạ gói:
- ưu đãi của đối tác đang có cờ nổi bật mà gói mới dưới STANDARD thì cờ tắt ngay;
- nếu số ưu đãi hiện có vượt giới hạn mới, các ưu đãi cũ vẫn giữ nguyên, đối tác chỉ không tạo thêm được;
- bài viết đã duyệt vẫn hiển thị, nhưng đối tác không tạo hay sửa bài được nữa (xem mục 6).

Quyền "kiểm duyệt ưu tiên" chỉ có nghĩa là admin xem danh sách chờ duyệt của PREMIUM trước. Hệ thống không cần xử lý riêng, chỉ cần sắp xếp được theo gói.

## 5. Ưu đãi (Offer)

### Thông tin

Bắt buộc: tên, loại, link affiliate (đúng định dạng URL), ảnh đại diện, điểm đến. Tuỳ chọn: mô tả, danh sách điểm nổi bật (có thứ tự), giá từ, giá đến, địa chỉ, số điện thoại liên hệ.

- Loại: `TOUR`, `HOTEL`, `RESTAURANT`, `TRANSPORT`, `EXPERIENCE`, `HOMESTAY`, `OTHER`.
- Giá tính bằng VND, số nguyên không âm. Nếu có cả hai thì giá đến không nhỏ hơn giá từ.
- Điểm đến phải đang hoạt động.
- Mỗi ưu đãi thuộc đúng một đối tác. Không thể chuyển sang đối tác khác.

### Máy trạng thái

```
PENDING ──duyệt──> APPROVED
PENDING ──từ chối (lý do)──> REJECTED
APPROVED ──gỡ (lý do)──> REJECTED
REJECTED ──đối tác sửa & gửi lại──> PENDING
APPROVED ──đối tác sửa──> PENDING (tạm ẩn)
```

| Từ | Sang | Ai làm | Điều kiện |
|---|---|---|---|
| (mới tạo) | PENDING | Đối tác ACTIVE | Còn suất theo gói (mục 4). Luôn bắt đầu ở PENDING, kể cả PREMIUM |
| PENDING | APPROVED | Admin | Không |
| PENDING | REJECTED | Admin | Bắt buộc có lý do |
| APPROVED | REJECTED | Admin | Bắt buộc có lý do (gỡ ưu đãi vi phạm) |
| REJECTED | PENDING | Chủ ưu đãi | Sửa nội dung rồi gửi lại, xoá lý do cũ |
| APPROVED | PENDING | Chủ ưu đãi | Mọi lần sửa nội dung đều đưa về chờ duyệt, ưu đãi tạm ẩn |

Trạng thái chỉ đổi qua các hành động trên. Người dùng không bao giờ gửi trực tiếp giá trị `status`.

### Ai thấy ưu đãi nào

Một ưu đãi hiện trên trang công khai khi **đồng thời** thoả cả ba điều kiện: trạng thái `APPROVED`, đối tác `ACTIVE`, và điểm đến đang hoạt động.

- Đối tác xem được mọi ưu đãi của mình, kèm trạng thái và lý do từ chối. Đối tác khác nhận 404 khi truy cập ưu đãi không phải của mình.
- Đối tác không được sửa các trường do hệ thống hoặc admin quản lý: trạng thái, cờ nổi bật, lượt xem, lượt bấm, chủ sở hữu.
- Đối tác xoá được ưu đãi của chính mình. Admin xoá được mọi ưu đãi.

### Nổi bật

Một cờ duy nhất `is_featured` (V1 có hai cờ `isFeatured` và `isPriority` nhưng dùng như nhau). Chỉ admin bật, chỉ bật được cho ưu đãi `APPROVED` của đối tác gói STANDARD trở lên. Nếu ưu đãi bị gỡ hoặc đưa về chờ duyệt thì cờ này tự tắt.

### Tìm kiếm công khai

Lọc theo loại, điểm đến, khoảng giá. Sắp xếp theo mới nhất, giá tăng, giá giảm, nổi bật trước. Phân trang. Tất cả thực hiện trong SQL.

### Bộ đếm

- Lượt xem tăng khi mở chi tiết ưu đãi.
- Lượt bấm tăng khi khách bấm link affiliate.
- Cả hai chỉ tăng với ưu đãi đang hiển thị công khai, không cần đăng nhập, chưa chống đếm trùng.

## 6. Bài viết (Post)

### Thông tin

Tiêu đề, nội dung HTML, điểm đến, banner (tiêu đề, ảnh, chú thích ảnh), bộ ảnh gallery có thứ tự (ảnh và chú thích).

- Nội dung HTML được lọc ở backend khi lưu: bỏ thẻ `<script>`, thuộc tính sự kiện như `onerror`, và URL `javascript:`. Frontend không phải là nơi lọc duy nhất.
- Có hai loại: bài hệ thống và bài đối tác.

### Bài hệ thống

Do admin tạo, không thuộc đối tác nào. Duyệt ngay (`APPROVED`), ngày đăng là lúc tạo. Admin sửa, xoá được.

### Bài đối tác

Chỉ đối tác `ACTIVE` gói PREMIUM được tạo. Backend kiểm tra gói mỗi lần tạo, không dựa vào việc frontend ẩn tab.

```
PENDING ──duyệt──> APPROVED
PENDING ──từ chối (lý do)──> REJECTED ──đối tác sửa & gửi lại──> PENDING
APPROVED ──đối tác sửa──> PENDING (tạm ẩn)
```

- Ngày đăng được ghi lúc admin duyệt lần đầu.
- Từ chối bắt buộc có lý do.
- Nếu đối tác bị hạ gói xuống dưới PREMIUM, bài đã duyệt vẫn hiển thị nhưng họ không tạo hay sửa bài được nữa.
- Nếu đối tác bị `SUSPENDED`, mọi bài của họ ẩn khỏi trang công khai (theo mục 3) và hiện lại khi được mở khoá.

### Công khai

Chỉ bài `APPROVED`, của đối tác `ACTIVE` (hoặc bài hệ thống), thuộc điểm đến đang hoạt động.

## 7. Điểm đến (Destination)

- Đúng 34 tỉnh/thành, tạo sẵn bằng seed. Không có chức năng tạo hay xoá điểm đến.
- Mỗi điểm đến có `code` duy nhất dạng slug (ví dụ `quang-ninh`) dùng trong URL công khai. `code` không đổi sau khi tạo.
- Admin sửa được: tên, mô tả ngắn, banner, gallery, bật/tắt hiển thị.
- Điểm đến đang tắt:
  - không xuất hiện trong danh sách công khai;
  - truy cập theo `code` trả 404;
  - ưu đãi và bài viết thuộc về nó cũng ẩn;
  - không chọn được khi đối tác tạo ưu đãi hoặc bài viết mới.
- Trang điểm đến công khai trả gộp một lần: thông tin điểm đến, các bài viết đã duyệt, các ưu đãi nổi bật.

## 8. Sự kiện (Event)

- Chỉ admin tạo, sửa, xoá. Đối tác và khách chỉ xem.
- Thông tin: tiêu đề, mô tả, ảnh, ngày bắt đầu, ngày kết thúc, địa điểm (chữ tự do), điểm đến (không bắt buộc), bật/tắt hiển thị.
- Ngày bắt đầu và ngày kết thúc là **ngày lịch** (không có giờ). Ngày kết thúc không nhỏ hơn ngày bắt đầu.
- Trạng thái `UPCOMING`, `ONGOING`, `ENDED` **không lưu**, được tính lúc đọc từ ngày hôm nay theo múi giờ `Asia/Ho_Chi_Minh`. Nhờ vậy sửa ngày thì trạng thái luôn đúng.
- Danh sách công khai chỉ gồm sự kiện đang bật.
- Lọc theo tháng trả mọi sự kiện **có giao với tháng đó**. Sự kiện 20/12 đến 05/01 xuất hiện ở cả tháng 12 và tháng 1.

## 9. Quy tắc chung

- **Công khai chỉ thấy nội dung đã duyệt.** Mọi API công khai áp dụng chung điều kiện ở mục 5, 6, 7.
- **Mọi quyền kiểm tra ở backend.** Ẩn nút trên giao diện chỉ để tiện dùng, không phải phân quyền.
- **Không tin dữ liệu client gửi lên cho các trường hệ thống:** trạng thái, vai trò, gói, chủ sở hữu, cờ nổi bật, bộ đếm.
- **Lý do từ chối được lưu** và đối tác xem lại được, ở cả đối tác, ưu đãi và bài viết.
- **Email chỉ gửi sau khi thay đổi đã lưu thành công.** Gửi mail lỗi chỉ ghi log, không làm hỏng thao tác chính.
- Các email hệ thống gửi: đối tác được duyệt, đối tác bị từ chối. Thao tác khác chưa có email.
- Đơn vị tiền là VND, số nguyên. Mốc thời gian lưu theo UTC, hiển thị theo `Asia/Ho_Chi_Minh`.

## 10. Ngoài phạm vi V2

- Bảng thông báo. Dashboard admin hiện một con số: số đối tác, ưu đãi, bài viết đang chờ duyệt.
- Thanh toán gói, gia hạn, vòng đời subscription.
- Tài khoản du khách (yêu thích, đánh giá, bình luận).
- Đăng nhập bằng Google/Facebook, quên mật khẩu, xác minh email.
- Sửa ưu đãi bằng bản nháp chờ duyệt riêng (V1 có dấu vết `pendingUpdates` nhưng chưa bao giờ dùng).

## 11. Các quyết định đã chốt

Những chỗ V1 không có câu trả lời. Mỗi quyết định kèm lý do, để sau này nhìn lại biết vì sao.

| # | Vấn đề | Quyết định | Lý do |
|---|---|---|---|
| 1 | Đối tác sửa ưu đãi đã duyệt | Quay về `PENDING` và tạm ẩn cho đến khi admin duyệt lại | Nội dung công khai luôn đã được kiểm duyệt, không có kẽ hở để đối tác sửa thành nội dung xấu sau khi duyệt. Phương án giữ bản cũ và duyệt bản nháp cần thêm bảng và nhiều rule, chưa đáng ở quy mô hiện tại. |
| 2 | Giới hạn số ưu đãi theo gói | BASIC 3, STANDARD 10, PREMIUM 50, đặt trong một hằng số cấu hình | Gói chưa có tiền nhưng cần có khác biệt thật để các gói có ý nghĩa. Kiểm tra giới hạn chỉ là một câu đếm, rẻ và dễ đổi số sau. |
| 3 | Ai được đăng ưu đãi | Mọi đối tác `ACTIVE`, mọi gói, trong giới hạn ở dòng 2 | Ưu đãi là lõi sản phẩm. Gói PREMIUM khác biệt ở quyền viết bài, số suất và độ ưu tiên, không phải ở chỗ có được đăng hay không. |
| 4 | Đối tác bị từ chối | Sửa hồ sơ rồi gửi lại, về `PENDING` | Email và số điện thoại là duy nhất nên bắt đăng ký lại là bế tắc. Lý do từ chối đã được lưu nên đối tác biết cần sửa gì. |
| 5 | Gỡ ưu đãi đã duyệt | Admin chuyển `APPROVED` sang `REJECTED` kèm lý do | Cần một cách gỡ nội dung vi phạm mà không xoá mất dấu vết. Đối tác thấy lý do và có thể sửa gửi lại. |
| 6 | Hạ gói đối tác | Bài viết đã duyệt vẫn hiển thị, không tạo hay sửa thêm. Cờ nổi bật tự tắt nếu gói dưới STANDARD. Ưu đãi vượt giới hạn vẫn giữ | Không xoá hay ẩn nội dung đã duyệt chỉ vì đổi gói, tránh gây bất ngờ cho đối tác. Quyền được tính khi hành động, không hồi tố. |
| 7 | Đếm trùng lượt xem, lượt bấm | Chưa chống trùng. Số liệu là số lượt thô | Chống trùng cần định danh khách (cookie, IP) và bảng lưu. Chưa có nhu cầu báo cáo chính xác. Khi cần, thêm sau mà không đổi mô hình hiện tại. |
| 8 | Đổi gói | Chỉ admin đổi, chưa có luồng đối tác xin nâng gói | Chưa có thanh toán, nên việc đổi gói là thoả thuận ngoài hệ thống. Ghi nhận kết quả vào hệ thống là đủ. |
