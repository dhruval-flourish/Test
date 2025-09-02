const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
    throw error;
  }
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Spire API Server is running!',
    endpoint: '/employee - Get employees'
  });
});

// Get employees
app.get('/employee', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const data = await makeSpireRequest(`/companies/${COMPANY}/payroll/employees?limit=${limit}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Spire API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET / - Health check`);
  console.log(`   GET /employee - Get employees`);
});
