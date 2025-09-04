const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Spire API configuration - using environment variables
const BASE_URL = process.env.SPIRE_BASE_URL || 'http://192.168.113.2:10880/api/v2';
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

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Spire API Server is running on EC2!',
    status: 'success',
    endpoints: {
      health: '/',
      employees: '/api/employee',
      jobs: '/api/jobs',
      accounts: '/api/accounts',
      test: '/api/test'
    },
    config: {
      baseUrl: BASE_URL,
      company: COMPANY,
      connected: true
    }
  });
});

// Test endpoint - no external calls
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    platform: 'EC2'
  });
});

// Get employees
app.get('/api/employee', async (req, res) => {
  try {
    const limit = req.query?.limit || 50;
    const data = await makeSpireRequest(`/companies/${COMPANY}/payroll/employees?limit=${limit}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      note: 'Network connectivity issue with Spire server',
      solutions: [
        'Check if the Spire server is accessible from Railway',
        'Use environment variables to configure different server URLs',
        'Consider using a VPN or proxy if this is an internal server'
      ]
    });
  }
});

// Get jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const limit = req.query?.limit || 50;
    const data = await makeSpireRequest(`/companies/${COMPANY}/job_costing/jobs?limit=${limit}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job costing accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const limit = req.query?.limit || 50;
    const data = await makeSpireRequest(`/companies/${COMPANY}/job_costing/accounts?limit=${limit}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Spire API Server running on EC2 - Port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET / - Health check`);
  console.log(`   GET /api/test - Test endpoint`);
  console.log(`   GET /api/employee - Get employees`);
  console.log(`   GET /api/jobs - Get jobs`);
  console.log(`   GET /api/accounts - Get job costing accounts`);
});
