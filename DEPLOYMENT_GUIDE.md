# Apache Fineract - Hướng Dẫn Build và Deploy Toàn Diện

## 📋 Tổng Quan

Tài liệu này được viết dựa trên kinh nghiệm thực tế từ việc build và deploy Apache Fineract, bao gồm các lỗi thường gặp và cách khắc phục.

---

## 🎯 Các Phương Pháp Deploy

### 1. Docker Compose (KHUYẾN NGHỊ) ⭐
### 2. Manual JAR Build & Run  
### 3. Direct Gradle Run (Không khuyến nghị)
### 4. IDE Development Setup

---

## 🚀 Phương Pháp 1: Docker Compose (Dễ nhất và Ổn định nhất)

### ✅ Ưu điểm:
- Setup nhanh chóng, ít lỗi
- Database tự động được cấu hình
- Môi trường cách ly
- Dễ dàng cleanup và restart

### 📋 Yêu cầu hệ thống:
```bash
- Docker Desktop
- 8GB RAM trở lên
- 10GB dung lượng trống
```

### 🛠️ Các bước thực hiện:

#### Bước 1: Clone repository
```bash
git clone https://github.com/apache/fineract.git
cd fineract
```

#### Bước 2: Chọn Docker Compose file
```bash
# Với MariaDB (Khuyến nghị)
docker-compose up -d

# Hoặc với PostgreSQL
docker-compose -f docker-compose-postgresql.yml up -d
```

#### Bước 3: Kiểm tra status
```bash
docker ps
docker logs fineract-fineract-1 --tail=20
```

#### Bước 4: Health check
```bash
curl -k https://localhost:8443/fineract-provider/actuator/health
```

### 🔧 Troubleshooting Docker:

**Lỗi: Container unhealthy**
```bash
# Kiểm tra logs
docker logs fineract-fineract-1
docker logs mariadb

# Restart containers
docker-compose down
docker-compose up -d
```

**Lỗi: Port conflicts**
```bash
# Tìm process sử dụng port
netstat -ano | findstr :8443
netstat -ano | findstr :3306

# Kill process hoặc đổi port trong docker-compose.yml
```

---

## 🔨 Phương Pháp 2: Manual JAR Build & Run

### ⚠️ Kinh nghiệm từ lỗi trước:
- **Lỗi Java version**: Fineract yêu cầu Java 21, không tương thích với Java 17
- **Lỗi missing JDBC driver**: MariaDB driver không được bundle do license
- **Lỗi database schema**: Cần database được setup đúng trước

### 📋 Yêu cầu:
```bash
- Java 21 (OpenJDK hoặc Oracle)
- MariaDB 11.4+ hoặc PostgreSQL 13+
- Gradle 8.10+ (hoặc dùng wrapper)
```

### 🛠️ Setup môi trường:

#### Bước 1: Kiểm tra Java version
```bash
java -version
# Phải hiển thị Java 21

# Nếu không đúng, cài đặt Java 21
# Windows: Scoop install openjdk21
# Linux: sudo apt install openjdk-21-jdk
```

#### Bước 2: Setup database
```bash
# Sử dụng Docker cho database
docker run --name fineract-db -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=mysql \
  -e MYSQL_DATABASE=fineract_tenants \
  -e MYSQL_USER=fineract \
  -e MYSQL_PASSWORD=fineract \
  -d mariadb:11.4
```

#### Bước 3: Build JAR (Bỏ qua tasks lỗi)
```bash
# Build với skip problematic tasks
./gradlew bootJar -x test -x integrationTest -x doc -x swagger

# Hoặc build specific module
./gradlew :fineract-provider:bootJar -x test
```

#### Bước 4: Download JDBC Driver
```bash
# Download MariaDB Connector/J
curl -L -o mariadb-java-client.jar \
  https://repo1.maven.org/maven2/org/mariadb/jdbc/mariadb-java-client/3.5.2/mariadb-java-client-3.5.2.jar
```

