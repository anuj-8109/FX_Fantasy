import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetContestByTurnament, JoinContest, GetMyContests, ListPrivateContests, SharePrivateContest } from "../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../pages/user/Backbutton";

function Pricepol() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentId = location?.state?._id;
  const [contests, setContests] = useState([]);
  const [joinedContests, setJoinedContests] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("contests");
  const [privateContests, setPrivateContests] = useState([]);
  const [filters, setFilters] = useState({
    minEntryFee: "",
    maxEntryFee: "",
    minPrizePool: "",
    maxPrizePool: "",
    minParticipants: "",
    maxParticipants: "",
  });
  const token = localStorage.getItem("token");
  console.log("privateContests", privateContests)

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

      if (!joinedContests.includes(contest._id)) {
        setJoinedContests((prev) => [...prev, contest._id]);
      }
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
        if (data.status && data.data.length > 0) {
          setMyContests(data.data);

          // ✅ update joinedContests also
          const joinedIds = data.data.map((c) => c.contest_id?._id);
          setJoinedContests(joinedIds);
        } else {
          setMyContests([]);
          setJoinedContests([]);
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching my contests");
      } finally {
        setLoading(false);
      }
    };

    fetchMyContests();
  }, []);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      minEntryFee: "",
      maxEntryFee: "",
      minPrizePool: "",
      maxPrizePool: "",
      minParticipants: "",
      maxParticipants: "",
    });
  };

  const filteredContests = contests.filter((contest) => {
    const entryFee = parseFloat(contest.entry_fee);
    const prizePool = parseFloat(contest.prize_pool);
    const participants = contest.total_spots;

    const { minEntryFee, maxEntryFee, minPrizePool, maxPrizePool, minParticipants, maxParticipants } = filters;

    if (minEntryFee && entryFee < parseFloat(minEntryFee)) return false;
    if (maxEntryFee && entryFee > parseFloat(maxEntryFee)) return false;
    if (minPrizePool && prizePool < parseFloat(minPrizePool)) return false;
    if (maxPrizePool && prizePool > parseFloat(maxPrizePool)) return false;
    if (minParticipants && participants < parseInt(minParticipants)) return false;
    if (maxParticipants && participants > parseInt(maxParticipants)) return false;

    return true;
  });
  useEffect(() => {
    const fetchPrivateContests = async () => {
      const token = localStorage.getItem("token");
      const clientId = localStorage.getItem("userId");
      if (!token || !clientId || !tournamentId) return;

      try {
        const res = await ListPrivateContests(token, clientId, tournamentId); // pass tournamentId
        if (res.status) {
          setPrivateContests(res.data || []);
        } else {
          setPrivateContests([]);
        }
      } catch (err) {
        console.error("Error fetching private contests:", err);
      }
    };

    if (activeTab === "myTeam") fetchPrivateContests();
  }, [activeTab, tournamentId]);


  const AnimatedProgressBar = ({ filled, total }) => {
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
      // Ensure filled is between 0 and total
      const safeFilled = Math.max(0, Math.min(filled, total));
      const percentage = total > 0 ? (safeFilled / total) * 100 : 0;

      const timer = setTimeout(() => setProgress(percentage), 150);
      return () => clearTimeout(timer);
    }, [filled, total]);

    const safeLeft = Math.max(total - filled, 0);
    const lowSpots = safeLeft <= 5;

    return (
      <div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] sm:text-xs text-[rgba(4,53,71,1)] mt-1">
          <span className={lowSpots ? "text-red-500 font-semibold" : ""}>
            {safeLeft} left
          </span>
          <span>{total} spots</span>
        </div>
      </div>
    );
  };




  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <BackButton />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[rgb(6,69,91)] flex-1">
          Tournament Contests
        </h1>

        <button
          onClick={() =>
            navigate("/addprivatecontest", {
              state: {
                tournament_id: tournament?._id,
              },
            })
          }
          className="bg-[#043e53] text-white px-4 py-2 rounded-lg shadow transition text-xs sm:text-sm md:text-base"
        >
          Create Private Contest
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="bg-[#053e53]rounded-full shadow-md flex flex-wrap justify-center gap-2 p-1 sm:p-2">
          {[
            { key: "contests", label: "Contests" },
            { key: "myContests", label: "My Contests" },
            { key: "myTeam", label: "Private Contests" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm md:text-base transition-all ${activeTab === tab.key
                ? "bg-[#053e53] shadow text-white"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      {/* {activeTab === "contests" && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex flex-wrap items-center gap-3 justify-start">
      
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-gray-600 text-xs sm:text-sm font-medium">Entry Fee:</span>
            <input
              type="number"
              name="minEntryFee"
              placeholder="Min"
              value={filters.minEntryFee}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-2 w-20 sm:w-24 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="number"
              name="maxEntryFee"
              placeholder="Max"
              value={filters.maxEntryFee}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-2 w-20 sm:w-24 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

       
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-gray-600 text-xs sm:text-sm font-medium">Prize Pool:</span>
            <input
              type="number"
              name="minPrizePool"
              placeholder="Min"
              value={filters.minPrizePool}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-2 w-20 sm:w-24 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="number"
              name="maxPrizePool"
              placeholder="Max"
              value={filters.maxPrizePool}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-2 w-20 sm:w-24 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

 
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-gray-600 text-xs sm:text-sm font-medium">Participants:</span>
            <input
              type="number"
              name="minParticipants"
              placeholder="Min"
              value={filters.minParticipants}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-2 w-20 sm:w-24 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="number"
              name="maxParticipants"
              placeholder="Max"
              value={filters.maxParticipants}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-2 w-20 sm:w-24 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>


          <button
            onClick={handleResetFilters}
            className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all text-sm sm:text-base"
          >
            Reset Filters
          </button>
        </div>
      )} */}


      {/* Loading/Error */}
      {loading && <p className="text-center text-blue-500">Loading contests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Contests */}
      {!loading && !error && tournament && (
        <div className="max-w-full md:max-w-4xl mx-auto space-y-4 sm:space-y-6">

          {/* All Contests */}
          {activeTab === "contests" &&
            filteredContests.map((contest) => {
              const progress =
                (contest.filled_spots / contest.total_spots) * 100 || 0;

              const isJoined = joinedContests.includes(contest._id);

              return (
                <div
                  key={contest._id}
                  className="bg-[#053e5338] backdrop-blur-md shadow-md rounded-xl p-3 sm:p-4 border border-gray-200 
                   hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full"
                >
                  {/* Tournament Name */}
                  <p className="text-[12px] sm:text-sm font-semibold text-[#053e53] mb-2">
                    {contest?.name || contest.tournament_id?.name || "Tournament"}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-row items-center gap-3">
                      <p className="text-[11px] sm:text-xs text-[rgba(4, 53, 71, 1)]">Prize Pool</p>
                      <p className="text-sm sm:text-lg font-bold bg-[#053e53] text-transparent bg-clip-text">
                        ₹{contest.prize_pool}
                      </p>
                    </div>
                    <span className="text-[11px] sm:text-xs text-[rgba(4, 53, 71, 1)] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      Guaranteed
                    </span>
                  </div>

                  <AnimatedProgressBar
                    filled={contest.filled_spots}
                    total={contest.total_spots}
                  />


                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs sm:text-sm text-[rgba(4, 53, 71, 1)]">
                      🏆 <span className="font-semibold">{contest.winners || 1}</span> winners
                    </span>
                    <div className="flex items-center gap-2 ">
                      <p className="text-xs sm:text-sm font-semibold text-[rgb(6,69,91)]">
                        ₹{contest.entry_fee}
                      </p>
                      <button
                        onClick={() => handleJoinNow(contest)}
                        disabled={isJoined}
                        className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold shadow-sm transition-all duration-300
                         ${isJoined
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-[#053e53] text-white hover:shadow-md"}`}
                      >
                        {isJoined ? "Joined" : "Join"}
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
                      className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="heading_style border-b border-orange-100 px-3 py-3 flex  sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h2 className="font-bold text-base sm:text-lg lg:text-2xl text-[rgb(6,69,91)] tracking-wide">
                            {contest?.name}
                          </h2>
                          <p className="text-[10px] sm:text-xs lg:text-lg text-[rgb(6,69,91)] mt-1">
                            Tournament:{" "}
                            <span className="text-[rgb(6,69,91)] font-semibold">
                              {contest?.tournament_id?.name}
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
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
                            className="px-3 py-1.5  button_style text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm"
                          >
                            Live
                          </button>
                          <button
                            onClick={() =>
                              navigate("/tradehistory", {
                                state: { contestId: contestWrapper?.contest_id?._id },
                              })
                            }
                            className="px-3 py-1.5  button_style text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm"
                          >
                            History
                          </button>
                          <button
                            onClick={() =>
                              navigate("/contesttracking", {
                                state: { _id: contestWrapper?.contest_id?._id },
                              })
                            }
                            className="px-3 py-1.5  button_style text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm"
                          >
                            View Rank
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 text-[10px] sm:text-sm">
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Prize Pool</p>
                          <p className="font-bold text-sm sm:text-base text-gray-800">
                            ₹{contest.prize_pool}
                          </p>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Entry Fee</p>
                          <p className="font-bold text-sm sm:text-base text-gray-800">
                            ₹{contest.entry_fee}
                          </p>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Joined At</p>
                          <p className="font-bold text-[10px] sm:text-sm text-gray-800">
                            {new Date(contestWrapper.joined_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Status</p>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-700">
                            Joined
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm sm:text-base">
                    📌 You haven’t joined any contests yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "myTeam" && (
            <div className="space-y-4 sm:space-y-6">
              {privateContests.length > 0 ? (
                privateContests.map((contestWrapper) => {
                  const contest = contestWrapper;
                  return (
                    <div
                      key={contest._id}
                      className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="heading_style border-b border-orange-100 px-3 py-3 flex sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h2 className="font-bold text-base sm:text-lg lg:text-2xl text-[rgb(6,69,91)] tracking-wide">
                            {contest?.name}
                          </h2>
                          <p className="text-[10px] sm:text-xs lg:text-lg text-[rgb(6,69,91)] mt-1">
                            Tournament:{" "}
                            <span className="text-[rgb(6,69,91)] font-semibold">
                              {contest?.tournament_id?.name || contest?.tournament_id}
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">

                          <button
                            onClick={() =>
                              navigate("/trade", {
                                state: {
                                  contestId: contest?._id,
                                  stocks: contest?.tournament_id?.stocks || [], // <-- fixed
                                  wallet_balance: contest?.wallet_balance || 0,
                                },
                              })
                            }
                            className="px-3 py-1.5 button_style text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm"
                          >
                            Live
                          </button>

                          <button
                            onClick={() =>
                              navigate("/tradehistory", {
                                state: { contestId: contest?._id },
                              })
                            }
                            className="px-3 py-1.5 button_style text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm"
                          >
                            History
                          </button>

                          <button
                            onClick={async () => {
                              const token = localStorage.getItem("token");
                              const clientId = localStorage.getItem("userId");
                              const sharedWith = prompt(
                                "Enter client ID to share contest with:"
                              );
                              if (!sharedWith) return;

                              const res = await SharePrivateContest(
                                token,
                                contest._id,
                                sharedWith,
                                clientId
                              );
                              if (res?.status)
                                toast.success("Contest shared successfully!");
                              else toast.error(res?.message || "Failed to share contest");
                            }}
                            className="px-3 py-1.5 button_style text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm"
                          >
                            Share
                          </button>

                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 text-[10px] sm:text-sm">
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Prize Pool</p>
                          <p className="font-bold text-sm sm:text-base text-gray-800">
                            ₹{contest.prize_pool}
                          </p>
                        </div>

                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Entry Fee</p>
                          <p className="font-bold text-sm sm:text-base text-gray-800">
                            ₹{contest.entry_fee}
                          </p>
                        </div>

                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Created At</p>
                          <p className="font-bold text-[10px] sm:text-sm text-gray-800">
                            {new Date(contest.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-500 text-[10px] sm:text-xs">Status</p>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm sm:text-base">
                    📌 You haven’t created any private contests yet.
                  </p>
                </div>
              )}
            </div>
          )}


        </div>
      )}



    </div>
  );
}

export default Pricepol;
