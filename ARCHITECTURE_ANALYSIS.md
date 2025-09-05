# Apache Fineract - Phân Tích Cấu Trúc Module và Architecture

## 🏗️ Tổng Quan Architecture

Apache Fineract được thiết kế theo **microservice architecture** với modular design, chia thành các modules chuyên biệt để dễ dàng maintain, scale và extend.

---

## 📊 Thông Tin Database Hiện Tại

### 🗄️ Database Configuration:
- **Database Engine**: MariaDB 11.4.8
- **Host**: mariadb container (Docker)
- **Port**: 3306
- **Root Password**: `skdcnwauicn2ucnaecasdsajdnizucawencascdca`

### 📋 Database Schema:
```sql
-- Tenant Management Database
fineract_tenants (5 tables):
├── DATABASECHANGELOG
├── DATABASECHANGELOGLOCK  
├── tenant_server_connections
├── tenants
└── timezones

-- Default Tenant Database
fineract_default (260 tables):
└── [Core business logic tables]
```

### 👥 Tenant Information:
- **Default Tenant**: `default` (Demo Tenant)
- **Timezone**: Asia/Kolkata
- **Connection**: Managed through tenant_server_connections table

---

## 🏗️ Core Architecture Modules

### 1. **fineract-core** 📱
**Mục đích**: Foundation layer - Chứa các core utilities, base classes và shared components
```
Chức năng:
- Abstract base classes (AbstractPersistableCustom)
- Core utilities và helpers
- Common domain objects
- Infrastructure support
- EntityTables và domain mappings
```

### 2. **fineract-provider** 🔥
**Mục đích**: Main application module - Spring Boot executable
```
Chức năng:
- ServerApplication (main class)
- REST API controllers
- Service layer implementation  
- Spring Boot configuration
- API documentation (Swagger)
- Main business logic orchestration
Artifacts: fineract-provider-1.13.1-SNAPSHOT.jar (228MB)
```

### 3. **fineract-validation** ✅
**Mục đích**: Data validation layer
```
Chức năng:
- Input validation rules
- Business rule validation
- Data integrity checks
- Custom validators
```

### 4. **fineract-command** ⚡
**Mục đích**: Command handling và business operations
```
Chức năng:
- Command pattern implementation
- Business operation handlers
- Transaction management
- Command processing pipeline
```

---

## 💰 Business Domain Modules

### 5. **fineract-loan** 💳
**Mục đích**: Loan management - Core business module
```
Entities:
- Loan (main loan entity)
- LoanCharge (fees, penalties)
- LoanSummary (loan statistics)
- LoanRepaymentSchedule
- LoanInstallmentCharge

Chức năng:
- Loan application processing
- Repayment schedule generation
- Interest calculation
- Charge management (fees, penalties)
- Loan lifecycle management
- Progressive loan features
```

### 6. **fineract-savings** 💰
**Mục đích**: Savings account management
```
Chức năng:
- Savings account operations
- Deposit management
- Withdrawal processing
- Interest calculation
- Account balance management
```

### 7. **fineract-charge** 💸
**Mục đích**: Charge and fee management system
```
Chức năng:
- Fee structure definition
- Penalty calculations
- Charge application logic
- Payment mode handling
- Charge calculation types
```

### 8. **fineract-tax** 🧾
**Mục đích**: Tax calculation và compliance
```
Chức năng:
- Tax rate management
- Tax calculation engines
- Compliance reporting
- Tax deduction logic
```

### 9. **fineract-rates** 📈
**Mục đích**: Interest rate management
```
Chức năng:
- Interest rate definitions
- Rate calculation logic
- Variable rate management
- Rate application rules
```

---

## 🏢 Organizational Modules

### 10. **fineract-accounting** 📚
**Mục đích**: Accounting và financial reporting
```
Chức năng:
- Chart of accounts
- Journal entry management
- Financial reporting
- Accounting rules
- Double-entry bookkeeping
```

### 11. **fineract-branch** 🏪
**Mục đích**: Branch and office management
```
Chức năng:
- Branch hierarchy
- Office management
- Staff assignment
- Geographic organization
```

### 12. **fineract-investor** 👥
**Mục đích**: Investor management
```
Chức năng:
- Investor onboarding
- Investment tracking
- Portfolio management
- Investor reporting
```

---

## 📄 Document & Communication Modules

### 13. **fineract-document** 📋
**Mục đích**: Document management system
```
Chức năng:
- File upload/download
- Document storage
- Document versioning
- File type management
```

### 14. **fineract-report** 📊
**Mục đích**: Reporting engine
```
Chức năng:
- Report generation
- Custom report builder
- Data export capabilities
- Scheduled reports
```

### 15. **fineract-avro-schemas** 🔄
**Mục đích**: Event schema definitions for messaging
```
Chức năng:
- Avro schema definitions
- Message serialization
- Event structure definition
- Inter-service communication
```

---

## 🔄 Processing & Background Jobs

### 16. **fineract-cob** 🌙
**Mục đích**: Close of Business (COB) batch processing
```
Chức năng:
- End-of-day processing
- Batch job orchestration
- Account reconciliation
- Interest posting
- Automated calculations
```

