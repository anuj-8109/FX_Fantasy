import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";  
import { Trophy, Award } from "lucide-react";
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
    <div className="min-h-screen bg-white p-2 ">
      <div className=" flex border p-2 justify-between mb-2 rounded bg-white shadow">
        <h1 className="text-xl font-extrabold text-orange-600 flex items-center justify-center gap-2">
          Live Tracking
        </h1>
        <BackButton showText={true} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-orange-500" />
          Leaderboard
        </h2>
        <ul className="space-y-3">
          {contestData.length > 0 ? (
            contestData.map((player, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-4 rounded-xl transition hover:shadow-md ${
                  player.rank === 1
                    ? "bg-yellow-100"
                    : player.rank === 2
                    ? "bg-gray-100"
                    : player.rank === 3
                    ? "bg-orange-100"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-orange-600">
                    #{player.rank}
                  </span>
                  <span className="font-medium">
                    {player?.client_id?.FullName || "Unknown"}
                  </span>
                </div>
                <span className="font-semibold text-gray-700">
                  {player.points} pts
                </span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No participants yet</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContestTracking;
