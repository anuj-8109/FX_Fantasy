import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GetContestByTurnament, JoinContest } from "../../services/User";
import toast from "react-hot-toast";

function Pricepol() {
  const location = useLocation();
  const tournamentId = location?.state?._id;
  const [contests, setContests] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("contests");
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

      if (!token) {
        toast.error("Please login to join the contest");
        return;
      }

      if (!clientId) {
        toast.error("Client ID missing!");
        return;
      }

      const entryFee = parseFloat(contest.entry_fee) || 0;
      const discount = parseFloat(contest.discount) || 0;
      const total = entryFee - discount;

      if (isNaN(total) || total < 0) {
        toast.error("Invalid contest data");
        return;
      }

      // Call backend API
      const res = await JoinContest(contest._id, clientId, entryFee, discount, total, token);

      if (res?.status) {
        toast.success(`Joined ${contest.name} successfully 🎉`);

        // Merge backend response with local contest
        const joinedContest = {
          ...contest,
          ...res.data // backend might return total, joined_at, rank, points, etc.
        };

        // Prevent duplicates in "My Contests"
        setMyContests((prev) => {
          const exists = prev.find((c) => c._id === joinedContest._id);
          if (exists) return prev;
          return [...prev, joinedContest];
        });

        // Optionally, switch to My Contests tab automatically
        setActiveTab("myContests");
      } else {
        toast.error(res?.message || "Failed to join contest");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while joining contest");
    }
  };


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
        Tournament Contests
      </h1>

      {/* -------- Stylish Tabs -------- */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-full shadow-md flex space-x-2 p-2">
          {[
            { key: "contests", label: "Contests" },
            { key: "myContests", label: "My Contests" },
            { key: "myTeam", label: "My Team" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>


      {loading && <p className="text-center text-blue-500">Loading contests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && tournament && (
        <div className="max-w-4xl mx-auto space-y-6">

          {activeTab === "contests" &&
            contests.map((contest) => {
              const progress =
                (contest.filled_spots / contest.total_spots) * 100 || 0;

              return (
                <div
                  key={contest._id}
                  className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
                >
                  {/* Prize Pool + Entry */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Prize Pool</p>
                      <p className="text-xl font-bold text-indigo-600">
                        ₹{contest.prize_pool}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Entry</p>
                      <button
                        onClick={() => handleJoinNow(contest)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
                      >
                        ₹{contest.entry_fee}
                      </button>
                    </div>
                  </div>


                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>
                        {contest.total_spots - contest.filled_spots} spots left
                      </span>
                      <span>{contest.total_spots} spots</span>
                    </div>
                  </div>


                  <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
                    <span>🏆 Winners: {contest.winners || 1}</span>
                    <span className="text-green-600 font-medium">
                      ✔ Guaranteed
                    </span>
                  </div>
                </div>
              );
            })}


          {activeTab === "myContests" && (
            <div>
              {myContests.length > 0 ? (
                myContests.map((contest) => (
                  <div
                    key={contest._id}
                    className="bg-yellow-50 shadow rounded-xl p-4 mb-4 border border-yellow-200"
                  >
                    <p className="font-semibold text-orange-700">{contest.name}</p>
                    <p className="text-sm text-gray-600">
                      Prize Pool: ₹{contest.prize_pool} | Entry: ₹{contest.entry_fee}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  📌 You haven’t joined any contests yet.
                </p>
              )}
            </div>
          )}


          {activeTab === "myTeam" && (
            <p className="text-center text-gray-600">
              👥 Your created teams will appear here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Pricepol;
