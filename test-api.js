/**
 * Quick API Test Script
 * Run: node test-api.js
 */

const API_URL = 'https://store-backend-nine-opal.vercel.app';

const testData = {
  email: 'test@example.com',
  mobile: '1234567890',
  firstName: 'Test',
  lastName: 'User',
  moveInDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
};

async function testEndpoint(endpoint, name) {
  console.log(`\n🧪 Testing ${name}...`);
  console.log(`📍 Endpoint: ${API_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ SUCCESS:', data.message);
      console.log('📦 Data:', JSON.stringify(data.data, null, 2));
    } else {
      console.log('❌ FAILED:', data.message);
      console.log('📦 Response:', JSON.stringify(data, null, 2));
    }
    
    return { success: response.ok, data };
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  console.log(`📍 Endpoint: ${API_URL}/`);
  
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API is healthy!');
      console.log('📦 Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API health check failed');
    }
  } catch (error) {
    console.log('❌ Cannot reach API:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Tests...');
  console.log('=' .repeat(50));
  
  // Test health check first
  await testHealthCheck();
  
  // Test all endpoints
  const endpoints = [
    { path: '/api/reservations', name: "10'x10' Reservation" },
    { path: '/api/tent', name: "10'x20' Tent Reservation" },
    { path: '/api/un1', name: 'Unit 1 Reservation' },
    { path: '/api/un2', name: 'Unit 2 Reservation' },
    { path: '/api/un3', name: 'Unit 3 Reservation' },
    { path: '/api/un4', name: 'Unit 4 Reservation' },
    { path: '/api/un5', name: 'Unit 5 Reservation' }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.path, endpoint.name);
    results.push({ ...endpoint, ...result });
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.data?.message || r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above.');
    console.log('💡 Tip: Check TROUBLESHOOTING.md for solutions');
  }
}

// Run tests
runAllTests().catch(console.error);