#### Bước 5: Run JAR với driver
```bash
# Windows PowerShell
java '-Dloader.path=.' -jar fineract-provider/build/libs/fineract-provider-*.jar

# Linux/Mac
java -Dloader.path=. -jar fineract-provider/build/libs/fineract-provider-*.jar
```

### 🚨 Các lỗi thường gặp và cách fix:

#### Lỗi 1: UnsupportedClassVersionError
```
Error: A JNI error has occurred, please check your installation
Caused by: java.lang.UnsupportedClassVersionError
```
**Fix:** Cài đặt Java 21
```bash
echo $JAVA_HOME
export JAVA_HOME=/path/to/java21
```

#### Lỗi 2: ClassNotFoundException MariaDB Driver
```
ClassNotFoundException: org.mariadb.jdbc.Driver
```
**Fix:** Download và đặt driver trong classpath
```bash
# Đặt file .jar trong thư mục hiện tại
java -Dloader.path=. -jar application.jar
```

#### Lỗi 3: Schema Upgrade Exception
```
Make sure to upgrade to Fineract 1.6 first
```
**Fix:** Xóa database và tạo lại, hoặc dùng init script
```bash
docker rm -f fineract-db
# Chạy lại container với fresh database
```

#### Lỗi 4: PowerShell Parameter Parsing (Windows)
```
Error: Could not find or load main class .path=.
```
**Fix:** Dùng quotes đúng cách
```powershell
java '-Dloader.path=.' -jar application.jar
# Hoặc dùng escape
java `"-Dloader.path=.`" -jar application.jar
```

---

## ⚡ Phương Pháp 3: Direct Gradle Run (Không khuyến nghị)

### ⚠️ Tại sao không khuyến nghị:
- Lỗi tích hợp với self-service module
- Swagger generation failures  
- Dependency conflicts
- Chậm và resource-intensive

### 🛠️ Cách thử (nếu muốn):
```bash
# Skip problematic tasks
./gradlew bootRun -x doc -x swagger -x test

# Hoặc run specific profile
./gradlew bootRun --args='--spring.profiles.active=basicauth'
```

### 🚨 Lỗi thường gặp:
```
> Task :swagger FAILED
> Task :doc FAILED
```
**Fix:** Luôn skip các task này:
```bash
./gradlew bootRun -x doc -x swagger -x integrationTest -x test
```

---

## 💻 Phương Pháp 4: IDE Development Setup

### 🛠️ IntelliJ IDEA Setup:

#### Bước 1: Import project
```
File → Open → Select fineract folder
```

#### Bước 2: Configure JDK
```
File → Project Structure → Project → SDK → Java 21
```

#### Bước 3: Gradle Settings
```
File → Settings → Build Tools → Gradle
- Gradle JVM: Java 21
- Build and run using: IntelliJ IDEA (faster)
```

#### Bước 4: Run Configuration
```
Run → Edit Configurations → Add → Application
Main class: org.apache.fineract.ServerApplication
VM options: -Dloader.path=.
Program arguments: --spring.profiles.active=basicauth
```

### 🛠️ VS Code Setup:

#### Extensions cần thiết:
```
- Extension Pack for Java
- Gradle for Java
- Spring Boot Extension Pack
```

#### Launch configuration (.vscode/launch.json):
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Fineract",
            "request": "launch",
            "mainClass": "org.apache.fineract.ServerApplication",
            "projectName": "fineract-provider",
            "vmArgs": "-Dloader.path=.",
            "args": "--spring.profiles.active=basicauth"
        }
    ]
}
```

---

## 🔍 Verification & Testing

### 1. Health Check
```bash
curl -k https://localhost:8443/fineract-provider/actuator/health
# Response: {"status":"UP"}
```

### 2. API Test
```bash
# With tenant header
curl -k -H "Fineract-Platform-TenantId: default" \
     -u "mifos:password" \
     https://localhost:8443/fineract-provider/api/v1/users
```

