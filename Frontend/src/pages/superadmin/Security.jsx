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
    <div className="min-h-screen flex flex-col p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Security Center</h2>
        <p className="">Monitor and manage platform security</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className=" shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Security Score</p>
            <Shield className="h-4 w-4 " />
          </div>
          <div className="mt-2 text-2xl font-bold ">94%</div>
          <p className="text-xs ">Excellent security</p>
        </div>

        <div className=" shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Active Threats</p>
            <AlertTriangle className="h-4 w-4 " />
          </div>
          <div className="mt-2 text-2xl font-bold ">3</div>
          <p className="text-xs ">Requires attention</p>
        </div>

        <div className=" shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Blocked Attempts</p>
            <Lock className="h-4 w-4 " />
          </div>
          <div className="mt-2 text-2xl font-bold">127</div>
          <p className="text-xs ">Last 24 hours</p>
        </div>

        <div className=" shadow rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">System Status</p>
            <CheckCircle className="h-4 w-4 " />
          </div>
          <div className="mt-2 text-2xl font-bold ">Online</div>
          <p className="text-xs">All systems operational</p>
        </div>
      </div>

      {/* Security Logs */}
      <div className=" shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-1">Security Events</h3>
        <p className="text-sm  mb-4">
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
                      ? ""
                      : log.severity === "medium"
                      ? ""
                      : ""
                  }`}
                />
                <div>
                  <p className="font-medium">{log.event}</p>
                  <p className="text-sm ">{log.user}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-sm ">{log.time}</p>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    log.severity === "high"
                      ? ""
                      : log.severity === "medium"
                      ? ""
                      : ""
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
