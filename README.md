# Spire API Server - Railway Deployment

A production-ready API server that connects to Spire ERP system, deployed on Railway.

## 🚀 Features

- **Express.js server** with CORS support
- **Environment variables** for configuration
- **Docker deployment** on Railway
- **Multiple endpoints** for Spire data
- **Health checks** and error handling

## 📋 Endpoints

- `GET /` - Health check
- `GET /api/test` - Test endpoint (no external calls)
- `GET /api/employee` - Get employees (with optional `?limit=50`)
- `GET /api/jobs` - Get jobs (with optional `?limit=50`)
- `GET /api/accounts` - Get job costing accounts (with optional `?limit=50`)

## 🛠️ Railway Deployment

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Railway Project
```bash
railway init
```

### 4. Deploy
```bash
railway up
```

### 5. Set Environment Variables
```bash
railway variables set SPIRE_BASE_URL=https://blue-decimal-2893.spirelan.com:10880/api/v2
railway variables set SPIRE_COMPANY=inspirehealth
railway variables set SPIRE_USERNAME=Dhruval
railway variables set SPIRE_PASSWORD=Dhruval@3006
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run local server
npm start

# Run tests
npm test

# Development mode with auto-restart
npm run dev
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPIRE_BASE_URL` | Spire API base URL | `https://blue-decimal-2893.spirelan.com:10880/api/v2` |
| `SPIRE_COMPANY` | Company identifier | `inspirehealth` |
| `SPIRE_USERNAME` | API username | `Dhruval` |
| `SPIRE_PASSWORD` | API password | `Dhruval@3006` |
| `PORT` | Server port | `3000` |

## 🐳 Docker Support

The application includes a Dockerfile for containerized deployment:

```bash
# Build image
docker build -t spire-api .

# Run container
docker run -p 3000:3000 spire-api
```

## 📊 Monitoring

Railway provides built-in monitoring:
- **Logs**: View application logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Health Checks**: Automatic health monitoring
- **Restarts**: Automatic restart on failures
