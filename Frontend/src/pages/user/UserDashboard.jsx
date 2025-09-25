import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  Users,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetBanners, GetTurnament } from "../../services/User";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ongoing");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [turnament, setTurnament] = useState([]);
  console.log("turnament",turnament)
  const [banners, setBanners] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeLeft = (endDate) => {
    const end = new Date(endDate);
    const diff = end - now;
    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const fetchTournament = async () => {
    try {
      const res = await GetTurnament(token);
      if (res?.status && Array.isArray(res.data)) {
        const mappedData = res.data.map((item) => {
          const start = new Date(item.startdate);
          const end = new Date(item.enddate);
          let status;
          if (now < start) status = "upcoming";
          else if (now >= start && now <= end) status = "ongoing";
          else status = "completed";

          return {
            id: item._id,
            name: item.name,
            company: item.stocks?.[0]?.stock_name || "N/A",
            companyColor: "#2563eb",
            partner: item.stocks?.[1]?.stock_name || "N/A",
            partnerColor: "#dc2626",
            start,
            end,
            status,
            participants: item.participants || 0,
            prizePool: item.prizePool || "₹0",
            spots: item.spots || "N/A",
          };
        });
        setTurnament(mappedData);
      } else toast.error(res?.message || "Failed to fetch tournaments");
    } catch {
      toast.error("Error fetching tournaments");
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await GetBanners(token);
      setBanners(res?.data || []);
    } catch {
      toast.error("Failed to fetch banners");
    }
  };

  useEffect(() => {
    fetchTournament();
    fetchBanners();
  }, []);

  const filteredContests = turnament.filter(
    (item) => activeTab !== "mycontests" && item.status === activeTab
  );

  const nextBanner = () =>
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  const prevBanner = () =>
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);

  const getCompanyIcon = (name, color) => (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
      style={{ backgroundColor: color }}
    >
      {name[0]}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-6">

      <div className="px-2 sm:px-4 md:px-6 lg:px-2  relative">
        <div className="overflow-hidden rounded-2xl shadow-xl relative h-40 sm:h-48 md:h-40 lg:h-40 xl:h-40">
          <div
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {banners.map((b, idx) => (
              <div key={idx} className="w-full flex-shrink-0 relative h-full">
                <img
                  src={b.image}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 rounded-2xl" />
              </div>
            ))}
          </div>

          <button
            onClick={prevBanner}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${currentBannerIndex === idx ? "bg-white" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex justify-around bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden text-[0.75rem] sm:text-sm">
        {[
          { key: "ongoing", label: "Live Contests", icon: Trophy },
          { key: "upcoming", label: "Upcoming", icon: Clock },
          { key: "mycontests", label: "My Contests", icon: Target },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 sm:py-4 px-2 font-medium transition-all duration-200 ${activeTab === key ? "border-b-2 border-blue-600" : ""
              }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Contest Cards */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {filteredContests.length > 0 ? (
          filteredContests.map((contest) => (
            <div
              key={contest.id}
              onClick={() =>
                navigate("/pricepol", { state: { _id: contest.id, stocks: contest.stocks || [] } }
                  
                )
              }
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 cursor-pointer border-l-4 ${contest.status === "ongoing"
                ? "border-green-500"
                : contest.status === "upcoming"
                  ? "border-yellow-400"
                  : "border-gray-300"
                } relative overflow-hidden`}
            >
              {/* Status badge */}
              {/* <span
                className={`absolute top-2 right-2 px-2 py-1 text-[0.6rem] sm:text-xs rounded-full font-medium ${
                  contest.status === "ongoing"
                    ? "bg-green-100 text-green-800"
                    : contest.status === "upcoming"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {contest.status.toUpperCase()}
              </span> */}

              {/* Stocks */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  {getCompanyIcon(contest.company, contest.companyColor)}
                  <div>
                    <p className="font-semibold text-sm sm:text-base">
                      {contest.company}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-gray-500">
                      Primary Stock
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-semibold text-sm sm:text-base">
                      {contest.partner}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-gray-500">
                      Partner
                    </p>
                  </div>
                  {getCompanyIcon(contest.partner, contest.partnerColor)}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-md border">
                  <p className="text-base font-bold">{contest.prizePool}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">
                    Prize Pool
                  </p>
                </div>
                <div className="text-center p-2 rounded-md border">
                  <p className="text-base font-bold">
                    {getTimeLeft(contest.end)}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">
                    Time Left
                  </p>
                </div>
                <div className="text-center p-2 rounded-md border">
                  <p className="text-base font-bold flex items-center justify-center">
                    <Users className="w-4 h-4 mr-1" />
                    {contest.participants}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">
                    Participants
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">
              No contests available
            </p>
            <p className="text-gray-400 text-sm">Check back soon for new contests!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
