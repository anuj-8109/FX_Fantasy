import React from "react";

const Contests = () => {
  const contests = [
    {
      id: "1",
      name: "Weekly Stock Challenge",
      description: "Pick your top 5 stocks for the week and compete for prizes",
      entryFee: 25,
      prizePool: 1000,
      participants: 45,
      maxParticipants: 100,
      startDate: "2024-07-08T09:00",
      endDate: "2024-07-14T17:00",
      status: "active",
      createdAt: "2024-07-01T10:00:00",
      selectedStocks: ["1", "2", "3", "4", "5"],
      contestType: "stock_trading",
      rules: {
        maxStockSelection: 5,
        initialBudget: 100000,
        tradingHours: "9:30 AM - 4:00 PM EST",
        allowShortSelling: false,
      },
    },
    {
      id: "2",
      name: "Crypto Trading Tournament",
      description:
        "Trade the top cryptocurrencies in this high-stakes tournament",
      entryFee: 50,
      prizePool: 2500,
      participants: 23,
      maxParticipants: 50,
      startDate: "2024-07-15T09:00",
      endDate: "2024-07-22T17:00",
      status: "upcoming",
      createdAt: "2024-07-02T14:00:00",
      selectedStocks: ["6", "7", "8"],
      contestType: "crypto_trading",
      rules: {
        maxStockSelection: 3,
        initialBudget: 50000,
        tradingHours: "24/7",
        allowShortSelling: true,
      },
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contests</h1>
          <p className="text-gray-500">
            Manage trading contests and tournaments
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
          + Create Contest
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold">{contest.name}</h2>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  contest.status === "active"
                    ? "bg-green-100 text-green-700"
                    : contest.status === "upcoming"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {contest.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{contest.description}</p>

            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <strong>Entry:</strong> {formatCurrency(contest.entryFee)}
              </div>
              <div>
                <strong>Prize:</strong> {formatCurrency(contest.prizePool)}
              </div>
              <div>
                <strong>Participants:</strong> {contest.participants}/
                {contest.maxParticipants}
              </div>
              <div>
                <strong>Start:</strong> {formatDate(contest.startDate)}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 border px-3 py-1 rounded-lg text-sm">
                Edit
              </button>
              <button className="border px-3 py-1 rounded-lg text-sm text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contests;
