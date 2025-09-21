# CodeJira - ITIL & CMDB Integration Platform

Một platform tích hợp ITIL và CMDB với Jira, hỗ trợ quản lý incident, change management, và monitoring.

## 🚀 Tính năng chính

- **ITIL Dashboard**: Quản lý incident, problem, change requests
- **CMDB Integration**: Tích hợp Configuration Management Database
- **Jira Sync**: Đồng bộ hai chiều với Jira
- **SLA Management**: Theo dõi và quản lý SLA
- **CI/CD Topology**: Hiển thị topology map của CI/CD pipeline
- **Real-time Monitoring**: Tích hợp với các hệ thống monitoring

## 🛠 Tech Stack

### Frontend
- **React 18** với TypeScript
- **Vite** cho build tool
- **Tailwind CSS** cho styling
- **Radix UI** cho component library
- **Framer Motion** cho animations
- **React Query** cho data fetching
- **Wouter** cho routing

### Backend
- **Node.js** với Express
- **TypeScript** 
- **Drizzle ORM** với PostgreSQL
- **WebSocket** cho real-time updates
- **Passport.js** cho authentication

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 20+
- PostgreSQL
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd codejira
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình database
```bash
# Tạo file .env với database connection
echo "DATABASE_URL=postgresql://user:password@localhost:5432/codejira" > .env

# Push schema lên database
npm run db:push
```

## 🚀 Development

### Chạy toàn bộ application (Full-stack)
```bash
npm run dev
```
Truy cập: http://localhost:5000

### Chạy riêng biệt (Development nâng cao)

#### Chỉ chạy server
```bash
npm run dev:server
```
Server sẽ chạy trên port 5000

#### Chỉ chạy client
```bash
npm run dev:client
```
Client sẽ chạy trên port 3000

### Database Operations
```bash
# Generate migrations
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate
```

### Type Checking
```bash
npm run check
# hoặc
npm run lint
```

## 🏗 Build & Production

### Build toàn bộ project
```bash
npm run build
```

### Build riêng biệt
```bash
# Build client only
npm run build:client

# Build server only  
npm run build:server
```

### Chạy production
```bash
npm start
```

## 📁 Cấu trúc thư mục

```
codejira/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities & config
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── index.html
├── server/                # Backend Express app
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database models
│   └── vite.ts           # Vite integration
├── shared/               # Shared types & schemas
│   └── schema.ts
├── attached_assets/      # Jira plugin assets
└── dist/                # Build output
```

## 🔧 Cấu hình

### Vite Configuration
File `vite.config.ts` đã được cấu hình với:
- React plugin
- Path aliases (@, @shared, @assets)
- Development server trên port 5000
- Build output vào `dist/public`

### TypeScript
- Strict mode enabled
- Path mapping cho aliases
- ES2022 target

### Tailwind CSS
- Configured với Radix UI
- Custom animations
- Typography plugin

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/user` - Lấy thông tin user

### ITIL Operations
- `GET /api/itil/incidents` - Lấy danh sách incidents
- `POST /api/itil/incidents` - Tạo incident mới
- `PUT /api/itil/incidents/:id` - Cập nhật incident
- `GET /api/itil/changes` - Lấy danh sách change requests

### CMDB
- `GET /api/cmdb/items` - Lấy configuration items
- `POST /api/cmdb/items` - Tạo CI mới
- `GET /api/cmdb/topology` - Lấy topology map

### Jira Integration
- `POST /api/jira/sync` - Đồng bộ với Jira
- `GET /api/jira/issues` - Lấy Jira issues
- `POST /api/jira/webhook` - Webhook từ Jira

## 🐛 Debugging

### Development Tools
- React DevTools
- Redux DevTools (nếu sử dụng)
- Network tab để debug API calls
- Console logs đã được setup trong server

### Common Issues
1. **Port conflicts**: Đảm bảo port 5000 không bị sử dụng
2. **Database connection**: Kiểm tra DATABASE_URL trong .env
3. **TypeScript errors**: Chạy `npm run check` để kiểm tra

## 📝 Contributing

1. Tạo branch mới từ `main`
2. Implement features/fixes
3. Run tests: `npm run check`
4. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Support
Duongnv

