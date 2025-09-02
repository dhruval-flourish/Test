const axios = require('axios');

// Spire API configuration - using environment variables
const BASE_URL = process.env.SPIRE_BASE_URL || 'https://blue-decimal-2893.spirelan.com:10880/api/v2';
const COMPANY = process.env.SPIRE_COMPANY || 'inspirehealth';
const USERNAME = process.env.SPIRE_USERNAME || 'Dhruval';
const PASSWORD = process.env.SPIRE_PASSWORD || 'Dhruval@3006';
const AUTH_TOKEN = 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

// Spire API request function
async function makeSpireRequest(endpoint) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log('Spire API Request:', url);
    const response = await axios.get(url, {
      headers: {
        'Authorization': AUTH_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    console.error('Spire API Error:', error.message);
    throw new Error(`Spire API Error: ${error.message}`);
  }
}

// Vercel serverless function
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get the path from the request
    const path = req.url || '/';

    // Health check - root path
    if (path === '/' || path === '/api') {
      return res.status(200).json({
        message: 'Spire API Server is running!',
        status: 'success',
        endpoints: {
          health: '/',
          employees: '/api/employee',
          test: '/api/test'
        },
        config: {
          baseUrl: BASE_URL,
          company: COMPANY,
          connected: true
        }
      });
    }

    // Test endpoint - no external calls
    if (path === '/api/test') {
      return res.status(200).json({
        message: 'Test endpoint working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }

    // Get employees
    if (path === '/api/employee' || path.startsWith('/api/employee')) {
      const limit = req.query?.limit || 50;
      const data = await makeSpireRequest(`/companies/${COMPANY}/payroll/employees?limit=${limit}`);
      return res.status(200).json(data);
    }

    // 404 for unknown routes
    return res.status(404).json({ 
      error: 'Endpoint not found',
      available: ['/', '/api/employee', '/api/test'],
      requested: path
    });

  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ 
      error: error.message,
      note: 'This might be a network connectivity issue with the Spire server',
      solutions: [
        'Check if the Spire server is accessible from Vercel',
        'Use environment variables to configure different server URLs',
        'Consider using a VPN or proxy if this is an internal server'
      ]
    });
  }
};
