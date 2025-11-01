import React, { useEffect, useState } from "react";
import { MyContestsWithoutTournament } from "../../../services/User";
import { useNavigate } from "react-router-dom";
import BackButton from "../Backbutton";
import { Trophy, Clock, Target } from "lucide-react"; // 🆕 Added Target icon

function Search() {
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("live"); // default
  const token = localStorage.getItem("token");
  const client_id = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      const response = await MyContestsWithoutTournament(token, client_id);
      if (response?.status) setResults(response?.data || []);
      else setResults([]);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  // 🧠 Split based on tournament start and end date
  const now = new Date();

  const upcomingContests = results.filter((c) => {
    const start = new Date(c?.contest_id?.tournament_id?.startdate);
    return start > now;
  });

  const liveContests = results.filter((c) => {
    const start = new Date(c?.contest_id?.tournament_id?.startdate);
    const end = new Date(c?.contest_id?.tournament_id?.enddate);
    return start <= now && end >= now;
  });

  const completedContests = results.filter((c) => {
    const end = new Date(c?.contest_id?.tournament_id?.enddate);
    return end < now;
  });

  const filteredData =
    activeTab === "live"
      ? liveContests
      : activeTab === "completed"
      ? completedContests
      : upcomingContests;

  return (
    <div className="p-3 sm:p-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border rounded-2xl shadow-md px-4 py-3 sm:p-4 mb-4 flex items-center justify-between">
        <h2 className="text-base sm:text-xl font-bold text-gray-800 tracking-wide">
          My Contests
        </h2>
        <BackButton />
      </div>

      {/* Tabs */}
      <div className="flex justify-around mx-1 sm:mx-2 rounded-xl bg-white overflow-hidden text-[0.75rem] sm:text-sm mb-5">
        {[
          { key: "live", label: "Live", icon: Trophy },
          { key: "upcoming", label: "Upcoming", icon: Target }, // 🆕 Added
          { key: "completed", label: "Completed", icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 sm:py-4 px-2 font-medium transition-all duration-200 ${
              activeTab === key
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600"
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Contest List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((contestWrapper) => {
            const contest = contestWrapper?.contest_id;
            return (
              <div
                key={contestWrapper._id}
                className="bg-white shadow-sm sm:shadow-md rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="border-b border-orange-100 px-3 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="font-bold text-base sm:text-lg text-gray-900">
                      {contest?.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Tournament:{" "}
                      <span className="text-gray-800 font-semibold">
                        {contest?.tournament_id?.name}
                      </span>
                    </p>
                  </div>

                  {/* Buttons */}
                  {/* Buttons */}
<div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">
  {activeTab === "live" ? (
    <>
      {/* Live */}
      <button
        onClick={() =>
          navigate("/trade", {
            state: {
              contestId: contestWrapper?.contest_id?._id,
              stocks:
                contestWrapper?.contest_id?.tournament_id?.stocks || [],
              wallet_balance: contestWrapper?.wallet_balance || 0,
            },
          })
        }
        className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
      >
        Live
      </button>

      {/* View Rank */}
      <button
        onClick={() =>
          navigate("/contesttracking", {
            state: { _id: contestWrapper?.contest_id?._id },
          })
        }
        className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
      >
        View Rank
      </button>

      {/* History */}
      <button
        onClick={() =>
          navigate("/tradehistory", {
            state: { contestId: contestWrapper?.contest_id?._id },
          })
        }
        className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
      >
        History
      </button>
    </>
  ) : activeTab === "upcoming" ? (
    <button
      disabled
      className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md opacity-60 cursor-not-allowed"
    >
      Coming Soon
    </button>
  ) : (
    <>
      {/* Completed → View Rank */}
      <button
        onClick={() =>
          navigate("/contesttracking", {
            state: { _id: contestWrapper?.contest_id?._id },
          })
        }
        className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
      >
        View Rank
      </button>

      {/* Completed → History */}
      <button
        onClick={() =>
          navigate("/tradehistory", {
            state: { contestId: contestWrapper?.contest_id?._id },
          })
        }
        className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:from-orange-600 hover:to-orange-500 transition-all"
      >
        History
      </button>
    </>
  )}
</div>

                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 text-[11px] sm:text-sm">
                  <div className="bg-gray-50 border rounded-md p-2 sm:p-3 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      Prize Pool
                    </p>
                    <p className="font-bold text-gray-800 text-sm sm:text-base">
                      ₹{contest?.prize_pool || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-md p-2 sm:p-3 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      Entry Fee
                    </p>
                    <p className="font-bold text-gray-800 text-sm sm:text-base">
                      ₹{contest?.entry_fee || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-md p-2 sm:p-3 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      Starts At
                    </p>
                    <p className="font-semibold text-gray-800 text-[10px] sm:text-sm">
                      {new Date(
                        contest?.tournament_id?.startdate
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-md p-2 sm:p-3 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      Status
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                        activeTab === "live"
                          ? "bg-green-100 text-green-700"
                          : activeTab === "upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {activeTab.charAt(0).toUpperCase() +
                        activeTab.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm sm:text-base">
              📌 No {activeTab} contests found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
