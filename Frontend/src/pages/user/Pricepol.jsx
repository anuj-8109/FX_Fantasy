import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetContestByTurnament, JoinContest, GetMyContests, ListPrivateContests, SharePrivateContest } from "../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../pages/user/Backbutton";
import Swal from "sweetalert2";

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

      // ✅ Check if tournament has started
      const now = new Date();
      const startDate = new Date(contest.tournament_id?.startdate); // make sure startdate exists
      if (now >= startDate) {
        return toast.error("You cannot join a contest after the tournament has started!");
      }

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
            className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-black-400 to-black-600 transition-all duration-700 ease-in-out"
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-gradient-to-r from-[#f8fafc] to-[#e0f2fe] p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200">
        {/* Back Button */}
        <div className="w-full sm:w-auto flex justify-start sm:justify-normal">
          <BackButton />
        </div>

        {/* Heading */}
        <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-center text-orange-600 flex-1 tracking-wide drop-shadow-sm">
          Tournament Contests
        </h1>

        {/* Create Button */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={() =>
              navigate("/addprivatecontest", {
                state: { tournament_id: tournament?._id },
              })
            }
            className="bg-orange-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base font-semibold w-full sm:w-auto"
          >
            + Create Private Contest
          </button>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex justify-between mb-6 border-b border-gray-300">
        {[
          { key: "contests", label: "Contests" },
          { key: "myContests", label: "My Contests" },
          { key: "myTeam", label: "Private Contests" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm sm:text-base font-medium transition-all
        ${activeTab === tab.key
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-black-600 hover:text-black-600"
              }
      `}
          >
            {tab.label}
          </button>
        ))}
      </div>



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
                  className="bg-gray-50 backdrop-blur-md shadow-md rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full"
                >
                  <p className="text-[12px] sm:text-sm lg:text-[14px] font-semibold text-black-600 mb-2">
                    {contest?.name || contest.tournament_id?.name || "Tournament"}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    {/* <div className="flex flex-row items-center gap-3">
                      <p className="text-[11px] sm:text-xs lg:text-[14px] text-black-600">Prize Pool</p>
                      <p className="text-sm sm:text-lg lg:text-[14px] font-bold text-black-600 bg-clip-text">
                        ₹{contest.prize_pool}
                      </p>
                    </div> */}
                    <div className="flex flex-wrap items-center gap-3">
                      {contest.is_guaranteed && (
                        <span className="text-[11px] sm:text-xs lg:text-[14px] text-orange-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Guaranteed
                        </span>
                      )}

                      {contest.is_private && (
                        <span className="text-[11px] sm:text-xs lg:text-[14px] text-blue-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                          Private
                        </span>
                      )}
                    </div>

                  </div>

                  <AnimatedProgressBar filled={contest.filled_spots} total={contest.total_spots} />

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs sm:text-sm lg:text-[14px] text-black-600">
                      🏆 <span className="font-semibold">{contest.winners || 1}</span> winners
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm lg:text-[14px] font-semibold text-[rgb(6,69,91)]">
                        ₹{contest.entry_fee}
                      </p>
                      <button
                        onClick={() => handleJoinNow(contest)}
                        disabled={isJoined || new Date() >= new Date(contest.tournament_id?.startdate)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs lg:text-[14px] font-semibold border border-gray-300 shadow-sm transition-all duration-300 ${isJoined || new Date() >= new Date(contest.tournament_id?.startdate)
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                          : "bg-white text-black hover:bg-gray-100"
                          }`}
                      >
                        {isJoined
                          ? "Joined"
                          : new Date() >= new Date(contest.tournament_id?.startdate)
                            ? "Live"
                            : "Join"}
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
                      className="bg-white backdrop-blur-md shadow-md rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full"
                    >
                      {/* Header */}
                      <div className="border-b border-black/10 px-3 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <h2 className="font-bold text-base sm:text-lg lg:text-2xl text-gray-900 tracking-wide">
                            {contest?.name}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-700 mt-1">
                            Tournament:{" "}
                            <span className="font-semibold text-gray-900">
                              {contest?.tournament_id?.name}
                            </span>
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 sm:mt-0">
                          <button
                            onClick={() =>
                              navigate("/trade", {
                                state: {
                                  contestId: contestWrapper?.contest_id?._id,
                                  stocks:
                                    contestWrapper?.contest_id?.tournament_id?.stocks ||
                                    [],
                                  wallet_balance: contestWrapper?.wallet_balance || 0,
                                },
                              })
                            }
                            disabled={
                              new Date(
                                contestWrapper?.contest_id?.tournament_id?.startdate
                              ) > new Date()
                            }
                            className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300
                    ${new Date(
                              contestWrapper?.contest_id?.tournament_id?.startdate
                            ) <= new Date()
                                ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500 cursor-pointer"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                              }`}
                          >
                            Live
                          </button>

                          <button
                            onClick={() =>
                              navigate("/tradehistory", {
                                state: { contestId: contestWrapper?.contest_id?._id },
                              })
                            }
                            className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                          >
                            History
                          </button>

                          <button
                            onClick={() =>
                              navigate("/contesttracking", {
                                state: { _id: contestWrapper?.contest_id?._id },
                              })
                            }
                            className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                          >
                            View Rank
                          </button>
                        </div>
                      </div>

                      {/* Contest Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 sm:p-4 text-[11px] sm:text-sm">
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">Prize Pool</p>
                          {/* <p className="font-bold text-sm sm:text-base text-gray-900">
                            ₹{contest.prize_pool}
                          </p> */}
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">Entry Fee</p>
                          {/* <p className="font-bold text-sm sm:text-base text-gray-900">
                            ₹{contest.entry_fee}
                          </p> */}
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">Joined At</p>
                          <p className="font-bold text-[10px] sm:text-sm text-gray-900 break-all">
                            {new Date(contestWrapper.joined_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">Status</p>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-700">
                            Joined
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm sm:text-base">
                    📌 You haven’t joined any contests yet.
                  </p>
                </div>
              )}
            </div>
          )}



          {/* Private Contests */}
          {activeTab === "myTeam" && (
            <div className="space-y-4 sm:space-y-6">
              {privateContests.length > 0 ? (
                privateContests.map((contest) => (
                  <div
                    key={contest._id}
                    className="bg-gray-50 shadow-md rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 w-full"
                  >
                    {/* Header */}
                    <div className="border-b border-gray-200 px-3 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h2 className="font-bold text-base sm:text-lg lg:text-2xl text-[rgb(6,69,91)] tracking-wide">
                          {contest?.name}
                        </h2>
                        <p className="text-[11px] sm:text-sm text-[rgb(6,69,91)] mt-1">
                          Tournament:{" "}
                          <span className="font-semibold text-[rgb(6,69,91)]">
                            {contest?.tournament_id?.name || contest?.tournament_id}
                          </span>
                        </p>
                      </div>

                      {/* Buttons Section */}
                      <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                        {/* Live Button */}
                        <button
                          onClick={() =>
                            navigate("/trade", {
                              state: {
                                contestId: contest?._id,
                                stocks: contest?.tournament_id?.stocks || [],
                                wallet_balance: contest?.wallet_balance || 0,
                              },
                            })
                          }
                          disabled={new Date(contest?.tournament_id?.startdate) > new Date()}
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300
                  ${new Date(contest?.tournament_id?.startdate) <= new Date()
                              ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500 cursor-pointer"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        >
                          Live
                        </button>

                        {/* History Button */}
                        <button
                          onClick={() =>
                            navigate("/tradehistory", {
                              state: { contestId: contest?._id },
                            })
                          }
                          className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                        >
                          History
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem("token");
                            const shared_by_client_id = localStorage.getItem("userId");

                            if (!token || !shared_by_client_id) {
                              return toast.error("Missing token or client ID");
                            }

                            const { value: PhoneNo } = await Swal.fire({
                              title: "🔗 Share Contest",
                              html: `<p style="font-size:14px; color:#333;">Enter the phone number to share this contest with:</p>`,
                              input: "text",
                              inputPlaceholder: "Enter Phone Number (10-15 digits)",
                              showCancelButton: true,
                              confirmButtonText: "Share",
                              cancelButtonText: "Cancel",
                              inputValidator: (value) => {
                                if (!value) return "Phone number is required!";
                                const phoneRegex = /^[0-9]{10,15}$/;
                                if (!phoneRegex.test(value))
                                  return "Enter a valid phone number (10-15 digits)!";
                              },
                              focusConfirm: false,
                              allowOutsideClick: false,
                              icon: "info",
                              background: "#fefefe",
                              color: "#062d40",
                            });

                            if (!PhoneNo) return;

                            try {
                              // Show loading toast
                              const loadingToast = toast.loading("Sharing contest...");

                              const res = await SharePrivateContest(
                                token,
                                contest._id,
                                shared_by_client_id,
                                PhoneNo
                              );

                              toast.dismiss(loadingToast);

                              if (res?.status) {
                                toast.success("Contest shared successfully! 🎉");
                              } else {
                                toast.error(res?.message || "Failed to share contest");
                              }
                            } catch (error) {
                              console.error("Share error:", error);
                              toast.error("Something went wrong while sharing.");
                            }
                          }}
                          className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                        >
                          Share
                        </button>
                      </div>
                    </div>

                    {/* Contest Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 sm:p-4 text-[11px] sm:text-sm">
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">Prize Pool</p>
                        <p className="font-bold text-sm sm:text-base text-gray-800">
                          ₹{contest.prize_pool}
                        </p>
                      </div>
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">Entry Fee</p>
                        <p className="font-bold text-sm sm:text-base text-gray-800">
                          ₹{contest.entry_fee}
                        </p>
                      </div>
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">Created At</p>
                        <p className="font-bold text-[10px] sm:text-sm text-gray-800 break-all">
                          {new Date(contest.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">Status</p>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
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
