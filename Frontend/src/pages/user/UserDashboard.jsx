import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // for dynamic tournament ID
import { GetContestByTurnament } from '../../services/User';
import toast from 'react-hot-toast';

const DreamTradingApp = () => {
  const { tournamentId } = useParams(); // get tournament ID from URL
  const [activeTab, setActiveTab] = useState('Contests');
  const [contestData, setContestData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch contests for tournament
  const fetchContestByTournament = async () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('No token found!');

    setIsLoading(true);
    try {
      const res = await GetContestByTurnament(token, tournamentId);
      if (res?.status) {
        setContestData(res.contests || []);
      } else {
        toast.error(res.message || 'Failed to fetch contests');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching contests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) fetchContestByTournament();
  }, [tournamentId]);

  const ContestCard = ({ contest }) => {
    const progress = ((contest.filled_spots / contest.total_spots) * 100).toFixed(0);
    return (
      <div className="bg-white rounded-xl p-5 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{contest.name}</h3>
          <span className="text-sm text-gray-500">{contest.contest_type}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Prize Pool</p>
            <p className="text-xl font-bold text-gray-800">₹{contest.prize_pool}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Entry Fee</p>
            <p className="text-xl font-semibold text-gray-800">₹{contest.entry_fee}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Spots</p>
            <p className="text-xl font-semibold text-gray-800">
              {contest.filled_spots}/{contest.total_spots}
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>{contest.filled_spots} spots filled</span>
          <span>{contest.total_spots} total spots</span>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400">
          {contest.is_guaranteed && (
            <div className="bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              ✓ Guaranteed
            </div>
          )}
          {contest.is_private && (
            <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">
              Private Contest
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans p-5">
      {/* Navigation Tabs */}
      <div className="bg-white flex border-b border-gray-200 mb-5">
        {['Contests', 'My Contests', 'My Team'].map((tab) => (
          <button
            key={tab}
            className={`flex-1 text-center py-4 font-medium transition-all duration-300 border-b-2 ${
              activeTab === tab
                ? 'text-orange-500 border-orange-500'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contest Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading contests...</p>
      ) : contestData.length > 0 ? (
        <div className="space-y-4">
          {contestData.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No contests available for this tournament.</p>
      )}
    </div>
  );
};

export default DreamTradingApp;
