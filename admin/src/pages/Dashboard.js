import React from 'react';

const Dashboard = () => {
  // Sample stats data
  const stats = [
    { name: 'Total Books', value: '1,234', change: '+10%', changeType: 'increase' },
    { name: 'Active Orders', value: '56', change: '+5%', changeType: 'increase' },
    { name: 'Upcoming Events', value: '8', change: '+2', changeType: 'increase' },
    { name: 'Pending Submissions', value: '23', change: '-3%', changeType: 'decrease' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$24.99', status: 'Processing' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '$45.98', status: 'Shipped' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: '$19.99', status: 'Delivered' },
  ];

  const recentSubmissions = [
    { title: 'The Digital Nomad', author: 'Sarah Wilson', status: 'Under Review' },
    { title: 'Mountain Echoes', author: 'David Park', status: 'Requested Changes' },
    { title: 'Urban Stories', author: 'Lisa Chen', status: 'Accepted' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Thorn Bird Books admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="admin-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.amount}</p>
                  <p className="text-sm text-gray-600">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="admin-btn admin-btn-primary">View All Orders</button>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="admin-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Submissions</h2>
          <div className="space-y-3">
            {recentSubmissions.map((submission, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{submission.title}</p>
                  <p className="text-sm text-gray-600">{submission.author}</p>
                </div>
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    submission.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    submission.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="admin-btn admin-btn-primary">View All Submissions</button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="admin-card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="admin-btn admin-btn-primary">Add New Book</button>
            <button className="admin-btn admin-btn-primary">Create Event</button>
            <button className="admin-btn admin-btn-primary">New Article</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;