import React, { useState, useEffect } from 'react';

const DreamTradingApp = () => {
  const [activeTab, setActiveTab] = useState('Contests');
  const [activeNavItem, setActiveNavItem] = useState('Home');

  const contests = [
    {
      id: 1,
      prizePool: '₹85 Crores',
      winners: 1,
      entryFee: '₹575',
      spotsLeft: 4545,
      totalSpots: 24525742,
      progress: 15,
      winnings: '₹9,500',
      percentage: '61%'
    },
    {
      id: 2,
      prizePool: '₹15 Crores',
      winners: 1,
      entryFee: '₹575',
      spotsLeft: 4545,
      totalSpots: 24525742,
      progress: 15,
      winnings: '₹9,500',
      percentage: '61%'
    },
     {
      id: 3,
      prizePool: '₹10 Crores',
      winners: 1,
      entryFee: '₹575',
      spotsLeft: 4545,
      totalSpots: 24525742,
      progress: 15,
      winnings: '₹9,500',
      percentage: '61%'
    },
     {
      id: 4,
      prizePool: '₹5 Crores',
      winners: 1,
      entryFee: '₹575',
      spotsLeft: 4545,
      totalSpots: 24525742,
      progress: 15,
      winnings: '₹9,500',
      percentage: '61%'
    },
     {
      id: 5,
      prizePool: '₹10 lakhs',
      winners: 1,
      entryFee: '₹575',
      spotsLeft: 4545,
      totalSpots: 24525742,
      progress: 15,
      winnings: '₹9,500',
      percentage: '61%'
    }
  ];

  const ContestCard = ({ contest }) => (
    <div className="bg-white rounded-xl p-5 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
            🏆
          </div>
          <span className="text-sm text-gray-600">Prize Pool</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
            👑
          </div>
          <span className="text-sm text-gray-600">Winners</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
            📝
          </div>
          <span className="text-sm text-gray-600">Entry</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold text-gray-800">{contest.prizePool}</div>
        <div className="text-xl font-semibold text-gray-600">{contest.winners}</div>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            // Add entry logic here
          }}
        >
          {contest.entryFee}
        </button>
      </div>

      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
          <div 
            className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${contest.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>{contest.spotsLeft} spot left</span>
        <span>{contest.totalSpots.toLocaleString()} spot</span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span>🏆 {contest.winnings}</span>
          <span>📊 {contest.percentage}</span>
        </div>
        <div className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span>✓</span>
          <span>Guaranteed</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      
      {/* Navigation Tabs */}
      <div className="bg-white flex border-b border-gray-200">
        {['Contests', 'My Contests', 'My Team'].map((tab) => (
          <button
            key={tab}
            className={`flex-1 text-center py-4 font-medium transition-all duration-300 border-b-2 ${
              activeTab === tab
                ? 'text-orange-500 border-orange-500'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tournament Name</h2>
          <a href="#" className="text-green-500 font-medium hover:text-green-600 transition-colors">
            View All &gt;
          </a>
        </div>

        {/* Contest Cards */}
        <div className="space-y-4">
          {contests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default DreamTradingApp;