# Apache Fineract - Quick Deploy Scripts

## Windows PowerShell Scripts

### 1. Docker Compose Deploy (deploy-docker.ps1)
```powershell
#!/usr/bin/env pwsh
# Apache Fineract Docker Deployment Script

Write-Host "🚀 Apache Fineract Docker Deployment" -ForegroundColor Green

# Check Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found. Please install Docker Desktop" -ForegroundColor Red
    exit 1
}

# Check if Docker is running
try {
    docker ps | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is available" -ForegroundColor Green

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Clean up old images (optional)
$cleanUp = Read-Host "Clean up old containers and images? (y/N)"
if ($cleanUp -eq 'y' -or $cleanUp -eq 'Y') {
    Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
    docker-compose down -v --remove-orphans
    docker system prune -f
}

# Start services
Write-Host "🚀 Starting Fineract services..." -ForegroundColor Green
docker-compose up -d

# Wait for services
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep 30

# Check health
Write-Host "🔍 Checking service health..." -ForegroundColor Cyan
$maxAttempts = 12
$attempt = 0

do {
    $attempt++
    Write-Host "Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "https://localhost:8443/fineract-provider/actuator/health" -SkipCertificateCheck -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Fineract is healthy!" -ForegroundColor Green
            Write-Host "🌐 Access: https://localhost:8443/fineract-provider/api/v1" -ForegroundColor Cyan
            Write-Host "📊 Health: https://localhost:8443/fineract-provider/actuator/health" -ForegroundColor Cyan
            break
        }
    } catch {
        if ($attempt -eq $maxAttempts) {
            Write-Host "❌ Health check failed after $maxAttempts attempts" -ForegroundColor Red
            Write-Host "Check logs: docker logs fineract-fineract-1" -ForegroundColor Yellow
            break
        }
        Start-Sleep 15
    }
} while ($attempt -lt $maxAttempts)

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
```

### 2. Manual JAR Build Script (build-jar.ps1)
```powershell
#!/usr/bin/env pwsh
# Apache Fineract Manual JAR Build Script

Write-Host "🔨 Apache Fineract Manual Build" -ForegroundColor Green

# Check Java version
Write-Host "☕ Checking Java version..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1 | Select-String "version" | ForEach-Object { $_.ToString() }
    Write-Host "Java version: $javaVersion" -ForegroundColor Gray
    
    if ($javaVersion -notmatch "21\.") {
        Write-Host "❌ Java 21 required! Current version not supported." -ForegroundColor Red
        Write-Host "Install Java 21: https://adoptium.net/temurin/releases/" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Java 21 detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found or not accessible" -ForegroundColor Red
    exit 1
}

# Check if MariaDB container is running
Write-Host "🗄️ Checking database..." -ForegroundColor Cyan
$dbRunning = docker ps --format "table {{.Names}}" | Select-String "mariadb|fineract.*db"
if (!$dbRunning) {
    Write-Host "📦 Starting MariaDB container..." -ForegroundColor Yellow
    docker run --name fineract-mariadb -d -p 3306:3306 `
        -e MYSQL_ROOT_PASSWORD=mysql `
        -e MYSQL_DATABASE=fineract_tenants `
        -e MYSQL_USER=fineract `
        -e MYSQL_PASSWORD=fineract `
        mariadb:11.4
        
    Write-Host "⏳ Waiting for database to start..." -ForegroundColor Yellow
    Start-Sleep 20
}
Write-Host "✅ Database ready" -ForegroundColor Green

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
./gradlew clean

# Build JAR with problematic tasks skipped
Write-Host "🔨 Building JAR (this may take 5-10 minutes)..." -ForegroundColor Cyan
$buildResult = ./gradlew bootJar -x test -x integrationTest -x doc -x swagger --no-daemon --stacktrace

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Try: ./gradlew :fineract-provider:bootJar -x test --no-daemon" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Download JDBC driver if not exists
$jdbcDriver = "mariadb-java-client-3.5.2.jar"
if (!(Test-Path $jdbcDriver)) {
    Write-Host "📥 Downloading MariaDB JDBC driver..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://repo1.maven.org/maven2/org/mariadb/jdbc/mariadb-java-client/3.5.2/mariadb-java-client-3.5.2.jar" -OutFile $jdbcDriver
}
Write-Host "✅ JDBC driver ready" -ForegroundColor Green

# Find the built JAR
$jarFile = Get-ChildItem -Path "fineract-provider/build/libs/" -Name "*SNAPSHOT.jar" | Select-Object -First 1
if (!$jarFile) {
    Write-Host "❌ JAR file not found in fineract-provider/build/libs/" -ForegroundColor Red
    exit 1
}

$fullJarPath = "fineract-provider/build/libs/$jarFile"
Write-Host "📦 JAR file: $fullJarPath" -ForegroundColor Green

# Run the application
Write-Host "🚀 Starting Fineract application..." -ForegroundColor Green
Write-Host "⏳ This will take 2-3 minutes to fully start..." -ForegroundColor Yellow
Write-Host "🌐 Access will be available at: https://localhost:8443" -ForegroundColor Cyan

