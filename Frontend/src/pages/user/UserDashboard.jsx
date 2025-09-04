import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Trophy, Users, Target, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";


const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ongoing");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  
  const banners = [
    {
      url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=300&fit=crop",
      title: "Stock Trading Contest",
      subtitle: "Win big with smart investments"
    },
    {
      url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=300&fit=crop",
      title: "Market Analysis Challenge",
      subtitle: "Test your market skills"
    },
    {
      url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=300&fit=crop",
      title: "Investment Competition",
      subtitle: "Compete with top traders"
    },
  ];

  const contests = {
    ongoing: [
      {
        id: 1,
        name: "Top 30 Mega Contest",
        stock: "JP Power & Associates",
        company: "JPPA",
        companyColor: "#2563eb",
        partner: "LIC India",
        partnerColor: "#dc2626",
        timeLeft: "3h 35m",
        status: "Live Contest",
        participants: 2847,
        prizePool: "₹50,000",
        entryFee: "₹25",
        spots: "30/100"
      },
      {
        id: 2,
        name: "Head to Head Challenge",
        stock: "Tata Consultancy Services",
        company: "TCS",
        companyColor: "#059669",
        partner: "HDFC Bank",
        partnerColor: "#7c3aed",
        timeLeft: "1h 22m",
        status: "Filling Fast",
        participants: 45,
        prizePool: "₹10,000",
        entryFee: "₹50",
        spots: "45/50"
      },
    ],
    upcoming: [
      {
        id: 3,
        name: "Weekend Warrior",
        stock: "Reliance Industries",
        company: "RIL",
        companyColor: "#dc2626",
        partner: "SBI",
        partnerColor: "#2563eb",
        timeLeft: "2d 5h",
        status: "Starts Soon",
        participants: 0,
        prizePool: "₹1,00,000",
        entryFee: "₹100",
        spots: "0/500"
      },
      {
        id: 4,
        name: "Nifty50 Challenge",
        stock: "HDFC Bank Limited",
        company: "HDFC",
        companyColor: "#7c3aed",
        partner: "ICICI Bank",
        partnerColor: "#ea580c",
        timeLeft: "1d 12h",
        status: "Registration Open",
        participants: 156,
        prizePool: "₹25,000",
        entryFee: "₹75",
        spots: "156/200"
      },
    ],
    mycontests: [
      {
        id: 5,
        name: "My Active Contest",
        stock: "Infosys Limited",
        company: "INFY",
        companyColor: "#059669",
        partner: "Axis Bank",
        partnerColor: "#dc2626",
        timeLeft: "4h 15m",
        status: "Participating",
        participants: 1,
        prizePool: "₹5,000",
        entryFee: "₹20",
        spots: "Your Rank: #23",
        myRank: 23
      },
    ],
  };

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleImageError = (contestId, type) => {
    setImageErrors(prev => ({
      ...prev,
      [`${contestId}-${type}`]: true
    }));
  };

  const getCompanyIcon = (company, color) => {
    return (
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
        style={{ backgroundColor: color }}
      >
        {company}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'live contest':
      case 'participating':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'filling fast':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'starts soon':
      case 'registration open':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {banners.map((banner, idx) => (
              <div key={idx} className="w-full flex-shrink-0 relative">
                <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={banner.url}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    onError={() => { }}
                  />
                  <div className="relative z-10 text-center text-white px-4">
                    <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                    <p className="text-lg opacity-90">{banner.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>


          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${currentBannerIndex === idx ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>


      <div className="flex justify-around bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden">
        {[
          { key: "ongoing", label: "Live Contests", icon: Trophy },
          { key: "upcoming", label: "Upcoming", icon: Clock },
          { key: "mycontests", label: "My Contests", icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-4 px-2 font-medium text-sm transition-all duration-200 ${activeTab === key
                ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
          </button>
        ))}
      </div>


      <div className="p-4 space-y-4">
        {contests[activeTab].length > 0 ? (
          contests[activeTab].map((contest) => (
            <div
              key={contest.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  {getCompanyIcon(contest.company, contest.companyColor)}
                  <div>
                    <p className="font-semibold text-gray-800">{contest.company}</p>
                    <p className="text-xs text-gray-500">Primary Stock</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{contest.partner}</p>
                    <p className="text-xs text-gray-500">Partner</p>
                  </div>
                  {getCompanyIcon(contest.partner.split(' ')[0], contest.partnerColor)}
                </div>
              </div>


              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{contest.prizePool}</p>
                  <p className="text-xs text-gray-500">Prize Pool</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{contest.entryFee}</p>
                  <p className="text-xs text-gray-500">Entry Fee</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4 mr-1" />
                    {contest.participants}
                  </p>
                  <p className="text-xs text-gray-500">Participants</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 font-semibold">{contest.timeLeft}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{contest.spots}</p>
                  {contest.myRank && (
                    <p className="text-xs text-green-600 font-semibold">Rank: #{contest.myRank}</p>
                  )}
                </div>
              </div>


              <button
                onClick={() =>
                  navigate(`/pricepol`, { state: contest })
                }
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>
                  {activeTab === 'mycontests' ? 'View Contest' :
                    activeTab === 'ongoing' ? 'Join Now' : 'Register'}
                </span>
              </button>

            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">No contests available</p>
            <p className="text-gray-400 text-sm">Check back soon for new contests!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;