import React, { useEffect, useState } from "react";

const ReferForm = () => {
  const [referLink, setReferLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Get user from localStorage after login
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.refer_token) {
      setReferLink(`${window.location.origin}/signup?refer=${user.refer_token}`);
    }
  }, [user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=Join using my referral link: ${referLink}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-pink-700 to-orange-500 relative overflow-hidden">
      
      {/* Floating coins */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 bg-yellow-400 rounded-full absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 z-10">
        {/* Main card */}
        <div className="w-full max-w-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
          <h2 className="text-4xl font-bold mb-4 text-yellow-400 text-center animate-pulse">
            🎯 Refer & Earn
          </h2>
          <p className="mb-6 text-center text-gray-300">
            Invite your friends, earn coins, and boost your game!  
            Every friend that joins adds to your rewards.
          </p>

          {/* Referral link */}
          <div className="flex gap-2 mb-6 bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <input
              type="text"
              value={referLink}
              readOnly
              className="flex-1 px-4 py-3 bg-transparent text-white font-mono outline-none"
            />
            <button
              onClick={handleCopy}
              className="bg-yellow-400 text-gray-900 font-bold px-4 py-3 hover:bg-yellow-500 transition-colors relative"
            >
              {copied ? "✅ Copied!" : "Copy"}
            </button>
          </div>

          {/* WhatsApp share */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg animate-bounce"
          >
            📲 Share on WhatsApp
          </button>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Your friends will get bonus coins when they join using your link!
          </div>
        </div>

        {/* Reward cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
          {[
            { title: "💰 Earn Coins", desc: "Get reward coins for each friend you refer.", color: "from-purple-700 to-purple-600" },
            { title: "🎮 Play Games", desc: "Use your coins to participate in exciting games.", color: "from-pink-700 to-pink-600" },
            { title: "🏆 Win Prizes", desc: "Redeem your coins and win awesome prizes!", color: "from-orange-700 to-orange-600" },
            { title: "📢 Share & Invite", desc: "Invite friends via WhatsApp or social media.", color: "from-cyan-700 to-cyan-600" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${item.color} rounded-lg p-4 text-center shadow-lg transform hover:scale-105 transition-transform animate-slideUp`}
            >
              <h3 className="text-xl font-bold text-yellow-300 mb-2">{item.title}</h3>
              <p className="text-gray-200">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind custom animations */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }

        @keyframes fadeIn { 
          0% {opacity:0; transform: translateY(20px);} 
          100% {opacity:1; transform: translateY(0);} 
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }

        @keyframes slideUp { 
          0% {opacity:0; transform: translateY(20px);} 
          100% {opacity:1; transform: translateY(0);} 
        }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ReferForm;
