import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { FileText, Edit, Eye, Trash2 } from "lucide-react";
import { getContestsByTournamentId } from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Content from "../../../components/superadmin/Content";

const TournamentContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewContest, setViewContest] = useState(null);
   const location = useLocation();


  const token = localStorage.getItem("token");
    const tournament_id = location.state?.tournament_id;

  const fetchContests = async () => {
    setLoading(true);
    const response = await getContestsByTournamentId(token, tournament_id);
    if (response?.status) {
      setContests(response?.contests);
    } else {
      toast.error(response?.message || "Failed to load contests");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tournament_id) fetchContests();
  }, [tournament_id]);

  const columns = [
    { name: "S.No", selector: (row, i) => i + 1, width: "70px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Entry Fee", selector: (row) => row.entry_fee },
    { name: "Total Spots", selector: (row) => row.total_spots },
    { name: "Prize Pool", selector: (row) => row.prize_pool },
    { name: "Status", selector: (row) => row.status },
    {
      name: "Action",
      cell: (row) => (
        <Eye
          className="cursor-pointer text-green-600"
          size={20}
          onClick={() => {
            setViewContest(row);
            setViewOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Content Page_title="Tournament Contests"  button_title="Back"
            button_status={true} route={"/superadmin/tournament"}>
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          <Datatable columns={columns} data={contests} title="Contests List" />
        </div>

        {viewOpen && viewContest && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ Contest Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewContest(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-3">
                <p><strong>Name:</strong> {viewContest?.name}</p>
                <p><strong>Description:</strong> {viewContest?.description}</p>
                <p><strong>Entry Fee:</strong> {viewContest?.entry_fee}</p>
                <p><strong>Total Spots:</strong> {viewContest?.total_spots}</p>
                <p><strong>Prize Pool:</strong> {viewContest?.prize_pool}</p>
                <p><strong>Status:</strong> {viewContest?.status}</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewContest(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
};

export default TournamentContests;
