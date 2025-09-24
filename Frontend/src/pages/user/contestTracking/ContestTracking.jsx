import React from "react";
import { Trophy, Award, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ContestTracking = () => {
  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: "Alice", points: 1200 },
    { rank: 2, name: "Bob", points: 1100 },
    { rank: 3, name: "Charlie", points: 950 },
    { rank: 4, name: "Diana", points: 870 },
    { rank: 5, name: "Ethan", points: 820 },
  ];

  // Portfolio table data
  const portfolio = [
    { asset: "Stock A", value: "$12,000", change: "+5.2%" },
    { asset: "Stock B", value: "$8,500", change: "-1.3%" },
    { asset: "Crypto X", value: "$3,200", change: "+2.8%" },
    { asset: "Fund Y", value: "$5,700", change: "+0.9%" },
  ];

  // Portfolio graph data (fake static trend)
  const portfolioTrend = [
    { day: "Mon", value: 10000 },
    { day: "Tue", value: 10500 },
    { day: "Wed", value: 10800 },
    { day: "Thu", value: 11200 },
    { day: "Fri", value: 10900 },
    { day: "Sat", value: 11500 },
    { day: "Sun", value: 12000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-600 flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Live Contest Tracking
        </h1>
        <p className="text-gray-600 mt-2">
          Leaderboard with real-time updates <br />
          <span className="text-sm text-gray-400">
            Rankings update every 15 minutes
          </span>
        </p>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-orange-500" />
          Leaderboard
        </h2>
        <ul className="space-y-3">
          {leaderboard.map((player) => (
            <li
              key={player.rank}
              className={`flex justify-between items-center p-4 rounded-xl transition hover:shadow-md ${
                player.rank === 1
                  ? "bg-yellow-100"
                  : player.rank === 2
                  ? "bg-gray-100"
                  : player.rank === 3
                  ? "bg-orange-100"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-orange-600">
                  #{player.rank}
                </span>
                <span className="font-medium">{player.name}</span>
              </div>
              <span className="font-semibold text-gray-700">
                {player.points} pts
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Portfolio Performance */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" />
          Portfolio Performance
        </h2>

        {/* Graph Section */}
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 5, fill: "#f97316" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-4">
          {portfolio.map((item, index) => (
            <div
              key={index}
              className="p-5 border rounded-xl flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition shadow-sm"
            >
              <div>
                <p className="font-semibold">{item.asset}</p>
                <p className="text-gray-500 text-sm">{item.value}</p>
              </div>
              <div className="flex items-center gap-1">
                {item.change.startsWith("+") ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={`font-bold ${
                    item.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestTracking;
