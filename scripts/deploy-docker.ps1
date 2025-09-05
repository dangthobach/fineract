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