### 3. Database Connection Test
```bash
# Connect to database
docker exec -it mariadb mysql -u root -pmysql

# Check databases
SHOW DATABASES;
USE fineract_tenants;
SHOW TABLES;
```

---

## 🛠️ Configuration Management

### Environment Variables:
```bash
# Database configuration
FINERACT_HIKARI_DRIVER_SOURCE_CLASS_NAME=org.mariadb.jdbc.Driver
FINERACT_HIKARI_JDBC_URL=jdbc:mariadb://localhost:3306/fineract_tenants
FINERACT_HIKARI_USERNAME=root
FINERACT_HIKARI_PASSWORD=mysql

# Tenant configuration  
FINERACT_TENANT_HOST=localhost
FINERACT_TENANT_PORT=3306
FINERACT_TENANT_USERNAME=root
FINERACT_TENANT_PASSWORD=mysql
```

### Application Properties:
```properties
# application-dev.properties
server.port=8443
server.ssl.enabled=true
fineract.security.basicauth.enabled=true
fineract.tenant.host=localhost
fineract.tenant.port=3306
```

---

## 📊 Performance Tuning

### JVM Settings:
```bash
# For development
java -Xmx4g -Xms2g -jar application.jar

# For production
java -Xmx8g -Xms4g -XX:+UseG1GC -jar application.jar
```

### Database Settings:
```sql
-- MariaDB tuning
SET GLOBAL innodb_buffer_pool_size = 2G;
SET GLOBAL max_connections = 200;
```

---

## 🔄 Cleanup & Maintenance

### Docker cleanup:
```bash
# Stop và remove containers
docker-compose down

# Remove volumes (mất data)
docker-compose down -v

# Clean up images
docker system prune -a
```

### Manual cleanup:
```bash
# Kill Java processes
taskkill /F /IM java.exe

# Clean Gradle cache
./gradlew clean
rm -rf ~/.gradle/caches/
```

---

## 📋 Troubleshooting Checklist

### Trước khi build:
- [ ] Java 21 installed và configured
- [ ] Docker Desktop running (nếu dùng containers)
- [ ] Ports 8443, 3306 available
- [ ] Sufficient RAM (8GB+)
- [ ] Stable internet connection

### Khi gặp lỗi build:
- [ ] Check Java version: `java -version`
- [ ] Clean và rebuild: `./gradlew clean bootJar`
- [ ] Skip problematic tasks: `-x test -x doc -x swagger`
- [ ] Check logs: `./gradlew --info bootJar`

### Khi gặp lỗi runtime:
- [ ] Database running và accessible
- [ ] JDBC driver trong classpath
- [ ] Correct connection parameters
- [ ] Check application logs

### Khi API không response:
- [ ] Application fully started (check logs)
- [ ] Port 8443 accessible
- [ ] SSL certificate accepted
- [ ] Correct API endpoints
- [ ] Authentication headers

---

## 🎯 Khuyến Nghị Cuối Cùng

### Cho Development:
1. **Dùng Docker Compose** - Nhanh và ổn định nhất
2. **IDE setup** cho debugging
3. **Manual JAR build** khi cần custom

### Cho Production:
1. **Docker containers** với external database
2. **Proper SSL certificates**
3. **Environment-specific configs**
4. **Monitoring và logging**

### Kinh Nghiệm Quan Trọng:
1. **Luôn dùng Java 21** - Version khác sẽ fail
2. **Skip problematic Gradle tasks** - Tiết kiệm thời gian  
3. **Docker Compose first** - Ít lỗi nhất
4. **Kiểm tra ports** - Conflict ports gây nhiều vấn đề
5. **Fresh database** - Schema issues rất khó debug

---

*Tài liệu này được viết dựa trên kinh nghiệm thực tế build Apache Fineract 1.13.1-SNAPSHOT với Java 21, MariaDB 11.4, và Windows 11 PowerShell environment.*
