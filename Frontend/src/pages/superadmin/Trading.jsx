import React, { useState } from "react";

const Trading = () => {
  const [isLiveMode, setIsLiveMode] = useState(true);

  const liveContests = [
    {
      id: "1",
      name: "Stock Masters Weekly",
      participants: 1247,
      timeRemaining: "2d 14h 23m",
      status: "active",
      prizePool: 5000,
      topPerformer: { name: "TraderPro99", profit: "+$1,247.50" },
    },
    {
      id: "2",
      name: "Crypto Challenge",
      participants: 892,
      timeRemaining: "4h 15m",
      status: "ending-soon",
      prizePool: 2500,
      topPerformer: { name: "CoinMaster", profit: "+$892.30" },
    },
  ];

  const tradingData = [
    {
      symbol: "AAPL",
      price: 175.43,
      change: 2.34,
      changePercent: 1.35,
      volume: "2.4M",
    },
    {
      symbol: "GOOGL",
      price: 2734.21,
      change: -15.67,
      changePercent: -0.57,
      volume: "1.8M",
    },
    {
      symbol: "MSFT",
      price: 348.1,
      change: 5.2,
      changePercent: 1.52,
      volume: "3.1M",
    },
    {
      symbol: "TSLA",
      price: 245.67,
      change: -8.9,
      changePercent: -3.5,
      volume: "5.2M",
    },
    {
      symbol: "AMZN",
      price: 3234.45,
      change: 12.8,
      changePercent: 0.4,
      volume: "1.9M",
    },
    {
      symbol: "BTC",
      price: 43567.8,
      change: 1234.5,
      changePercent: 2.91,
      volume: "890K",
    },
    {
      symbol: "ETH",
      price: 2891.3,
      change: -45.2,
      changePercent: -1.54,
      volume: "1.2M",
    },
    {
      symbol: "ADA",
      price: 0.67,
      change: 0.02,
      changePercent: 3.08,
      volume: "450K",
    },
  ];

  const getChangeColor = (change) => (change >= 0 ? "green" : "red");
  const getChangeSymbol = (change) => (change >= 0 ? "↑" : "↓");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Live Trading Dashboard</h1>
        <div>
          <button onClick={() => setIsLiveMode(!isLiveMode)}>
            {isLiveMode ? "Pause Live" : "Start Live"}
          </button>
          <button style={{ marginLeft: "10px" }}>Refresh</button>
        </div>
      </div>

      {/* Active Contests */}
      <h2 style={{ marginTop: "30px" }}>Active Contests</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {liveContests.map((contest) => (
          <div
            key={contest.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              width: "300px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{contest.name}</strong>
              <span
                style={{
                  color: contest.status === "ending-soon" ? "red" : "green",
                }}
              >
                {contest.status === "ending-soon" ? "Ending Soon" : "Active"}
              </span>
            </div>
            <div>Participants: {contest.participants}</div>
            <div>Time Remaining: {contest.timeRemaining}</div>
            <div>Prize Pool: ${contest.prizePool}</div>
            <div>
              Top Performer: {contest.topPerformer.name} (
              {contest.topPerformer.profit})
            </div>
          </div>
        ))}
      </div>

      {/* Live Market Data */}
      <h2 style={{ marginTop: "30px" }}>Live Market Data</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {tradingData.map((stock) => (
          <div
            key={stock.symbol}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              width: "200px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{stock.symbol}</strong>
              <span style={{ color: getChangeColor(stock.change) }}>
                {getChangeSymbol(stock.change)}
              </span>
            </div>
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              ${stock.price}
            </div>
            <div style={{ color: getChangeColor(stock.change) }}>
              {stock.change >= 0 ? "+" : ""}
              {stock.change} ({stock.changePercent}%)
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              Volume: {stock.volume}
            </div>
          </div>
        ))}
      </div>

      {/* Trading Activity */}
      <h2 style={{ marginTop: "30px" }}>Recent Trading Activity</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          textAlign: "center",
          color: "#999",
        }}
      >
        <div style={{ fontSize: "40px" }}>👁️</div>
        <p>Live trading activity will appear here</p>
        <p style={{ fontSize: "12px" }}>
          Monitor real-time trades and market movements
        </p>
      </div>
    </div>
  );
};

export default Trading;
