
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

3. **Migrate và Seeding dữ liệu**
   ```
   docker-compose exec backend npm run db:reset
   ```

4. **Truy cập ứng dụng**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:3000](http://localhost:3000)
   - Database: PostgreSQL chạy ở cổng `5432`

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