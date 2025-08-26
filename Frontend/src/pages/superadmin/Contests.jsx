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
      status: "active",
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
      status: "upcoming",
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
    <div className="min-h-screen p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contests</h1>
          <p className=" text-sm">
            Manage trading contests and tournaments
          </p>
        </div>
        <button className=" hover:bg-blue-700  px-4 py-2 text-sm">
          + Create Contest
        </button>
      
      </div>
      

      {/* Contest List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <div key={contest.id} className="p-4 border border-gray-300">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold">{contest.name}</h2>
              <span
                className={`text-xs px-2 py-1 ${
                  contest.status === "active"
                    ? " "
                    : contest.status === "upcoming"
                    ? ""
                    : " "
                }`}
              >
                {contest.status}
              </span>
            </div>
            <p className="text-sm mb-4">{contest.description}</p>

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
              <button className="flex-1 border px-3 py-1 text-sm">Edit</button>
              <button className="border px-3 py-1 text-sm ">
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
