import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    pageViews: [],
    userActions: [],
    topPages: [],
    realTime: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      // Fetch overview data
      const overviewResponse = await fetch(
        `/api/analytics/overview?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const overviewData = await overviewResponse.json();

      // Fetch real-time data
      const realTimeResponse = await fetch('/api/analytics/realtime', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const realTimeData = await realTimeResponse.json();

      setAnalyticsData({
        overview: overviewData.data || {},
        pageViews: generateMockPageViewsData(),
        userActions: generateMockUserActionsData(),
        topPages: generateMockTopPagesData(),
        realTime: realTimeData.data || {},
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use mock data if API fails
      setAnalyticsData({
        overview: generateMockOverviewData(),
        pageViews: generateMockPageViewsData(),
        userActions: generateMockUserActionsData(),
        topPages: generateMockTopPagesData(),
        realTime: generateMockRealTimeData(),
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data generators (for demonstration)
  const generateMockOverviewData = () => ({
    totalPageViews: 15420,
    totalUsers: 3240,
    totalSessions: 5180,
    avgSessionDuration: 245,
    bounceRate: 0.32,
    conversionRate: 0.034,
  });

  const generateMockPageViewsData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        pageViews: Math.floor(Math.random() * 500) + 300,
        users: Math.floor(Math.random() * 200) + 100,
        sessions: Math.floor(Math.random() * 300) + 150,
      });
    }
    return data;
  };

  const generateMockUserActionsData = () => [
    { action: 'Book View', count: 2840, percentage: 35 },
    { action: 'Add to Cart', count: 960, percentage: 12 },
    { action: 'Search', count: 1420, percentage: 17.5 },
    { action: 'Event Register', count: 680, percentage: 8.5 },
    { action: 'Profile View', count: 520, percentage: 6.5 },
    { action: 'Contact', count: 320, percentage: 4 },
    { action: 'Other', count: 1340, percentage: 16.5 },
  ];

  const generateMockTopPagesData = () => [
    { page: '/books', views: 4520, bounce: 0.28 },
    { page: '/', views: 3840, bounce: 0.35 },
    { page: '/events', views: 2160, bounce: 0.42 },
    { page: '/books/fiction', views: 1890, bounce: 0.31 },
    { page: '/books/bestsellers', views: 1650, bounce: 0.29 },
  ];

  const generateMockRealTimeData = () => ({
    activeUsers: 47,
    currentPageViews: 125,
    topActivePages: [
      { page: '/books', users: 18 },
      { page: '/', users: 12 },
      { page: '/events', users: 8 },
    ],
  });

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num) => `${(num * 100).toFixed(1)}%`;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

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
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                dateRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Page Views</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatNumber(analyticsData.overview.totalPageViews || 0)}
          </p>
          <p className="text-sm text-green-600">+12.3% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatNumber(analyticsData.overview.totalUsers || 0)}
          </p>
          <p className="text-sm text-green-600">+8.7% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatPercentage(analyticsData.overview.conversionRate || 0)}
          </p>
          <p className="text-sm text-red-600">-2.1% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-3xl font-bold text-gray-900">
            {analyticsData.realTime.activeUsers || 0}
          </p>
          <p className="text-sm text-gray-500">Currently online</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Views Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.pageViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="pageViews"
                stackId="1"
                stroke="#0088FE"
                fill="#0088FE"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="users"
                stackId="2"
                stroke="#00C49F"
                fill="#00C49F"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Actions Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Actions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.userActions}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.userActions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{page.page}</p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(page.views)} views • {formatPercentage(page.bounce)} bounce rate
                  </p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(page.views / Math.max(...analyticsData.topPages.map(p => p.views))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-lg font-semibold text-green-600">
                {analyticsData.realTime.activeUsers || 0}
              </span>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Top Active Pages</h4>
              {(analyticsData.realTime.topActivePages || []).map((page, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{page.page}</span>
                  <span className="font-medium">{page.users} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;