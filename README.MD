
# TeenUp LMS Test - Docker Setup

## Yêu cầu

- [Docker](https://www.docker.com/) và [Docker Compose](https://docs.docker.com/compose/) đã cài đặt trên máy.

## Cách chạy project

1. **Tạo file `.env` tại tại thư mục gốc của dự án**  
   Ví dụ:
   ```
    DB_HOST=postgres
    DB_PORT=5432
    DB_SCHEMA=public
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=P@ssw0rd
    POSTGRES_DB=lms_db

    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer

   ```

2. **Chạy Docker Compose**
   Mở terminal tại thư mục gốc dự án và chạy:
   ```
   docker-compose up --build
   ```

3. **Truy cập ứng dụng**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3001](http://localhost:3001)
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

```
