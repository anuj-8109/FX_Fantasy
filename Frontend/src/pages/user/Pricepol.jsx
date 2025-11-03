import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GetContestByTurnament,
  JoinContest,
  GetMyContests,
  ListPrivateContests,
  SharePrivateContest,
  applyCouponAPI,
} from "../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../pages/user/Backbutton";
import Swal from "sweetalert2";

/**
 * Pricepol Component
 * - Shows contests for a tournament
 * - Allows joining contests with optional coupon application
 * - Shows My Contests and Private Contests tabs
 *
 * Important: applyCouponAPI(token, { code, purchaseValue }) must exist on services/User
 */

function Pricepol() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentId = location?.state?._id;

  // Core state
  const [contests, setContests] = useState([]);
  const [joinedContests, setJoinedContests] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [privateContests, setPrivateContests] = useState([]);

  // UI & filters
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // for join/apply actions
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("contests"); // contests | myContests | myTeam
  const [filters, setFilters] = useState({
    minEntryFee: "",
    maxEntryFee: "",
    minPrizePool: "",
    maxPrizePool: "",
    minParticipants: "",
    maxParticipants: "",
  });

  // token
  const token = localStorage.getItem("token");

  // Map to hold applied coupon per contestId (so UI can show discount if user applied before)
  // shape: { [contestId]: { code, discount, finalPrice } }
  const [appliedCoupons, setAppliedCoupons] = useState({});

  // --- Fetch contests by tournament on mount / when tournamentId or token changes ---
  useEffect(() => {
    if (!tournamentId || !token) {
      setError("Missing Tournament ID or Token");
      return;
    }

    const fetchContests = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await GetContestByTurnament(tournamentId, token);
        console.log("GetContestByTurnament response:", data);
        if (data?.status && data.contests?.length > 0) {
          setContests(data.contests);
          setTournament(data.contests[0].tournament_id || null);
        } else {
          setContests([]);
          setTournament(null);
          setError(data?.message || "No contests found");
        }
      } catch (err) {
        console.error("fetchContests error:", err);
        setError("Network or server error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [tournamentId, token]);

  // --- Fetch my contests (joined) ---
  useEffect(() => {
    const clientId = localStorage.getItem("userId");
    if (!token || !clientId) return setError("Missing token or client ID");

    const fetchMyContests = async () => {
      setLoading(true);
      try {
        const data = await GetMyContests(token, clientId);
        console.log("GetMyContests response:", data);
        if (data?.status && data.data?.length > 0) {
          // Filter those that belong to this tournament
          const filteredContests = data.data.filter(
            (c) => c?.contest_id?.tournament_id?._id === tournamentId
          );
          setMyContests(filteredContests);
          const joinedIds = filteredContests.map((c) => c.contest_id?._id);
          setJoinedContests(joinedIds);
        } else {
          setMyContests([]);
          setJoinedContests([]);
        }
      } catch (err) {
        console.error("fetchMyContests error:", err);
        setError("Error fetching my contests");
      } finally {
        setLoading(false);
      }
    };

    fetchMyContests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tournamentId]);

  // --- Fetch private contests when activeTab is myTeam ---
  useEffect(() => {
    const fetchPrivateContests = async () => {
      const clientId = localStorage.getItem("userId");
      if (!token || !clientId || !tournamentId) return;

      try {
        const res = await ListPrivateContests(token, clientId, tournamentId);
        console.log("ListPrivateContests response:", res);
        if (res?.status) setPrivateContests(res.data || []);
        else setPrivateContests([]);
      } catch (err) {
        console.error("Error fetching private contests:", err);
      }
    };

    if (activeTab === "myTeam") fetchPrivateContests();
  }, [activeTab, tournamentId, token]);

  // --- Filter handler ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleResetFilters = () =>
    setFilters({
      minEntryFee: "",
      maxEntryFee: "",
      minPrizePool: "",
      maxPrizePool: "",
      minParticipants: "",
      maxParticipants: "",
    });

  const filteredContests = contests.filter((contest) => {
    const entryFee = parseFloat(contest.entry_fee || 0);
    const prizePool = parseFloat(contest.prize_pool || 0);
    const participants = contest.total_spots || 0;

    const {
      minEntryFee,
      maxEntryFee,
      minPrizePool,
      maxPrizePool,
      minParticipants,
      maxParticipants,
    } = filters;

    if (minEntryFee && entryFee < parseFloat(minEntryFee)) return false;
    if (maxEntryFee && entryFee > parseFloat(maxEntryFee)) return false;
    if (minPrizePool && prizePool < parseFloat(minPrizePool)) return false;
    if (maxPrizePool && prizePool > parseFloat(maxPrizePool)) return false;
    if (minParticipants && participants < parseInt(minParticipants))
      return false;
    if (maxParticipants && participants > parseInt(maxParticipants))
      return false;

    return true;
  });

  // --- Coupon apply + join flow ---
  // This function asks for coupon (optional), tries to apply it, then proceeds to JoinContest
  const handleJoinNow = async (contest) => {
    try {
      // Prevent double clicks
      if (actionLoading) return;
      setActionLoading(true);

      const tokenLocal = localStorage.getItem("token");
      const clientId = localStorage.getItem("userId");

      if (!tokenLocal) {
        toast.error("Please login to join the contest");
        setActionLoading(false);
        return;
      }
      if (!clientId) {
        toast.error("Client ID missing!");
        setActionLoading(false);
        return;
      }

      // Check tournament start
      const now = new Date();
      const startDate = new Date(contest.tournament_id?.startdate);
      if (now >= startDate) {
        toast.error("You cannot join after tournament start!");
        setActionLoading(false);
        return;
      }

      // If already joined, prevent join
      if (joinedContests.includes(contest._id)) {
        toast.error("You have already joined this contest");
        setActionLoading(false);
        return;
      }

      // Entry fee
      const entryFee = parseFloat(contest.entry_fee) || 0;
      let discount = 0;

      // Ask user for coupon code (optional)
      const { value: couponCode } = await Swal.fire({
        title: "Apply Coupon?",
        input: "text",
        inputPlaceholder: "Enter coupon code (optional)",
        showCancelButton: true,
        confirmButtonText: "Apply & Join",
        cancelButtonText: "Skip & Join",
        allowOutsideClick: false,
      });

      // If user entered couponCode (could be empty if skipped)
      if (couponCode) {
        try {
          toast.loading("Applying coupon...");
          // Backend expects { code, purchaseValue }
          const couponRes = await applyCouponAPI(tokenLocal, {
            code: couponCode,
            purchaseValue: entryFee,
          });
          toast.dismiss();

          console.log("applyCouponAPI response:", couponRes);

          if (couponRes?.status) {
            // Backend returns discount / finalPrice
            discount =
              parseFloat(
                couponRes?.discount || couponRes?.discountAmount || 0
              ) || 0;

            // store applied coupon for UI
            setAppliedCoupons((prev) => ({
              ...prev,
              [contest._id]: {
                code: couponCode,
                discount,
                finalPrice: couponRes?.finalPrice ?? entryFee - discount,
              },
            }));

            toast.success(`Coupon applied - ₹${discount} off`);
          } else {
            // If coupon invalid, show message and ask user whether to continue without coupon
            toast.error(
              couponRes?.message || "Coupon invalid or not applicable"
            );
            const { isConfirmed } = await Swal.fire({
              title: "Coupon not applied",
              text: "Do you want to continue and join without coupon?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Yes, join",
              cancelButtonText: "No, cancel",
            });
            if (!isConfirmed) {
              setActionLoading(false);
              return;
            }
          }
        } catch (err) {
          toast.dismiss();
          console.error("applyCouponAPI error:", err);
          toast.error("Error applying coupon — continuing without it");
          // Let user continue to join without coupon
        }
      }

      // Calculate total
      const total = entryFee - discount;
      if (isNaN(total) || total < 0) {
        toast.error("Invalid discount or entry fee");
        setActionLoading(false);
        return;
      }

      // Call JoinContest API
      try {
        toast.loading("Joining contest...");
        const res = await JoinContest(
          contest._id,
          clientId,
          entryFee,
          discount,
          total,
          tokenLocal
        );
        toast.dismiss();
        console.log("JoinContest response:", res);

        if (res?.status) {
          toast.success(`Joined ${contest.name} successfully 🎉`);
          // Update local states
          const joinedContest = { ...contest, ...res.data };
          setMyContests((prev) => {
            const exists = prev.find((c) => c._id === joinedContest._id);
            if (exists) return prev;
            return [...prev, joinedContest];
          });
          setJoinedContests((prev) => [...prev, contest._id]);
          setActiveTab("myContests");
        } else {
          // If backend returns error, show it
          toast.error(res?.message || "Failed to join contest");
        }
      } catch (err) {
        toast.dismiss();
        console.error("JoinContest error:", err);
        toast.error("Error while joining contest");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // --- Share private contest handler (existing code reused) ---
  const handleSharePrivate = async (contest) => {
    const tokenLocal = localStorage.getItem("token");
    const shared_by_client_id = localStorage.getItem("userId");
    if (!tokenLocal || !shared_by_client_id) {
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
      const loadingToastId = toast.loading("Sharing contest...");
      const res = await SharePrivateContest(
        tokenLocal,
        contest._id,
        shared_by_client_id,
        PhoneNo
      );
      toast.dismiss(loadingToastId);

      console.log("SharePrivateContest response:", res);
      if (res?.status) {
        toast.success("Contest shared successfully! 🎉");
      } else {
        toast.error(res?.message || "Failed to share contest");
      }
    } catch (err) {
      console.error("SharePrivateContest error:", err);
      toast.error("Something went wrong while sharing.");
    }
  };

  // --- UI components ---
  const AnimatedProgressBar = ({ filled = 0, total = 0 }) => {
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
      const safeTotal = total > 0 ? total : 1;
      const safeFilled = Math.min(Math.max(filled, 0), safeTotal);
      const percentage = (safeFilled / safeTotal) * 100;

      const timer = setTimeout(() => {
        setProgress(percentage);
      }, 100);

      return () => clearTimeout(timer);
    }, [filled, total]);

    const safeLeft = Math.max(total - filled, 0);
    const lowSpots = safeLeft <= 5;

    return (
      <div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] sm:text-xs text-gray-700 mt-1">
          <span className={lowSpots ? "text-red-500 font-semibold" : ""}>
            {safeLeft} left
          </span>
          <span>{total} spots</span>
        </div>
      </div>
    );
  };

  // --- Render ---
  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-gradient-to-r from-[#f8fafc] to-[#e0f2fe] p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="w-full sm:w-auto flex justify-start sm:justify-normal">
          <BackButton />
        </div>

        <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-center text-orange-600 flex-1 tracking-wide drop-shadow-sm">
          Tournament Contests
        </h1>

        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          {tournament?.startdate &&
            new Date(tournament.startdate) > new Date() && (
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
            )}
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
            className={`pb-2 text-sm sm:text-base font-medium transition-all ${
              activeTab === tab.key
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-black-600 hover:text-black-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-center text-blue-500">Loading contests...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && tournament && (
        <div className="max-w-full md:max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* All Contests */}
          {activeTab === "contests" &&
            filteredContests.map((contest) => {
              const progress =
                (contest.filled_spots / contest.total_spots) * 100 || 0;
              const isJoined = joinedContests.includes(contest._id);
              const applied = appliedCoupons[contest._id];

              return (
                <div
                  key={contest._id}
                  className="bg-gray-50 backdrop-blur-md shadow-md rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full"
                >
                  <p className="text-[12px] sm:text-sm lg:text-[14px] font-semibold text-black-600 mb-2">
                    {contest?.name ||
                      contest.tournament_id?.name ||
                      "Tournament"}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-row items-center gap-3">
                      <p className="text-[11px] sm:text-xs lg:text-[14px] text-black-600">
                        Prize Pool
                      </p>
                      <p className="text-sm sm:text-lg lg:text-[14px] font-bold text-black-600 bg-clip-text">
                        ₹{contest.prize_pool}
                      </p>
                    </div>
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

                  <AnimatedProgressBar
                    filled={contest.filled_spots || 0}
                    total={contest.total_spots || 1}
                  />

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs sm:text-sm lg:text-[14px] text-black-600">
                      🏆{" "}
                      <span className="font-semibold">
                        {contest.winners || 1}
                      </span>{" "}
                      winners
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-1">
                        <p className="text-xs sm:text-sm lg:text-[14px] font-semibold text-[rgb(6,69,91)]">
                          ₹{contest.entry_fee}
                        </p>
                        {applied && (
                          <p className="text-[12px] text-green-600 font-medium">
                            -₹{applied.discount} (coupon)
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleJoinNow(contest)}
                        disabled={
                          isJoined ||
                          new Date() >=
                            new Date(contest.tournament_id?.startdate) ||
                          actionLoading
                        }
                        className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs lg:text-[14px] font-semibold border border-gray-300 shadow-sm transition-all duration-300 ${
                          isJoined ||
                          new Date() >=
                            new Date(contest.tournament_id?.startdate) ||
                          actionLoading
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                            : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {isJoined
                          ? "Joined"
                          : new Date() >=
                            new Date(contest.tournament_id?.startdate)
                          ? "Live"
                          : actionLoading
                          ? "Processing..."
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

                        <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 sm:mt-0">
                          {new Date(
                            contestWrapper?.contest_id?.tournament_id?.startdate
                          ) <= new Date() && (
                            <button
                              onClick={() =>
                                navigate("/trade", {
                                  state: {
                                    contestId: contestWrapper?.contest_id?._id,
                                    stocks:
                                      contestWrapper?.contest_id?.tournament_id
                                        ?.stocks || [],
                                    wallet_balance:
                                      contestWrapper?.wallet_balance || 0,
                                  },
                                })
                              }
                              className="flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500 cursor-pointer"
                            >
                              Live
                            </button>
                          )}

                          {new Date(
                            contestWrapper?.contest_id?.tournament_id?.startdate
                          ) <= new Date() && (
                            <>
                              <button
                                onClick={() =>
                                  navigate("/tradehistory", {
                                    state: {
                                      contestId:
                                        contestWrapper?.contest_id?._id,
                                    },
                                  })
                                }
                                className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                              >
                                History
                              </button>

                              <button
                                onClick={() =>
                                  navigate("/contesttracking", {
                                    state: {
                                      _id: contestWrapper?.contest_id?._id,
                                    },
                                  })
                                }
                                className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                              >
                                View Rank
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 sm:p-4 text-[11px] sm:text-sm">
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">
                            Prize Pool
                          </p>
                          <p className="font-bold text-sm sm:text-base text-gray-900">
                            ₹{contest.prize_pool}
                          </p>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">
                            Entry Fee
                          </p>
                          <p className="font-bold text-sm sm:text-base text-gray-900">
                            ₹{contest.entry_fee}
                          </p>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">
                            Joined At
                          </p>
                          <p className="font-bold text-[10px] sm:text-sm text-gray-900 break-all">
                            {new Date(
                              contestWrapper.joined_at
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 border rounded-md p-2 text-center">
                          <p className="text-gray-600 text-[10px] sm:text-xs">
                            Status
                          </p>
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
                    <div className="border-b border-gray-200 px-3 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h2 className="font-bold text-base sm:text-lg lg:text-2xl text-[rgb(6,69,91)] tracking-wide">
                          {contest?.name}
                        </h2>
                        <p className="text-[11px] sm:text-sm text-[rgb(6,69,91)] mt-1">
                          Tournament:{" "}
                          <span className="font-semibold text-[rgb(6,69,91)]">
                            {contest?.tournament_id?.name ||
                              contest?.tournament_id}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
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
                          disabled={
                            new Date(contest?.tournament_id?.startdate) >
                            new Date()
                          }
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 ${
                            new Date(contest?.tournament_id?.startdate) <=
                            new Date()
                              ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500 cursor-pointer"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          }`}
                        >
                          Live
                        </button>

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

                        <button
                          onClick={() => handleSharePrivate(contest)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                        >
                          Share
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 sm:p-4 text-[11px] sm:text-sm">
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">
                          Prize Pool
                        </p>
                        <p className="font-bold text-sm sm:text-base text-gray-800">
                          ₹{contest.prize_pool}
                        </p>
                      </div>
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">
                          Entry Fee
                        </p>
                        <p className="font-bold text-sm sm:text-base text-gray-800">
                          ₹{contest.entry_fee}
                        </p>
                      </div>
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">
                          Created At
                        </p>
                        <p className="font-bold text-[10px] sm:text-sm text-gray-800 break-all">
                          {new Date(contest.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white border rounded-md p-2 text-center">
                        <p className="text-gray-500 text-[10px] sm:text-xs">
                          Status
                        </p>
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
