import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy, Award, Medal } from "lucide-react";
import toast from "react-hot-toast";
import { getContestRanking } from "../../../services/User";
import BackButton from "../Backbutton";

const ContestTracking = () => {
  const [contestData, setContestData] = useState([]);
  const location = useLocation();

  const contest_id = location?.state?._id;
  const token = localStorage.getItem("token");

  const fetchContestRanking = async () => {
    if (!contest_id) {
      toast.error("Contest ID is missing");
      return;
    }

    const data = { contest_id, page: 1 };
    const result = await getContestRanking(token, data);

    if (result.status) {
      setContestData(result?.data || []);
    } else {
      toast.error(result?.message || "Failed to fetch contest ranking");
    }
  };

  useEffect(() => {
    fetchContestRanking();
  }, [contest_id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4">
      {/* Header Section */}
      <div className="flex border p-3 justify-between mb-4 rounded-xl bg-white shadow-md items-center">
        <h1 className="text-2xl font-extrabold text-orange-600 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Live Tracking
        </h1>
        <BackButton showText={true} />
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-orange-100">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
          <Award className="w-6 h-6 text-orange-500" />
          Leaderboard
        </h2>

        {contestData.length > 0 ? (
          <ul className="space-y-3">
            {contestData.map((player, index) => {
              const rankBg =
                player.rank === 1
                  ? "bg-yellow-100 border-yellow-300"
                  : player.rank === 2
                  ? "bg-gray-100 border-gray-300"
                  : player.rank === 3
                  ? "bg-orange-100 border-orange-300"
                  : "bg-gray-50 border-gray-200";

              return (
                <li
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-md ${rankBg}`}
                >
                  <div className="flex items-center gap-3">
                    {player.rank <= 3 ? (
                      <Medal
                        className={`w-6 h-6 ${
                          player.rank === 1
                            ? "text-yellow-500"
                            : player.rank === 2
                            ? "text-gray-400"
                            : "text-orange-500"
                        }`}
                      />
                    ) : (
                      <span className="text-lg font-bold text-orange-600">
                        #{player.rank}
                      </span>
                    )}
                    <span className="font-medium text-gray-800">
                      {player?.client_id?.FullName || "Unknown"}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-700">
                    {(player.points ?? 0).toFixed(3)} pts
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No participants yet</p>
        )}
      </div>
    </div>
  );
};

export default ContestTracking;
