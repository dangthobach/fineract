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
            if ($content.components) {
                foreach ($component in $content.components.PSObject.Properties) {
                    Write-Host "   $($component.Name): $($component.Value.status)" -ForegroundColor Gray
                }
            }
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
    $dbTest = docker exec fineract-db-1 mysqladmin -u root -pmysql ping 2>$null
    if ($dbTest -match "alive") {
        Write-Host "✅ Database: Connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Database: Not responding" -ForegroundColor Red
    }
} catch {
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
}

# Check system resources
Write-Host "`n💻 System Resources:" -ForegroundColor Cyan
try {
    $memory = Get-WmiObject -Class Win32_OperatingSystem
    $totalMem = [math]::Round($memory.TotalVisibleMemorySize/1MB, 2)
    $freeMem = [math]::Round($memory.FreePhysicalMemory/1MB, 2)
    Write-Host "   Memory: $freeMem GB free / $totalMem GB total" -ForegroundColor Gray
    
    $cpu = Get-WmiObject -Class Win32_Processor | Measure-Object -Property LoadPercentage -Average
    Write-Host "   CPU Usage: $($cpu.Average)%" -ForegroundColor Gray
} catch {
    Write-Host "   Resource info not available" -ForegroundColor Gray
}

Write-Host "`n📊 Health check completed!" -ForegroundColor Green
