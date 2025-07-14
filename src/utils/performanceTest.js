// Performance Testing Tool
class PerformanceTest {
  constructor() {
    this.results = [];
    this.apiBaseUrl = 'http://127.0.0.1:8000/api';
  }

  // Test API response time
  async testAPI(endpoint, method = 'GET', data = null) {
    const startTime = performance.now();
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      return {
        endpoint,
        method,
        status: response.status,
        responseTime: Math.round(responseTime),
        success: response.ok
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        endpoint,
        method,
        status: 'ERROR',
        responseTime: Math.round(endTime - startTime),
        success: false,
        error: error.message
      };
    }
  }

  // Test page load time
  async testPageLoad(url) {
    const startTime = performance.now();
    try {
      // Simulate page navigation
      const response = await fetch(url);
      const endTime = performance.now();
      
      return {
        url,
        loadTime: Math.round(endTime - startTime),
        status: response.status,
        success: response.ok
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        url,
        loadTime: Math.round(endTime - startTime),
        status: 'ERROR',
        success: false,
        error: error.message
      };
    }
  }

  // Test multiple endpoints
  async runAPITests() {
    console.log('🚀 Starting API Performance Tests...\n');
    
    const endpoints = [
      { path: '/products', name: 'Products List' },
      { path: '/categories', name: 'Categories' },
      { path: '/brands', name: 'Brands' },
      { path: '/news', name: 'News' },
      { path: '/comments', name: 'Comments' },
      { path: '/vouchers/available', name: 'Available Vouchers' },
      { path: '/test', name: 'Health Check' }
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      const result = await this.testAPI(endpoint.path);
      result.name = endpoint.name;
      results.push(result);
      
      // Display result immediately
      const status = result.success ? '✅' : '❌';
      const time = result.responseTime;
      const rating = this.getRating(time);
      
      console.log(`${status} ${endpoint.name}: ${time}ms ${rating}`);
    }

    return results;
  }

  // Get performance rating
  getRating(responseTime) {
    if (responseTime < 100) return '🚀 Excellent';
    if (responseTime < 300) return '⚡ Good';
    if (responseTime < 500) return '⚠️ Average';
    if (responseTime < 1000) return '🐌 Slow';
    return '💀 Very Slow';
  }

  // Test resource loading
  async testResourceLoading() {
    console.log('\n📦 Testing Resource Loading...\n');
    
    const resources = [
      { url: 'http://localhost:5174/', name: 'Client App' },
      { url: 'http://localhost:5173/', name: 'Admin Panel' },
      { url: 'http://127.0.0.1:8000/api/test', name: 'Backend API' }
    ];

    const results = [];
    
    for (const resource of resources) {
      const result = await this.testPageLoad(resource.url);
      result.name = resource.name;
      results.push(result);
      
      const status = result.success ? '✅' : '❌';
      const time = result.loadTime;
      const rating = this.getRating(time);
      
      console.log(`${status} ${resource.name}: ${time}ms ${rating}`);
    }

    return results;
  }

  // Generate performance report
  generateReport(apiResults, resourceResults) {
    console.log('\n📊 PERFORMANCE REPORT\n');
    console.log('='.repeat(50));
    
    // API Performance Summary
    const apiTimes = apiResults.filter(r => r.success).map(r => r.responseTime);
    const avgApiTime = apiTimes.length > 0 ? Math.round(apiTimes.reduce((a, b) => a + b, 0) / apiTimes.length) : 0;
    const maxApiTime = apiTimes.length > 0 ? Math.max(...apiTimes) : 0;
    const minApiTime = apiTimes.length > 0 ? Math.min(...apiTimes) : 0;
    
    console.log('🔗 API Performance:');
    console.log(`   Average: ${avgApiTime}ms ${this.getRating(avgApiTime)}`);
    console.log(`   Fastest: ${minApiTime}ms`);
    console.log(`   Slowest: ${maxApiTime}ms`);
    console.log(`   Success Rate: ${apiResults.filter(r => r.success).length}/${apiResults.length}`);
    
    // Resource Loading Summary
    const resourceTimes = resourceResults.filter(r => r.success).map(r => r.loadTime);
    const avgResourceTime = resourceTimes.length > 0 ? Math.round(resourceTimes.reduce((a, b) => a + b, 0) / resourceTimes.length) : 0;
    
    console.log('\n🌐 Resource Loading:');
    console.log(`   Average: ${avgResourceTime}ms ${this.getRating(avgResourceTime)}`);
    console.log(`   Success Rate: ${resourceResults.filter(r => r.success).length}/${resourceResults.length}`);
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (avgApiTime > 500) {
      console.log('   ⚠️ API response time is slow. Consider:');
      console.log('      - Database query optimization');
      console.log('      - API response caching');
      console.log('      - Database indexing');
    }
    
    if (avgResourceTime > 1000) {
      console.log('   ⚠️ Page load time is slow. Consider:');
      console.log('      - Code splitting');
      console.log('      - Image optimization');
      console.log('      - Bundle size reduction');
    }
    
    if (avgApiTime < 200 && avgResourceTime < 800) {
      console.log('   🎉 Great performance! Your app is fast and responsive.');
    }
    
    console.log('\n='.repeat(50));
  }

  // Run all tests
  async runAllTests() {
    console.clear();
    console.log('🔍 WEBSITE PERFORMANCE TEST\n');
    console.log('Testing your E-commerce system...\n');
    
    const apiResults = await this.runAPITests();
    const resourceResults = await this.testResourceLoading();
    
    this.generateReport(apiResults, resourceResults);
    
    return {
      api: apiResults,
      resources: resourceResults,
      timestamp: new Date().toISOString()
    };
  }
}

// Export for use
window.PerformanceTest = PerformanceTest;

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  window.runPerformanceTest = async () => {
    const tester = new PerformanceTest();
    return await tester.runAllTests();
  };
  
  console.log('🔧 Performance Test Tool Loaded!');
  console.log('Run: runPerformanceTest() to start testing');
}

export default PerformanceTest;