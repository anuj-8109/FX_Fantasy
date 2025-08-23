import React from "react";

const SuperAdminDashboard = () => {
  // Mocked data (later aap API se le sakte ho)
  const currentAppType = {
    id: "ecommerce",
    name: "Ecommerce",
    features: ["Product Management", "Order Tracking", "Customer Support"],
  };

  const adminUser = { name: "Shakti" };

  const stats = [
    { title: "Total Sales", value: "$45,231", change: "+20.1%", changeType: "positive" },
    { title: "Orders", value: "1,234", change: "+12.5%", changeType: "positive" },
    { title: "Customers", value: "8,642", change: "+8.2%", changeType: "positive" },
    { title: "Revenue", value: "$12,234", change: "+15.3%", changeType: "positive" },
  ];

  const activities = [
    { action: "User registration", time: "2 minutes ago", type: "success" },
    { action: "Database backup", time: "15 minutes ago", type: "info" },
    { action: "Security scan", time: "1 hour ago", type: "warning" },
    { action: "System update", time: "3 hours ago", type: "success" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {adminUser.name}! Here's what's happening with your{" "}
              {currentAppType.name.toLowerCase()}.
            </p>
          </div>
          <div className="px-3 py-1 border rounded-lg text-sm text-gray-600 mt-3 md:mt-0">
            Light Theme
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <div className="text-sm font-medium text-gray-600">{stat.title}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
              <p
                className={`text-xs mt-1 ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Features + Performance + Activity */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Features */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">
              {currentAppType.name} Features
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Key capabilities of your current application type
            </p>
            <div className="space-y-2">
              {currentAppType.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{feature}</span>
                  <span className="px-2 py-0.5 text-xs rounded-lg bg-gray-100 text-gray-700">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">System Performance</h2>
            <p className="text-sm text-gray-500 mb-4">
              Current system health and performance metrics
            </p>
            {[
              { label: "CPU Usage", value: 67 },
              { label: "Memory Usage", value: 84 },
              { label: "Storage", value: 45 },
            ].map((metric, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{metric.label}</span>
                  <span>{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <p className="text-sm text-gray-500 mb-4">
              Latest system events and user actions
            </p>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <span>{activity.action}</span>
                  </div>
                  <span className="text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <p className="text-sm text-gray-500 mb-4">
            Frequently used actions for {currentAppType.name.toLowerCase()} management
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {currentAppType.features.map((feature, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="font-medium text-sm">{feature}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Manage {feature.toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
