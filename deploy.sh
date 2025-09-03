#!/bin/bash

# EC2 Deployment Script for Spire API Server
# This script helps deploy the application to an EC2 instance

set -e

echo "🚀 Starting EC2 deployment for Spire API Server..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cat > .env << EOF
# Spire API Configuration
SPIRE_BASE_URL=https://blue-decimal-2893.spirelan.com:10880/api/v2
SPIRE_COMPANY=inspirehealth
SPIRE_USERNAME=Dhruval
SPIRE_PASSWORD=Dhruval@3006

# Server Configuration
NODE_ENV=production
PORT=3000
EOF
    echo "✅ .env file created. Please update with your actual credentials."
fi

# Build and start the application
echo "🔨 Building Docker image..."
docker-compose build

echo "🚀 Starting the application..."
docker-compose up -d

echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "📋 Available endpoints:"
    echo "   GET http://localhost:3000/ - Health check"
    echo "   GET http://localhost:3000/api/test - Test endpoint"
    echo "   GET http://localhost:3000/api/employee - Get employees"
    echo "   GET http://localhost:3000/api/jobs - Get jobs"
    echo "   GET http://localhost:3000/api/accounts - Get job costing accounts"
else
    echo "❌ Application failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
