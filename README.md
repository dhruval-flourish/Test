# Spire API Server - Vercel Deployment

A simple serverless API that connects to Spire ERP system.

## Endpoints

- `GET /` - Health check
- `GET /api/employee` - Get employees (with optional `?limit=50`)

## Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Or connect your GitHub repo to Vercel for automatic deployments

## Local Development

```bash
npm install
vercel dev
```

## Environment Variables

The API credentials are currently hardcoded. For production, consider using Vercel environment variables:

- `SPIRE_USERNAME`
- `SPIRE_PASSWORD` 
- `SPIRE_COMPANY`
- `SPIRE_BASE_URL`
