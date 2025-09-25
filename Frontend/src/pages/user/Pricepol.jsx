import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetContestByTurnament, JoinContest, GetMyContests } from "../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../pages/user/Backbutton";

function Pricepol() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentId = location?.state?._id;
  const [contests, setContests] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("myContests");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!tournamentId || !token) {
      setError("Missing Tournament ID or Token");
      return;
    }

    const fetchContests = async () => {
      setLoading(true);
      try {
        const data = await GetContestByTurnament(tournamentId, token);
        if (data.status && data.contests?.length > 0) {
          setContests(data.contests);
          setTournament(data.contests[0].tournament_id);
        } else {
          setError(data.message || "No contests found");
        }
      } catch (err) {
        console.error(err);
        setError("Network or server error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [tournamentId, token]);

  const handleJoinNow = async (contest) => {
    try {
      const token = localStorage.getItem("token");
      const clientId = localStorage.getItem("userId");

      if (!token) return toast.error("Please login to join the contest");
      if (!clientId) return toast.error("Client ID missing!");

      const entryFee = parseFloat(contest.entry_fee) || 0;
      const discount = parseFloat(contest.discount) || 0;
      const total = entryFee - discount;
      if (isNaN(total) || total < 0) return toast.error("Invalid contest data");

      const res = await JoinContest(contest._id, clientId, entryFee, discount, total, token);
      if (res?.status) {
        toast.success(`Joined ${contest.name} successfully 🎉`);
        const joinedContest = { ...contest, ...res.data };
        setMyContests((prev) => {
          const exists = prev.find((c) => c._id === joinedContest._id);
          if (exists) return prev;
          return [...prev, joinedContest];
        });
        setActiveTab("myContests");
      } else {
        toast.error(res?.message || "Failed to join contest");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while joining contest");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const clientId = localStorage.getItem("userId");
    if (!token || !clientId) return setError("Missing token or client ID");

    const fetchMyContests = async () => {
      setLoading(true);
      try {
        const data = await GetMyContests(token, clientId);
        if (data.status && data.data.length > 0) setMyContests(data.data);
        else setMyContests([]);
      } catch (err) {
        console.error(err);
        setError("Error fetching my contests");
      } finally {
        setLoading(false);
      }
    };

    fetchMyContests();
  }, []);

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <BackButton />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-orange-600 flex-1">
          Tournament Contests
        </h1>
        {/* Empty div to balance the BackButton on the left */}
        <div className="w-12"></div>
      </div>


      {/* Tabs */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="bg-white rounded-full shadow-md flex flex-wrap justify-center gap-2 p-1 sm:p-2">
          {[
            { key: "contests", label: "Contests" },
            { key: "myContests", label: "My Contests" },
            { key: "myTeam", label: "My Team" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm md:text-base transition-all ${activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow text-white"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center text-blue-500">Loading contests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Contests */}
      {!loading && !error && tournament && (
        <div className="max-w-full md:max-w-4xl mx-auto space-y-4 sm:space-y-6">

          {/* All Contests */}
          {activeTab === "contests" &&
            contests.map((contest) => {
              const progress = (contest.filled_spots / contest.total_spots) * 100 || 0;

              return (
                <div
                  key={contest._id}
                  className="bg-white shadow-md rounded-2xl p-3 sm:p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 w-full"
                >
                  {/* Top Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Prize Pool</p>
                      <p className="text-lg sm:text-2xl font-bold text-indigo-600">
                        ₹{contest.prize_pool}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm text-green-600 font-medium mt-2 sm:mt-0">
                      ✔ Guaranteed
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3">
                      <div
                        className="h-2 sm:h-3 rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                      <span>{contest.total_spots - contest.filled_spots} spots left</span>
                      <span>{contest.total_spots} spots</span>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-5 gap-2 sm:gap-0">
                    <span className="text-sm sm:text-base text-gray-600">
                      🏆 Winners: {contest.winners || 1}
                    </span>

                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <p className="text-sm sm:text-base font-medium text-gray-600">
                        ₹{contest.entry_fee}
                      </p>
                      <button
                        onClick={() => handleJoinNow(contest)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transition"
                      >
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* My Contests */}
          {activeTab === "myContests" && (
            <div className="space-y-4 sm:space-y-6">
              {myContests.length > 0 ? (
                myContests.map((contestWrapper) => {
                  const contest = contestWrapper.contest_id;
                  return (
                    <div
                      key={contestWrapper._id}
                      className="bg-white shadow-md rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 w-full"
                    >
                      {/* Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-100 gap-2 md:gap-0">
                        <div>
                          <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800">{contest?.name}</h2>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Tournament:{" "}
                            <span className="text-indigo-600 font-medium">
                              {contest?.tournament_id?.name}
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                          <button
                            onClick={() =>
                              navigate("/trade", {
                                state: {
                                  contestId: contestWrapper?.contest_id?._id,
                                  stocks: contestWrapper?.contest_id?.tournament_id?.stocks || [],
                                  useamount: contestWrapper?.contest_id?.useamount || 0   // <-- yaha set karo
                                }
                              })
                            }
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 
             hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md"
                          >
                            Live
                          </button>

                          <button
                            onClick={() =>
                              navigate("/tradehistory", { state: { contestId: contestWrapper?.contest_id?._id } })
                            }
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md"
                          >
                            view History
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 p-4 md:p-6 text-xs sm:text-sm md:text-base">
                        <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                          <p className="text-gray-500 text-xs sm:text-sm">Prize Pool</p>
                          <p className="font-semibold text-gray-800">₹{contest.prize_pool}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                          <p className="text-gray-500 text-xs sm:text-sm">Entry Fee</p>
                          <p className="font-semibold text-gray-800">₹{contest.entry_fee}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                          <p className="text-gray-500 text-xs sm:text-sm">Joined At</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(contestWrapper.joined_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                          <p className="text-gray-500 text-xs sm:text-sm">Status</p>
                          <span className="inline-block px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700">
                            Joined
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                    📌 You haven’t joined any contests yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* My Team */}
          {activeTab === "myTeam" && (
            <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mt-6">
              👥 Your created teams will appear here.
            </p>
          )}
        </div>
      )
      }
    </div >
  );
}

export default Pricepol;