### 17. **fineract-progressive-loan** 🔄
**Mục đích**: Advanced loan processing
```
Chức năng:
- Progressive loan features
- Advanced repayment schedules
- Complex loan calculations
- Schedule generation
```

### 18. **fineract-progressive-loan-embeddable-schedule-generator** 📅
**Mục đích**: Embedded schedule generation utility
```
Chức năng:
- Standalone schedule generation
- Embeddable calculation engine
- Reusable schedule logic
```

---

## 🔗 Integration & Client Modules

### 19. **fineract-client** 🔌
**Mục đích**: Client SDK generation
```
Chức năng:
- Auto-generated API clients
- SDK for multiple languages
- API wrapper libraries
- Client code generation
```

### 20. **fineract-war** 🌐
**Mục đích**: Traditional WAR deployment
```
Chức năng:
- WAR file generation
- Servlet container deployment
- Legacy deployment support
```

---

## 📖 Documentation & Development

### 21. **fineract-doc** 📚
**Mục đích**: Documentation generation
```
Chức năng:
- AsciiDoc documentation
- API documentation
- User guides
- Technical documentation
```

### 22. **buildSrc** 🔧
**Mục đích**: Build logic và custom Gradle plugins
```
Chức năng:
- Custom build logic
- Shared build configurations
- Gradle plugins
- Build utilities
```

---

## 🧪 Testing Modules

### 23. **integration-tests** 🧪
**Mục đích**: Integration testing suite
```
Chức năng:
- End-to-end testing
- API integration tests
- Database integration tests
- Cross-module testing
```

### 24. **fineract-e2e-tests-core** 🎯
**Mục đích**: E2E testing framework core
```
Chức năng:
- Testing framework foundation
- Test utilities
- Common test logic
```

### 25. **fineract-e2e-tests-runner** 🏃
**Mục đích**: E2E test execution engine
```
Chức năng:
- Test execution orchestration
- Test result reporting
- Test environment management
```

### 26. **twofactor-tests** 🔐
**Mục đích**: Two-factor authentication testing
```
Chức năng:
- 2FA testing scenarios
- Security testing
- Authentication flow tests
```

### 27. **oauth2-tests** 🔑
**Mục đích**: OAuth2 authentication testing
```
Chức năng:
- OAuth2 flow testing
- Token validation tests
- Security integration tests
```

---

## 🎛️ Configuration & Deployment

### 28. **custom** 🔧
**Mục đích**: Custom implementations và extensions
```
Structure:
custom/
├── acme/          # Example company customization
├── docker/        # Custom Docker configurations
└── [company]/     # Company-specific customizations
    └── [category]/    # Feature category
        └── [module]/  # Custom module
```

### 29. **config** ⚙️
**Mục đích**: Configuration files
```
Structure:
config/
├── checkstyle/           # Code quality rules
├── docker/              # Docker configurations
│   ├── compose/         # Docker Compose files
│   ├── env/            # Environment variables
│   └── mysql/          # Database configs
└── spotbugs/           # Static analysis configs
```

---

## 🚀 Module Dependencies và Relationships

### **Dependency Hierarchy:**
```
fineract-provider (main)
├── fineract-core (foundation)
├── fineract-validation
├── fineract-command
├── fineract-loan (business core)
├── fineract-savings (business core)
├── fineract-accounting
├── fineract-charge
├── fineract-tax
├── fineract-rates
├── fineract-branch
├── fineract-investor
├── fineract-document
├── fineract-report
├── fineract-cob
├── fineract-progressive-loan
├── fineract-avro-schemas
└── fineract-client
```

### **Inter-Module Communication:**
1. **Events**: Via Avro schemas for async communication
2. **Direct Dependencies**: Compile-time dependencies
3. **Database**: Shared database access patterns
4. **APIs**: REST API endpoints in fineract-provider

---

## 🎯 Key Design Principles

### **1. Separation of Concerns**
- Business logic separated by domain (loan, savings, etc.)
- Infrastructure concerns isolated (validation, command, etc.)
- Clear boundaries between modules

### **2. Domain-Driven Design (DDD)**
- Each module represents a bounded context
- Rich domain models (Loan, Charge, Account, etc.)
- Business rules encapsulated in domain objects

### **3. Event-Driven Architecture**
- Asynchronous processing via events
- COB processing for batch operations
- Message-driven communication

### **4. Extensibility**
- Custom module support
- Plugin architecture
- Configuration-driven behavior

---

## 💡 Development Recommendations

### **For New Features:**
1. **Identify Domain**: Choose appropriate module (loan, savings, etc.)
2. **Follow Patterns**: Use existing patterns from similar modules
3. **Add Tests**: Include integration tests
4. **Update Documentation**: Maintain API docs

### **For Customizations:**
1. **Use Custom Module**: Add to `custom/[company]/[category]/[module]`
2. **Extend Base Classes**: Leverage fineract-core foundations
3. **Follow Conventions**: Match existing code patterns
4. **Maintain Compatibility**: Ensure backward compatibility

---

*Phân tích này dựa trên cấu trúc Apache Fineract 1.13.1-SNAPSHOT hiện tại, với 28 modules chính và kiến trúc microservice modular.*
