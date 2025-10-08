import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { Eye, Edit } from "lucide-react";
import {
  getContestsByTournamentId,
  UpdateContest,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Content from "../../../components/superadmin/Content";

const TournamentContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewContest, setViewContest] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [totalSpots, setTotalSpots] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [status, setStatus] = useState("upcoming");

  const location = useLocation();
  const token = localStorage.getItem("token");
  const tournament_id = location.state?.tournament_id;

  // Fetch contests by tournament
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

  // Open Edit Modal
  const handleOpen = (contest = null) => {
    setSelectedContest(contest);
    setName(contest?.name || "");
    setDescription(contest?.description || "");
    setEntryFee(contest?.entry_fee || "");
    setTotalSpots(contest?.total_spots || "");
    setPrizePool(contest?.prize_pool || "");
    setStatus(contest?.status || "upcoming");
    setOpen(true);
  };

  // Cancel modal
  const handleCancel = () => {
    setOpen(false);
    setSelectedContest(null);
    setName("");
    setDescription("");
    setEntryFee("");
    setTotalSpots("");
    setPrizePool("");
    setStatus("upcoming");
  };

  // Save / Update contest
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedContest) return;

    const payload = {
      id: selectedContest._id,
      name,
      description,
      entry_fee: entryFee,
      total_spots: totalSpots,
      prize_pool: prizePool,
      status,
    };

    setLoading(true);
    const res = await UpdateContest(token, payload);
    setLoading(false);

    if (res?.status) {
      toast.success("Contest updated successfully");
      fetchContests();
      handleCancel();
    } else {
      toast.error(res?.message || "Failed to update contest");
    }
  };

  const columns = [
    // { name: "S.No", selector: (row, i) => i + 1, width: "70px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Entry Fee", selector: (row) => row.entry_fee },
    { name: "Total Spots", selector: (row) => row.total_spots },
    { name: "Prize Pool", selector: (row) => row.prize_pool },
    { name: "Status", selector: (row) => row.tournament_id.status },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <Eye
            className="cursor-pointer text-green-600"
            size={20}
            onClick={() => {
              setViewContest(row);
              setViewOpen(true);
            }}
          />
          <Edit
            className="cursor-pointer text-blue-600"
            size={20}
            onClick={() => handleOpen(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <Content
      Page_title="Tournament Contests"
      button_title="Back"
      button_status={true}
      route={"/superadmin/tournament"}
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          <Datatable columns={columns} data={contests} title="Contests List" />
        </div>

        {/* View Modal */}
        {viewOpen && viewContest && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
            onClick={() => setViewOpen(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ Contest Details</span>
                <button
                  onClick={() => setViewOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-3">
                <p>
                  <strong>Name:</strong> {viewContest?.name}
                </p>
                <p>
                  <strong>Description:</strong> {viewContest?.description}
                </p>
                <p>
                  <strong>Entry Fee:</strong> {viewContest?.entry_fee}
                </p>
                <p>
                  <strong>Total Spots:</strong> {viewContest?.total_spots}
                </p>
                <p>
                  <strong>Prize Pool:</strong> {viewContest?.prize_pool}
                </p>
                <p>
                  <strong>Status:</strong> {viewContest?.tournament_id.status }
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {open && selectedContest && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
            onClick={handleCancel}
          >
            <div
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>✏️ Edit Contest</span>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full border p-2 rounded-md"
                  required
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full border p-2 rounded-md"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    placeholder="Entry Fee"
                    className="w-full border p-2 rounded-md"
                  />
                  <input
                    type="number"
                    value={totalSpots}
                    onChange={(e) => setTotalSpots(e.target.value)}
                    placeholder="Total Spots"
                    className="w-full border p-2 rounded-md"
                  />
                </div>
                <input
                  type="number"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="Prize Pool"
                  className="w-full border p-2 rounded-md"
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
};

export default TournamentContests;
