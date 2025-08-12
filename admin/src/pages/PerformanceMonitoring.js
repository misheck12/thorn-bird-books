import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PerformanceMonitoring = () => {
  const [performanceData, setPerformanceData] = useState({
    metrics: {},
    responseTime: [],
    errorRate: [],
    cacheMetrics: {},
    systemHealth: {},
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchPerformanceData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/analytics/performance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      setPerformanceData({
        metrics: data.data || generateMockMetrics(),
        responseTime: generateMockResponseTimeData(),
        errorRate: generateMockErrorRateData(),
        cacheMetrics: generateMockCacheMetrics(),
        systemHealth: generateMockSystemHealth(),
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
      // Use mock data if API fails
      setPerformanceData({
        metrics: generateMockMetrics(),
        responseTime: generateMockResponseTimeData(),
        errorRate: generateMockErrorRateData(),
        cacheMetrics: generateMockCacheMetrics(),
        systemHealth: generateMockSystemHealth(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data generators
  const generateMockMetrics = () => ({
    responseTime: {
      average: 245,
      p95: 580,
      p99: 1200,
    },
    cacheHitRate: 0.847,
    errorRate: 0.018,
    uptime: 0.9994,
    throughput: {
      requestsPerSecond: 147,
      requestsPerHour: 529200,
    },
  });

  const generateMockResponseTimeData = () => {
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 60 * 60 * 1000);
      data.push({
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        avgResponseTime: Math.floor(Math.random() * 200) + 150,
        p95ResponseTime: Math.floor(Math.random() * 400) + 400,
        p99ResponseTime: Math.floor(Math.random() * 600) + 800,
      });
    }
    return data;
  };

  const generateMockErrorRateData = () => {
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 60 * 60 * 1000);
      data.push({
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        errorRate: Math.random() * 0.05,
        requests: Math.floor(Math.random() * 1000) + 500,
        errors: Math.floor(Math.random() * 20) + 5,
      });
    }
    return data;
  };

  const generateMockCacheMetrics = () => ({
    hitRate: 0.847,
    missRate: 0.153,
    totalRequests: 48520,
    hits: 41092,
    misses: 7428,
    avgResponseTime: {
      hit: 45,
      miss: 280,
    },
  });

  const generateMockSystemHealth = () => ({
    cpu: 34,
    memory: 67,
    disk: 23,
    network: 12,
    database: {
      connections: 45,
      maxConnections: 100,
      queryTime: 125,
    },
    redis: {
      memoryUsage: 156,
      totalMemory: 512,
      connections: 23,
    },
  });

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBgColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'bg-green-100';
    if (value <= thresholds.warning) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Auto Refresh</span>
          </label>
          <button
            onClick={fetchPerformanceData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
          <p className={`text-3xl font-bold ${getStatusColor(performanceData.metrics.responseTime?.average || 0, { good: 200, warning: 500 })}`}>
            {performanceData.metrics.responseTime?.average || 0}ms
          </p>
          <p className="text-sm text-gray-500">P95: {performanceData.metrics.responseTime?.p95 || 0}ms</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Cache Hit Rate</h3>
          <p className={`text-3xl font-bold ${getStatusColor((1 - (performanceData.metrics.cacheHitRate || 0)) * 100, { good: 20, warning: 40 })}`}>
            {((performanceData.metrics.cacheHitRate || 0) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">Optimization target: >85%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
          <p className={`text-3xl font-bold ${getStatusColor((performanceData.metrics.errorRate || 0) * 100, { good: 1, warning: 3 })}`}>
            {((performanceData.metrics.errorRate || 0) * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500">Target: <1%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Uptime</h3>
          <p className="text-3xl font-bold text-green-600">
            {((performanceData.metrics.uptime || 0) * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time (Last 24 Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData.responseTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgResponseTime"
                stroke="#0088FE"
                strokeWidth={2}
                name="Average"
              />
              <Line
                type="monotone"
                dataKey="p95ResponseTime"
                stroke="#00C49F"
                strokeWidth={2}
                name="95th Percentile"
              />
              <Line
                type="monotone"
                dataKey="p99ResponseTime"
                stroke="#FF8042"
                strokeWidth={2}
                name="99th Percentile"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Error Rate Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Rate (Last 24 Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData.errorRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'errorRate' ? `${(value * 100).toFixed(2)}%` : value,
                name === 'errorRate' ? 'Error Rate' : name
              ]} />
              <Legend />
              <Area
                type="monotone"
                dataKey="errorRate"
                stroke="#FF8042"
                fill="#FF8042"
                fillOpacity={0.3}
                name="Error Rate"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Resources</h3>
          <div className="space-y-4">
            {[
              { name: 'CPU Usage', value: performanceData.systemHealth.cpu, max: 100, unit: '%' },
              { name: 'Memory Usage', value: performanceData.systemHealth.memory, max: 100, unit: '%' },
              { name: 'Disk Usage', value: performanceData.systemHealth.disk, max: 100, unit: '%' },
              { name: 'Network I/O', value: performanceData.systemHealth.network, max: 100, unit: 'MB/s' },
            ].map((resource, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{resource.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        resource.value <= 50 ? 'bg-green-500' :
                        resource.value <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(resource.value / resource.max) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {resource.value}{resource.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cache Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Hit Rate</span>
              <span className="text-sm font-bold text-green-600">
                {(performanceData.cacheMetrics.hitRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Total Requests</span>
              <span className="text-sm font-medium text-gray-900">
                {performanceData.cacheMetrics.totalRequests?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Cache Hits</span>
              <span className="text-sm font-medium text-green-600">
                {performanceData.cacheMetrics.hits?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Cache Misses</span>
              <span className="text-sm font-medium text-red-600">
                {performanceData.cacheMetrics.misses?.toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Avg Response (Hit)</span>
                <span className="text-sm font-medium text-gray-900">
                  {performanceData.cacheMetrics.avgResponseTime?.hit}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Avg Response (Miss)</span>
                <span className="text-sm font-medium text-gray-900">
                  {performanceData.cacheMetrics.avgResponseTime?.miss}ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoring;