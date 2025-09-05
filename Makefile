# Apache Fineract Deployment Makefile
# Usage: make <target>
# Example: make docker-deploy

.PHONY: help docker-deploy jar-build dev-setup clean health logs quick

help: ## Show available commands
	@echo "🚀 Apache Fineract Deployment Commands"
	@echo "======================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

docker-deploy: ## Deploy with Docker Compose (Recommended)
	@echo "🚀 Deploying Fineract with Docker Compose..."
	docker-compose down 2>/dev/null || true
	docker-compose up -d
	@echo "⏳ Waiting for startup (30s)..."
	@sleep 30
	@make health

jar-build: ## Build and run JAR manually
	@echo "🔨 Building Fineract JAR..."
	./gradlew clean bootJar -x test -x doc -x swagger -x integrationTest --no-daemon
	@echo "📥 Ensuring JDBC driver is available..."
	@curl -L -o mariadb-java-client-3.5.2.jar https://repo1.maven.org/maven2/org/mariadb/jdbc/mariadb-java-client/3.5.2/mariadb-java-client-3.5.2.jar 2>/dev/null || echo "JDBC driver download failed, continuing..."
	@echo "🗄️ Starting database..."
	docker run --name fineract-mariadb -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysql -e MYSQL_DATABASE=fineract_tenants -e MYSQL_USER=fineract -e MYSQL_PASSWORD=fineract mariadb:11.4 2>/dev/null || echo "Database already running"
	@echo "⏳ Waiting for database (20s)..."
	@sleep 20
	@echo "🚀 Starting Fineract application..."
	java -Dloader.path=. -jar fineract-provider/build/libs/*SNAPSHOT.jar

dev-setup: ## Setup development environment
	@echo "🛠️ Setting up development environment..."
	docker run --name fineract-mariadb -d -p 3306:3306 \
		-e MYSQL_ROOT_PASSWORD=mysql \
		-e MYSQL_DATABASE=fineract_tenants \
		-e MYSQL_USER=fineract \
		-e MYSQL_PASSWORD=fineract \
		mariadb:11.4 2>/dev/null || echo "Development database already exists"
	@echo "✅ Development MariaDB started on port 3306"
	@echo "   Connection: mysql://fineract:fineract@localhost:3306/fineract_tenants"

clean: ## Clean up containers, images and builds  
	@echo "🧹 Cleaning up..."
	docker-compose down -v --remove-orphans 2>/dev/null || true
	docker rm -f fineract-mariadb 2>/dev/null || true
	docker system prune -f 2>/dev/null || true
	./gradlew clean 2>/dev/null || true
	@echo "✅ Cleanup completed"

health: ## Check application health status
	@echo "🔍 Checking Fineract health..."
	@curl -k -s https://localhost:8443/fineract-provider/actuator/health | grep -q '"status":"UP"' && echo "✅ Fineract is healthy" || echo "❌ Fineract is not responding"
	@echo "🌐 Available endpoints:"
	@echo "   - API: https://localhost:8443/fineract-provider/api/v1"
	@echo "   - Health: https://localhost:8443/fineract-provider/actuator/health"
	@echo "   - Info: https://localhost:8443/fineract-provider/actuator/info"

logs: ## Show application logs (last 50 lines)
	@echo "📋 Showing Fineract logs..."
	docker logs fineract-fineract-1 --tail=50 2>/dev/null || docker logs fineract_fineract_1 --tail=50 2>/dev/null || echo "❌ Fineract container not found"

logs-db: ## Show database logs
	@echo "📋 Showing database logs..."
	docker logs fineract-db-1 --tail=30 2>/dev/null || docker logs fineract_db_1 --tail=30 2>/dev/null || docker logs fineract-mariadb --tail=30 2>/dev/null || echo "❌ Database container not found"

stop: ## Stop all running containers
	@echo "🛑 Stopping Fineract services..."
	docker-compose down 2>/dev/null || true
	docker stop fineract-mariadb 2>/dev/null || true
	@echo "✅ Services stopped"

restart: ## Restart all services
	@echo "🔄 Restarting Fineract services..."
	@make stop
	@sleep 5
	@make docker-deploy

quick: docker-deploy ## Quick deployment (alias for docker-deploy)

status: ## Show container status
	@echo "🐳 Container Status:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(fineract|mariadb)" || echo "No Fineract containers running"

# Windows PowerShell commands
ps-deploy: ## Deploy using PowerShell script (Windows)
	@echo "🚀 Running PowerShell deployment script..."
	powershell -ExecutionPolicy Bypass -File scripts/deploy-docker.ps1

ps-health: ## Health check using PowerShell script (Windows)  
	@echo "🔍 Running PowerShell health check..."
	powershell -ExecutionPolicy Bypass -File scripts/health-check.ps1
