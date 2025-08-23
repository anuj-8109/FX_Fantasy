import React, { useState } from "react";

const Wallet = () => {
  const [filter, setFilter] = useState("all");

  const transactions = [
    {
      id: "1",
      userId: "user123",
      type: "deposit",
      amount: 250.0,
      status: "completed",
      date: "2024-07-06T10:30:00",
      description: "USDT Deposit via Binance",
    },
    {
      id: "2",
      userId: "user456",
      type: "withdrawal",
      amount: 150.0,
      status: "pending",
      date: "2024-07-06T09:15:00",
      description: "Withdrawal to Bank Account",
    },
    {
      id: "3",
      userId: "user789",
      type: "contest_entry",
      amount: 25.0,
      status: "completed",
      date: "2024-07-06T08:45:00",
      description: "Entry fee for Weekly Stock Challenge",
    },
    {
      id: "4",
      userId: "user321",
      type: "prize_payout",
      amount: 500.0,
      status: "completed",
      date: "2024-07-05T18:30:00",
      description: "Prize payout - Crypto Tournament Winner",
    },
    {
      id: "5",
      userId: "user654",
      type: "withdrawal",
      amount: 75.0,
      status: "failed",
      date: "2024-07-05T15:20:00",
      description: "Withdrawal failed - Insufficient KYC",
    },
  ];

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.status === filter);

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingWithdrawals = transactions.filter(
    (t) => t.type === "withdrawal" && t.status === "pending"
  ).length;
  const completedToday = transactions.filter(
    (t) =>
      t.status === "completed" &&
      new Date(t.date).toDateString() === new Date().toDateString()
  ).length;

  const handleApproveWithdrawal = (id) => alert(`Withdrawal ${id} approved!`);
  const handleRejectWithdrawal = (id) => alert(`Withdrawal ${id} rejected!`);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Wallet Management</h1>
      <p>Monitor and manage user wallet transactions</p>

      {/* Summary */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "15px", flex: 1 }}>
          <div>Total Volume</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            {formatCurrency(totalVolume)}
          </div>
          <div style={{ fontSize: "12px", color: "#555" }}>
            All time transactions
          </div>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px", flex: 1 }}>
          <div>Pending Withdrawals</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            {pendingWithdrawals}
          </div>
          <div style={{ fontSize: "12px", color: "#555" }}>
            Requires approval
          </div>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px", flex: 1 }}>
          <div>Completed Today</div>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            {completedToday}
          </div>
          <div style={{ fontSize: "12px", color: "#555" }}>
            Successful transactions
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        {["all", "pending", "completed", "failed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 10px",
              backgroundColor: filter === f ? "#007bff" : "#fff",
              color: filter === f ? "#fff" : "#000",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {filteredTransactions.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div>{t.description}</div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                User: {t.userId} • {formatDate(t.date)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color:
                    t.type === "deposit" || t.type === "prize_payout"
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {t.type === "deposit" || t.type === "prize_payout" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </div>
              <div
                style={{ fontSize: "12px", color: getStatusColor(t.status) }}
              >
                {t.status.toUpperCase()}
              </div>
              {t.type === "withdrawal" && t.status === "pending" && (
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    gap: "5px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => handleApproveWithdrawal(t.id)}
                    style={{
                      backgroundColor: "green",
                      color: "#fff",
                      border: "none",
                      padding: "3px 5px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectWithdrawal(t.id)}
                    style={{
                      backgroundColor: "red",
                      color: "#fff",
                      border: "none",
                      padding: "3px 5px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
