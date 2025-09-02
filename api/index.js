const axios = require('axios');

// Spire API configuration
const BASE_URL = 'https://clean-invoice-3801.spirelan.com:10880/api/v2';
const COMPANY = 'inspirehealth';
const USERNAME = 'Dhruval';
const PASSWORD = 'Dhruval123$%^';
const AUTH_TOKEN = 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

// Spire API request function
async function makeSpireRequest(endpoint) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': AUTH_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    return response.data;
  } catch (error) {
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
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    // Health check
    if (pathname === '/' || pathname === '/api') {
      return res.status(200).json({
        message: 'Spire API Server is running!',
        endpoint: '/api/employee - Get employees'
      });
    }

    // Get employees
    if (pathname === '/api/employee') {
      const limit = req.query?.limit || 50;
      const data = await makeSpireRequest(`/companies/${COMPANY}/payroll/employees?limit=${limit}`);
      return res.status(200).json(data);
    }

    // 404 for unknown routes
    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
