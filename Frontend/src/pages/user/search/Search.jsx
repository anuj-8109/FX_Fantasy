import React, { useEffect, useState } from "react";
import { MyContestsWithoutTournament } from "../../../services/User";
import { useNavigate } from "react-router-dom";
import BackButton from "../Backbutton";

function Search() {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");
  const client_id = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      const response = await MyContestsWithoutTournament(token, client_id);
      if (response?.status) {
        setResults(response?.data || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <div className="p-4 sm:p-6">

      <div className="bg-gray-50  border-black rounded-2xl shadow-lg  sm:p-2 mb-6 relative">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-[rgba(13, 13, 14, 1)] px-5 py-2 ">
            My Contests
          </h2>
          <BackButton />
        </div>
        <div className="absolute inset-0 rounded-2xl border border-[rgba(6,69,91,0.3)] pointer-events-none"></div>
      </div>


      <div className="space-y-4 sm:space-y-6">
        {results.length > 0 ? (
          results.map((contestWrapper) => {
            const contest = contestWrapper.contest_id;
            return (
              <div
                key={contestWrapper._id}
                className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="border-b border-orange-100 px-3 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="font-bold text-base sm:text-lg lg:text-2xl text-black tracking-wide">
                      {contest?.name}
                    </h2>
                    <p className="text-[10px] sm:text-xs lg:text-lg text-black mt-1">
                      Tournament:{" "}
                      <span className="text-black font-semibold">
                        {contest?.tournament_id?.name}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
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
    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
  >
    Live
  </button>

  <button
    onClick={() =>
      navigate("/tradehistory", {
        state: { contestId: contestWrapper?.contest_id?._id },
      })
    }
    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
  >
    History
  </button>

  <button
    onClick={() =>
      navigate("/contesttracking", {
        state: { _id: contestWrapper?.contest_id?._id },
      })
    }
    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
  >
    View Rank
  </button>
</div>

                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 text-[10px] sm:text-sm">
                  <div className="bg-gray-50 border rounded-md p-2 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      Prize Pool
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-800">
                      ₹{contest?.prize_pool || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-md p-2 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      Entry Fee
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-800">
                      ₹{contest?.entry_fee || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-md p-2 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      Joined At
                    </p>
                    <p className="font-bold text-[10px] sm:text-sm text-gray-800">
                      {new Date(contestWrapper?.joined_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-md p-2 text-center">
                    <p className="text-gray-500 text-[10px] sm:text-xs">
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
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm sm:text-base">
              📌 You haven’t joined any contests yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
