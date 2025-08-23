import React from "react";
import { Shield, AlertTriangle, CheckCircle, Lock } from "lucide-react";

const Security = () => {
  const securityLogs = [
    {
      id: 1,
      event: "Failed Login Attempt",
      user: "trader@game.com",
      severity: "medium",
      time: "2 minutes ago",
    },
    {
      id: 2,
      event: "Suspicious Trading Pattern",
      user: "crypto@game.com",
      severity: "high",
      time: "15 minutes ago",
    },
    {
      id: 3,
      event: "Password Changed",
      user: "stocks@game.com",
      severity: "low",
      time: "1 hour ago",
    },
    {
      id: 4,
      event: "Multiple Device Login",
      user: "portfolio@game.com",
      severity: "medium",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Security Center</h2>
        <p className="text-gray-500">Monitor and manage platform security</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Security Score</p>
            <Shield className="h-4 w-4 text-green-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-green-500">94%</div>
          <p className="text-xs text-gray-500">Excellent security</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Active Threats</p>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-500">3</div>
          <p className="text-xs text-gray-500">Requires attention</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Blocked Attempts</p>
            <Lock className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl font-bold">127</div>
          <p className="text-xs text-gray-500">Last 24 hours</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">System Status</p>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-green-500">Online</div>
          <p className="text-xs text-gray-500">All systems operational</p>
        </div>
      </div>

      {/* Security Logs */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-1">Security Events</h3>
        <p className="text-sm text-gray-500 mb-4">
          Recent security activities and alerts
        </p>
        <div className="space-y-4">
          {securityLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    log.severity === "high"
                      ? "bg-red-500"
                      : log.severity === "medium"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                />
                <div>
                  <p className="font-medium">{log.event}</p>
                  <p className="text-sm text-gray-500">{log.user}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-500">{log.time}</p>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    log.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : log.severity === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {log.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Security;
