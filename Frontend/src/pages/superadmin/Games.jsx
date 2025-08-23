import React from "react";

const Games = () => {
  const gameSettings = {
    maxContestsPerUser: 5,
    minEntryFee: 1,
    maxEntryFee: 1000,
    contestDuration: 7,
    autoApproveWithdrawals: false,
    enableReferralSystem: true,
    referralBonus: 10,
    maxPlayersPerContest: 1000,
  };

  const gameTypes = [
    {
      id: "stock-trading",
      name: "Stock Trading",
      description: "Fantasy stock trading contests",
      isActive: true,
      players: 5420,
      avgDuration: "7 days",
      avgPrize: "$500",
    },
    {
      id: "crypto-trading",
      name: "Crypto Trading",
      description: "Cryptocurrency trading contests",
      isActive: true,
      players: 3210,
      avgDuration: "3 days",
      avgPrize: "$250",
    },
    {
      id: "forex-trading",
      name: "Forex Trading",
      description: "Foreign exchange trading contests",
      isActive: false,
      players: 1890,
      avgDuration: "5 days",
      avgPrize: "$300",
    },
    {
      id: "commodity-trading",
      name: "Commodity Trading",
      description: "Commodity futures trading contests",
      isActive: true,
      players: 980,
      avgDuration: "14 days",
      avgPrize: "$750",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Game Settings</h1>

      {/* Game Types */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Game Types</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {gameTypes.map((gameType) => (
            <div
              key={gameType.id}
              className="p-4 border rounded-lg hover:shadow transition"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{gameType.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    gameType.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {gameType.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {gameType.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>Players: {gameType.players.toLocaleString()}</span>
                <span>Avg Duration: {gameType.avgDuration}</span>
                <span>Avg Prize: {gameType.avgPrize}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="p-3 border rounded-lg">
            <strong>Max Contests Per User: </strong>
            {gameSettings.maxContestsPerUser}
          </div>
          <div className="p-3 border rounded-lg">
            <strong>Contest Duration (days): </strong>
            {gameSettings.contestDuration}
          </div>
          <div className="p-3 border rounded-lg">
            <strong>Minimum Entry Fee ($): </strong>
            {gameSettings.minEntryFee}
          </div>
          <div className="p-3 border rounded-lg">
            <strong>Maximum Entry Fee ($): </strong>
            {gameSettings.maxEntryFee}
          </div>
          <div className="p-3 border rounded-lg">
            <strong>Max Players Per Contest: </strong>
            {gameSettings.maxPlayersPerContest}
          </div>
          <div className="p-3 border rounded-lg">
            <strong>Referral Bonus (%): </strong>
            {gameSettings.referralBonus}
          </div>
        </div>

        <div className="grid gap-4 mt-6 text-sm">
          <div className="p-3 border rounded-lg flex justify-between">
            <span>
              <strong>Auto-approve Withdrawals: </strong>
            </span>
            <span>
              {gameSettings.autoApproveWithdrawals ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="p-3 border rounded-lg flex justify-between">
            <span>
              <strong>Referral System: </strong>
            </span>
            <span>
              {gameSettings.enableReferralSystem ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
