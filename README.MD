# TeenUp LMS Test - Docker Setup

## Yêu cầu

- [Docker](https://www.docker.com/) và [Docker Compose](https://docs.docker.com/compose/) đã cài đặt trên máy.

## Cách chạy project

1. **Tạo file `.env` tại tại thư mục gốc của dự án**  
   Ví dụ:

   ```
   POSTGRES_DB=lms_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=P@ssw0rd

   DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

   VITE_BACKEND_URL=http://localhost:3000/api

   ```

2. **Chạy Docker Compose**  
   Mở terminal tại thư mục gốc dự án và chạy:

   ```
   docker-compose up -d --build
   ```

3. **Truy cập ứng dụng**

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:3000](http://localhost:3000)
   - Database: PostgreSQL chạy ở cổng `5432`

4. **Migrate database và Seeding dữ liệu**  
   Chạy lệnh sau để tạo bảng và dữ liệu mẫu:

   ```
   docker-compose exec backend npm run db:reset
   ```

## Mô tả sơ lược Database Schema

- **Parent**

  - `id`: Khóa chính, tự động tăng
  - `name`: Tên phụ huynh
  - `phone`: Số điện thoại (duy nhất)
  - `email`: Email (duy nhất)
  - Quan hệ: Một phụ huynh có nhiều học sinh (`children`)

- **Student**

  - `id`: Khóa chính, tự động tăng
  - `name`: Tên học sinh
  - `dob`: Ngày sinh
  - `gender`: Giới tính (tùy chọn: MALE, FEMALE, OTHER)
  - `currentGrade`: Lớp hiện tại
  - `parentId`: Khóa ngoại tới Parent
  - Quan hệ: Thuộc về một phụ huynh, có thể đăng ký nhiều lớp và nhiều subscription

- **Class**

  - `id`: Khóa chính, tự động tăng
  - `subject`: Môn học
  - `dayOfWeek`: Danh sách các ngày trong tuần
  - `timeSlot`: Khung giờ học
  - `teacherName`: Tên giáo viên
  - `maxStudents`: Số học sinh tối đa
  - Quan hệ: Có nhiều học sinh đăng ký

- **ClassRegistration**

  - `id`: Khóa chính, tự động tăng
  - `studentId`: Khóa ngoại tới Student
  - `classId`: Khóa ngoại tới Class
  - Quan hệ: Một học sinh có thể đăng ký nhiều lớp, một lớp có nhiều học sinh

- **Subscription**
  - `id`: Khóa chính, tự động tăng
  - `studentId`: Khóa ngoại tới Student
  - `packageName`: Tên khóa học
  - `startDate`, `endDate`: Ngày bắt đầu/kết thúc
  - `totalSessions`: Tổng số buổi
  - `usedSessions`: Số buổi đã dùng
  - Quan hệ: Một học sinh có thể có nhiều Khóa học

## Các endpoint chính và ví dụ truy vấn

### Parents

- **Tạo phụ huynh**

  ```
  POST /api/parents
  Body:
  {
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "email": "a.nguyen@example.com"
  }
  ```

- **Xem chi tiết phụ huynh**
  ```
  GET /api/parents/1
  ```

### Students

- **Tạo học sinh**

  ```
  POST /api/students
  Body:
  {
    "name": "Nguyễn Văn B",
    "dob": "2010-05-01",
    "gender": "MALE", // (MALE, FEMALE, OTHER)
    "currentGrade": "5",
    "parentId": 1
  }
  ```

- **Xem chi tiết học sinh (bao gồm thông tin phụ huynh)**
  ```
  GET /api/students/1
  ```

### Classes

- **Tạo lớp mới**

  ```
  POST /api/classes
  Body:
  {
    "subject": "Toán",
    "dayOfWeek": ["MONDAY", "WEDNESDAY"],
    "timeSlot": "18:00-19:30",
    "teacherName": "Cô Lan",
    "maxStudents": 20
  }
  ```

- **Danh sách lớp theo ngày (ALL, WEEKDAY, WEEKEND)**
  ```
  GET /api/classes?day=WEEKDAY
  ```

### ClassRegistrations

- **Đăng ký học sinh vào lớp**
  ```
  POST /api/classes/1/register
  Body:
  {
    "studentId": 1
  }
  ```

### Subscriptions

- **Khởi tạo khóa học**

  ```
  POST /api/subscriptions
  Body:
  {
    "studentId": 1,
    "packageName": "BASIC", // (BASIC, STANDARD, PREMIUM)
    "startDate": "2025-09-01",
    "endDate": "2025-12-01",
    "totalSessions": 12
  }
  ```

- **Đánh dấu đã dùng 1 buổi**

  ```
  PATCH /api/subscriptions/1/use
  ```

- **Xem trạng thái khóa học**
  ```
  GET /api/subscriptions/1
  ```

## Một số lệnh hữu ích

- Dừng các container:

  ```
  docker-compose down
  ```

- Xem logs:

  ```
  docker-compose logs -f
  ```

## Lưu ý

- Đảm bảo các biến môi trường trong `.env` khớp với cấu hình trong `docker-compose.yml`.
- Nếu thay đổi code, có thể cần chạy lại với `--build`.
