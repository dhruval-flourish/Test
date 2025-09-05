const axios = require('axios');

// Simple configuration
const BASE_URL = 'https://431f77b5b0f6.ngrok-free.app/api/v2';
const COMPANY = 'inspirehealth'; // Replace with actual company

// Basic Auth credentials
const USERNAME = 'Dhruval';
const PASSWORD = 'Dhruval@3006';
const AUTH_TOKEN = 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

// Simple request function
async function makeRequest(endpoint) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log('Requesting:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': AUTH_TOKEN,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Success:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw error;
  }
}

// Test API v2 endpoints
async function testEndpoints() {
  console.log('🚀 Testing Spire API v2 endpoints on port 10880...\n');
  
  const endpoints = [
    `/companies/${COMPANY}/job_costing/jobs?limit=5`,
    `/companies/${COMPANY}/payroll/employees?limit=5`,
    `/companies/${COMPANY}/job_costing/accounts?limit=5`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n--- Testing ${endpoint} ---`);
      const data = await makeRequest(endpoint);
      console.log('Records found:', data.records?.length || 0);
      if (data.records && data.records.length > 0) {
        console.log('Sample record:', JSON.stringify(data.records[0], null, 2));
      }
    } catch (error) {
      console.log('Endpoint failed');
    }
  }
}

// Run the test
testEndpoints();
