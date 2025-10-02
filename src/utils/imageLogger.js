/**
 * Image Performance Logger
 * Tuân thủ theo hướng dẫn copilot-instructions.md
 */

class ImagePerformanceLogger {
  constructor() {
    this.stats = {
      totalRequests: 0,
      webpRequests: 0,
      originalRequests: 0,
      errors: 0,
      cacheHits: 0,
      averageLoadTime: 0,
      loadTimes: [],
    };
  }

  logImageRequest(type, url, loadTime, isCache = false) {
    this.stats.totalRequests++;
    
    if (type === 'webp') {
      this.stats.webpRequests++;
    } else {
      this.stats.originalRequests++;
    }
    
    if (isCache) {
      this.stats.cacheHits++;
    }
    
    if (loadTime) {
      this.stats.loadTimes.push(loadTime);
      this.stats.averageLoadTime = 
        this.stats.loadTimes.reduce((a, b) => a + b, 0) / this.stats.loadTimes.length;
    }
    
    console.log(`📊 Image ${type.toUpperCase()}: ${url.substring(0, 50)}... 
                 ⏱️ Load: ${loadTime}ms | Cache: ${isCache ? 'HIT' : 'MISS'}`);
  }

  logImageError(url, error) {
    this.stats.errors++;
    console.log(`❌ Image Error: ${url.substring(0, 50)}... Error: ${error}`);
  }

  getStats() {
    return {
      ...this.stats,
      webpRatio: this.stats.totalRequests > 0 ? 
        (this.stats.webpRequests / this.stats.totalRequests * 100).toFixed(1) : 0,
      cacheRatio: this.stats.totalRequests > 0 ? 
        (this.stats.cacheHits / this.stats.totalRequests * 100).toFixed(1) : 0,
      errorRate: this.stats.totalRequests > 0 ? 
        (this.stats.errors / this.stats.totalRequests * 100).toFixed(1) : 0,
    };
  }

  printSummary() {
    const stats = this.getStats();
    console.log('\n📊 === IMAGE PERFORMANCE SUMMARY ===');
    console.log(`📸 Total Requests: ${stats.totalRequests}`);
    console.log(`🔄 WebP Usage: ${stats.webpRatio}% (${stats.webpRequests}/${stats.totalRequests})`);
    console.log(`⚡ Cache Hits: ${stats.cacheRatio}% (${stats.cacheHits}/${stats.totalRequests})`);
    console.log(`❌ Error Rate: ${stats.errorRate}% (${stats.errors}/${stats.totalRequests})`);
    console.log(`⏱️ Avg Load Time: ${stats.averageLoadTime.toFixed(2)}ms`);
    console.log('=====================================\n');
  }

  reset() {
    this.stats = {
      totalRequests: 0,
      webpRequests: 0,
      originalRequests: 0,
      errors: 0,
      cacheHits: 0,
      averageLoadTime: 0,
      loadTimes: [],
    };
  }
}

// Export singleton instance
export const imageLogger = new ImagePerformanceLogger();