import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GetContestByTurnament, JoinContest, GetMyContests } from "../../services/User";

// Reusable Detail Component
const Detail = ({ label, value, valueClass = "" }) => (
  <div>
    <p className="font-medium">{label}</p>
    <p className={valueClass}>{value}</p>
  </div>
);

const ContestCard = ({ contest, onJoin }) => {
  const progress = (contest.filled_spots / contest.total_spots) * 100 || 0;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 Card-style">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">Prize Pool</p>
          <p className="text-xl font-bold text-indigo-600">₹{contest.prize_pool}</p>
        </div>
        <div className="flex gap-2">
          <button className="font-semibold px-4 py-2 rounded-lg shadow bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200">
            ₹{contest.entry_fee}
          </button>
          <button
            onClick={() => onJoin(contest)}
            className="font-semibold px-4 py-2 rounded-lg shadow bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
          >
            Join
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-orange-500 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>{contest.total_spots - contest.filled_spots} spots left</span>
          <span>{contest.total_spots} spots</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mt-4">
        <span>🏆 Winners: {contest.winners || 1}</span>
        <span className="text-green-600 font-medium">✔ Guaranteed</span>
      </div>
    </div>
  );
};



const MyContestCard = ({ contestWrapper, navigate }) => {
  const contest = contestWrapper?.contest_id || {};

  const handleStart = () => {
    navigate("/history", { state: { contestId: contestWrapper._id } });
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{contest.name || "Unnamed Contest"}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tournament:{" "}
            <span className="text-indigo-600">{contest.tournament_id?.name || "N/A"}</span>
          </p>
        </div>
        <button
          onClick={handleStart}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm"
        >
          Start
        </button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <Detail label="Prize Pool" value={`₹${contest.prize_pool || "0"}`} />
        <Detail label="Entry Fee" value={`₹${contest.entry_fee || "0"}`} />
        <Detail
          label="Joined At"
          value={contestWrapper.joined_at ? new Date(contestWrapper.joined_at).toLocaleString() : "N/A"}
        />
        <Detail label="Status" value="Joined" valueClass="font-semibold text-green-600" />
      </div>
    </div>
  );
};




// Main Component
function Pricepol() {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentId = location?.state?._id;
  const [contests, setContests] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("contests");
  const token = localStorage.getItem("token");

  // Fetch contests by tournament
  useEffect(() => {
    if (!tournamentId || !token) return setError("Missing Tournament ID or Token");

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

  // Fetch my contests
  useEffect(() => {
    const clientId = localStorage.getItem("userId");
    if (!token || !clientId) return setError("Missing token or client ID");

    const fetchMyContests = async () => {
      setLoading(true);
      try {
        const data = await GetMyContests(token, clientId);
        setMyContests(data.status && data.data.length ? data.data : []);
      } catch (err) {
        console.error(err);
        setError("Error fetching my contests");
      } finally {
        setLoading(false);
      }
    };

    fetchMyContests();
  }, [token]);

  // Join contest handler
  const handleJoinNow = async (contest) => {
    const token = localStorage.getItem("token");
    const clientId = localStorage.getItem("userId");
    if (!token || !clientId) return toast.error("Missing authentication info");

    const entryFee = parseFloat(contest.entry_fee) || 0;
    const discount = parseFloat(contest.discount) || 0;
    const total = entryFee - discount;
    if (total < 0 || isNaN(total)) return toast.error("Invalid contest data");

    const result = await Swal.fire({
      title: `Join ${contest.name}?`,
      text: `Entry Fee: ₹${entryFee}\nDiscount: ₹${discount}\nTotal: ₹${total}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Join Now',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return toast.info("Join cancelled");

    try {
      const res = await JoinContest(contest._id, clientId, entryFee, discount, total, token);
      if (res?.status) {
        toast.success(`Joined ${contest.name} successfully 🎉`);
        const joinedContest = { ...contest, ...res.data };
        setMyContests((prev) => prev.find(c => c._id === joinedContest._id) ? prev : [...prev, joinedContest]);
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
    <div className="p-4 bg-gray-50 min-h-screen PricePool_style">
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Tournament Contests</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-full shadow-md flex space-x-2 p-2 Card-style">
          {[
            { key: "contests", label: "Contests" },
            { key: "myContests", label: "My Contests" },
            { key: "myTeam", label: "My Team" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${activeTab === tab.key
                ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow"
                : ""
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center text-blue-500">Loading contests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Content */}
      {!loading && !error && tournament && (
        <div className="max-w-4xl mx-auto space-y-6 Card-style">
          {activeTab === "contests" && contests.map(contest => (
            <ContestCard key={contest._id} contest={contest} onJoin={handleJoinNow} />
          ))}

          {activeTab === "myContests" && (
            <div className="space-y-4">
              {myContests.length > 0 ? myContests.map(contestWrapper => (
                <MyContestCard key={contestWrapper._id} contestWrapper={contestWrapper} navigate={navigate} />
              )) : (
                <div className="text-center py-10 text-gray-500">
                  📌 You haven’t joined any contests yet.
                </div>
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
