# Spire API Server - EC2 Deployment

A production-ready API server that connects to Spire ERP system, deployed on AWS EC2.

## 🚀 Features

- **Express.js server** with CORS support
- **Docker containerization** for easy deployment
- **Environment variables** for configuration
- **Multiple endpoints** for Spire data
- **Health checks** and error handling
- **Production-ready** with security best practices

## 📋 Endpoints

- `GET /` - Health check
- `GET /api/test` - Test endpoint (no external calls)
- `GET /api/employee` - Get employees (with optional `?limit=50`)
- `GET /api/jobs` - Get jobs (with optional `?limit=50`)
- `GET /api/accounts` - Get job costing accounts (with optional `?limit=50`)

## 🛠️ EC2 Deployment

### Prerequisites

1. **EC2 Instance** with Ubuntu/Debian
2. **Docker** and **Docker Compose** installed
3. **Security Group** with port 3000 open

### 1. Install Docker on EC2

```bash
# Update package list
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
exit
```

### 2. Clone and Deploy

```bash
# Clone your repository
git clone <your-repo-url>
cd <your-repo-directory>

# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Manual Deployment (Alternative)

```bash
# Create .env file
cat > .env << EOF
SPIRE_BASE_URL=https://blue-decimal-2893.spirelan.com:10880/api/v2
SPIRE_COMPANY=inspirehealth
SPIRE_USERNAME=Dhruval
SPIRE_PASSWORD=Dhruval@3006
NODE_ENV=production
PORT=3000
EOF

# Build and start
docker-compose up -d
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
| `NODE_ENV` | Environment | `production` |

## 🐳 Docker Configuration

The application includes:

- **Dockerfile**: Multi-stage build with security best practices
- **docker-compose.yml**: Easy deployment with environment variables
- **Health checks**: Automatic health monitoring
- **Non-root user**: Security enhancement

### Docker Commands

```bash
# Build image
docker build -t spire-api .

# Run container
docker run -p 3000:3000 --env-file .env spire-api

# View logs
docker-compose logs -f

# Stop application
docker-compose down
```

## 📊 Monitoring

EC2 provides several monitoring options:

- **CloudWatch**: Monitor CPU, memory, and network usage
- **Docker logs**: View application logs
- **Health checks**: Automatic health monitoring
- **Auto-scaling**: Scale based on demand

## 🔒 Security

- **Non-root user**: Application runs as non-root user
- **Environment variables**: Sensitive data stored in environment variables
- **Health checks**: Automatic health monitoring
- **CORS**: Configured for cross-origin requests

## 🔄 Migration from Vercel/Railway

If migrating from Vercel or Railway:
1. Remove platform-specific files (`vercel.json`, `railway.toml`)
2. Set up EC2 instance with Docker
3. Configure environment variables
4. Deploy using `./deploy.sh`
5. Update any client applications to use the new EC2 URL