java '-Dloader.path=.' -jar $fullJarPath
```

### 3. Development Setup Script (setup-dev.ps1)
```powershell
#!/usr/bin/env pwsh
# Apache Fineract Development Environment Setup

Write-Host "🛠️ Apache Fineract Development Setup" -ForegroundColor Green

# Check prerequisites
$prerequisites = @{
    "Java 21" = { java -version 2>&1 | Select-String "21\." }
    "Docker" = { Get-Command docker -ErrorAction SilentlyContinue }
    "Git" = { Get-Command git -ErrorAction SilentlyContinue }
}

foreach ($prereq in $prerequisites.GetEnumerator()) {
    Write-Host "Checking $($prereq.Key)..." -ForegroundColor Cyan
    if (& $prereq.Value) {
        Write-Host "✅ $($prereq.Key) found" -ForegroundColor Green
    } else {
        Write-Host "❌ $($prereq.Key) not found" -ForegroundColor Red
    }
}

# Clone repository if not exists
if (!(Test-Path ".git")) {
    Write-Host "📥 Cloning Fineract repository..." -ForegroundColor Cyan
    git clone https://github.com/apache/fineract.git .
}

# Create development docker-compose override
$devOverride = @"
version: '3.8'
services:
  fineract:
    ports:
      - "8443:8443"
      - "5005:5005"  # Debug port
    environment:
      - JAVA_TOOL_OPTIONS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
      - FINERACT_MODE=development
    volumes:
      - ./logs:/app/logs
  
  db:
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=mysql
    volumes:
      - db_data:/var/lib/mysql
      
volumes:
  db_data:
"@

$devOverride | Out-File -FilePath "docker-compose.dev.yml" -Encoding UTF8

# Create VS Code settings
$vscodeDir = ".vscode"
if (!(Test-Path $vscodeDir)) {
    New-Item -ItemType Directory -Path $vscodeDir
}

$launchJson = @"
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Debug Fineract",
            "request": "attach",
            "hostName": "localhost",
            "port": 5005
        },
        {
            "type": "java",
            "name": "Run Fineract",
            "request": "launch",
            "mainClass": "org.apache.fineract.ServerApplication",
            "projectName": "fineract-provider",
            "vmArgs": "-Dloader.path=. -Xmx4g",
            "args": "--spring.profiles.active=basicauth"
        }
    ]
}
"@

$launchJson | Out-File -FilePath "$vscodeDir/launch.json" -Encoding UTF8

Write-Host "✅ Development environment configured!" -ForegroundColor Green
Write-Host "📁 Files created:" -ForegroundColor Cyan
Write-Host "  - docker-compose.dev.yml" -ForegroundColor Gray
Write-Host "  - .vscode/launch.json" -ForegroundColor Gray
Write-Host "" 
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start dev environment: docker-compose -f docker-compose.dev.yml up -d" -ForegroundColor Gray
Write-Host "  2. Open VS Code: code ." -ForegroundColor Gray
Write-Host "  3. Attach debugger on port 5005" -ForegroundColor Gray
```

### 4. Health Check Script (health-check.ps1)
```powershell
#!/usr/bin/env pwsh
# Apache Fineract Health Check Script

Write-Host "🔍 Apache Fineract Health Check" -ForegroundColor Green

$endpoints = @{
    "Health Check" = "https://localhost:8443/fineract-provider/actuator/health"
    "Info Endpoint" = "https://localhost:8443/fineract-provider/actuator/info"
    "API Root" = "https://localhost:8443/fineract-provider/api/v1"
}

