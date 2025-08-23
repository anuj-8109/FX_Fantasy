import React from "react";

const Analytics = () => {
  const stats = [
    { title: "Total Revenue", value: "$45,230", change: "+12.5%", color: "text-green-600" },
    { title: "Active Users", value: "8,450", change: "+8.2%", color: "text-blue-600" },
    { title: "Contests Played", value: "1,234", change: "+15.3%", color: "text-purple-600" },
    { title: "Avg Session Time", value: "24m 30s", change: "+5.1%", color: "text-orange-600" },
  ];

  const contestTypeData = [
    { name: "Stock Trading", value: 40 },
    { name: "Crypto Trading", value: 30 },
    { name: "Forex Trading", value: 20 },
    { name: "Commodity Trading", value: 10 },
  ];

  const analyticsData = [
    { date: "2024-07-01", activeUsers: 1200, newUsers: 150, revenue: 2500, contestsPlayed: 45 },
    { date: "2024-07-02", activeUsers: 1350, newUsers: 180, revenue: 2800, contestsPlayed: 52 },
    { date: "2024-07-03", activeUsers: 1100, newUsers: 120, revenue: 2200, contestsPlayed: 38 },
    { date: "2024-07-04", activeUsers: 1450, newUsers: 200, revenue: 3200, contestsPlayed: 58 },
    { date: "2024-07-05", activeUsers: 1600, newUsers: 220, revenue: 3500, contestsPlayed: 62 },
    { date: "2024-07-06", activeUsers: 1550, newUsers: 190, revenue: 3300, contestsPlayed: 59 },
    { date: "2024-07-07", activeUsers: 1700, newUsers: 250, revenue: 3800, contestsPlayed: 68 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">FX Fantasy Analytics</h1>
        <p className="text-gray-600 text-sm mt-2">Monitor your game performance and user activity</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 border border-gray-300">
            <h2 className="text-sm font-medium">{stat.title}</h2>
            <div className="text-xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.color}`}>{stat.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Analytics Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-300">
          <h2 className="font-semibold mb-2">Daily Revenue</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(
              analyticsData.map((d) => ({ date: d.date, revenue: d.revenue })),
              null,
              2
            )}
          </pre>
        </div>

        <div className="p-4 border border-gray-300">
          <h2 className="font-semibold mb-2">User Activity</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(
              analyticsData.map((d) => ({
                date: d.date,
                activeUsers: d.activeUsers,
                newUsers: d.newUsers,
              })),
              null,
              2
            )}
          </pre>
        </div>

        <div className="p-4 border border-gray-300">
          <h2 className="font-semibold mb-2">Contest Types Distribution</h2>
          <ul className="list-disc pl-6 text-sm">
            {contestTypeData.map((item, i) => (
              <li key={i}>
                {item.name}: {item.value}%
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border border-gray-300">
          <h2 className="font-semibold mb-2">Contests Played</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(
              analyticsData.map((d) => ({ date: d.date, contestsPlayed: d.contestsPlayed })),
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
