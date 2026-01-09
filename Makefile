# 개발용 MySQL 컨테이너 올리기
db-up:
	docker compose up -d mysql-reactpj

# 컨테이너만 정지 (데이터(volume)는 유지)
db-down:
	docker compose stop mysql-reactpj

# 컨테이너/볼륨 싹 밀고 init.sql로 재초기화
db-reset:
	docker compose down -v
	docker compose up -d mysql-reactpj

# DB 로그 보기
db-logs:
	docker compose logs -f mysql-reactpj

# DB 안으로 바로 들어가기 (mysql CLI)
db-shell:
	docker exec -it mysql-reactpj mysql -uappuser -papppass reactpj