foreach ($endpoint in $endpoints.GetEnumerator()) {
    Write-Host "Testing $($endpoint.Key)..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Value -SkipCertificateCheck -TimeoutSec 10
        $status = $response.StatusCode
        
        if ($status -eq 200) {
            Write-Host "✅ $($endpoint.Key): OK ($status)" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $($endpoint.Key): $status" -ForegroundColor Yellow
        }
        
        # Show response for health endpoint
        if ($endpoint.Key -eq "Health Check" -and $status -eq 200) {
            $content = $response.Content | ConvertFrom-Json
            Write-Host "   Status: $($content.status)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ $($endpoint.Key): Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Check Docker containers
Write-Host "`n🐳 Docker Containers:" -ForegroundColor Cyan
try {
    $containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | Out-String
    Write-Host $containers -ForegroundColor Gray
} catch {
    Write-Host "❌ Docker not available" -ForegroundColor Red
}

# Check database connection
Write-Host "🗄️ Database Connection:" -ForegroundColor Cyan
try {
    $dbTest = docker exec mariadb mysqladmin -u root -pmysql ping 2>$null
    if ($dbTest -match "alive") {
        Write-Host "✅ Database: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Database: Not responding" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Database: Container not found" -ForegroundColor Red
}

Write-Host "`n📊 Summary completed!" -ForegroundColor Green
```

## Linux/Mac Bash Scripts

### 1. Docker Deploy (deploy-docker.sh)
```bash
#!/bin/bash
# Apache Fineract Docker Deployment Script

echo "🚀 Apache Fineract Docker Deployment"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker"
    exit 1
fi

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker"
    exit 1
fi

echo "✅ Docker is available"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null

# Start services
echo "🚀 Starting Fineract services..."
docker-compose up -d

# Wait and health check
echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Checking service health..."
for i in {1..12}; do
    echo "Attempt $i/12..."
    if curl -k -s https://localhost:8443/fineract-provider/actuator/health | grep -q "UP"; then
        echo "✅ Fineract is healthy!"
        echo "🌐 Access: https://localhost:8443/fineract-provider/api/v1"
        break
    fi
    
    if [ $i -eq 12 ]; then
        echo "❌ Health check failed"
        echo "Check logs: docker logs fineract-fineract-1"
    else
        sleep 15
    fi
done

echo "🎉 Deployment complete!"
```

### 2. Manual Build (build-jar.sh)
```bash
#!/bin/bash
# Apache Fineract Manual JAR Build Script

echo "🔨 Apache Fineract Manual Build"

# Check Java 21
echo "☕ Checking Java version..."
if ! java -version 2>&1 | grep -q "21\."; then
    echo "❌ Java 21 required!"
    echo "Install Java 21: https://adoptium.net/temurin/releases/"
    exit 1
fi
echo "✅ Java 21 detected"

# Start database if needed
echo "🗄️ Checking database..."
if ! docker ps | grep -q mariadb; then
    echo "📦 Starting MariaDB container..."
    docker run --name fineract-mariadb -d -p 3306:3306 \
        -e MYSQL_ROOT_PASSWORD=mysql \
        -e MYSQL_DATABASE=fineract_tenants \
        -e MYSQL_USER=fineract \
        -e MYSQL_PASSWORD=fineract \
        mariadb:11.4
    sleep 20
fi
echo "✅ Database ready"

# Build
echo "🔨 Building JAR..."
./gradlew clean bootJar -x test -x integrationTest -x doc -x swagger --no-daemon

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Download JDBC driver
if [ ! -f "mariadb-java-client-3.5.2.jar" ]; then
    echo "📥 Downloading JDBC driver..."
    curl -L -o mariadb-java-client-3.5.2.jar \
        https://repo1.maven.org/maven2/org/mariadb/jdbc/mariadb-java-client/3.5.2/mariadb-java-client-3.5.2.jar
fi

# Run
JAR_FILE=$(find fineract-provider/build/libs/ -name "*SNAPSHOT.jar" | head -1)
echo "🚀 Starting: $JAR_FILE"
java -Dloader.path=. -jar "$JAR_FILE"
```

## Makefile (Universal)
```makefile
# Apache Fineract Deployment Makefile

.PHONY: help docker-deploy jar-build dev-setup clean health

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

docker-deploy: ## Deploy with Docker Compose
	@echo "🚀 Deploying with Docker..."
	docker-compose down 2>/dev/null || true
	docker-compose up -d
	@echo "⏳ Waiting for startup..."
	sleep 30
	@make health

jar-build: ## Build and run JAR manually  
	@echo "🔨 Building JAR..."
	./gradlew clean bootJar -x test -x doc -x swagger --no-daemon
	@echo "📥 Downloading JDBC driver..."
	curl -L -o mariadb-java-client-3.5.2.jar https://repo1.maven.org/maven2/org/mariadb/jdbc/mariadb-java-client/3.5.2/mariadb-java-client-3.5.2.jar 2>/dev/null || true
	@echo "🚀 Starting application..."
	java -Dloader.path=. -jar fineract-provider/build/libs/*SNAPSHOT.jar

dev-setup: ## Setup development environment
	@echo "🛠️ Setting up development environment..."
	docker run --name fineract-mariadb -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysql -e MYSQL_DATABASE=fineract_tenants mariadb:11.4 2>/dev/null || true

clean: ## Clean up containers and builds
	@echo "🧹 Cleaning up..."
	docker-compose down -v --remove-orphans 2>/dev/null || true
	docker rm -f fineract-mariadb 2>/dev/null || true
	./gradlew clean 2>/dev/null || true

health: ## Check application health
	@echo "🔍 Health check..."
	@curl -k -s https://localhost:8443/fineract-provider/actuator/health | grep -q "UP" && echo "✅ Healthy" || echo "❌ Unhealthy"

logs: ## Show application logs
	docker logs fineract-fineract-1 --tail=50

quick: docker-deploy ## Quick deployment (alias for docker-deploy)
```

## Package.json Scripts (cho Node.js tools)
```json
{
  "name": "fineract-tools",
  "scripts": {
    "deploy": "docker-compose up -d",
    "health": "curl -k https://localhost:8443/fineract-provider/actuator/health",
    "logs": "docker logs fineract-fineract-1 --tail=50",
    "clean": "docker-compose down -v",
    "build": "./gradlew bootJar -x test -x doc -x swagger",
    "dev": "docker-compose -f docker-compose.dev.yml up -d"
  }
}
```
