import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { FileText, Edit, Eye, Trash2 } from "lucide-react";
import {
  GetContestsList,
  AddContest,
  UpdateContest,
  DeleteContest,
  UpdateContestStatus,
  UpdateContestStatusActive,
  GetContestDetails,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";

const Contest = () => {
  const [contests, setContests] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewContest, setViewContest] = useState(null);

  // contest fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [totalSpots, setTotalSpots] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [status, setStatus] = useState("upcoming");

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  // fetch contests
  const fetchContests = async () => {
    setLoading(true);
    const response = await GetContestsList(token);
    if (response?.status) {
      setContests(response?.data);
    } else {
      toast.error(response?.message || "Failed to load contests");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  // open modal
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

  // delete contest
  const handleDelete = async (contest) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this contest?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    const response = await DeleteContest(token, contest._id);
    setLoading(false);

    if (response?.status) {
      toast.success(response?.message || "Contest deleted successfully");
      fetchContests();
    } else {
      toast.error(response?.message || "Failed to delete contest");
    }
  };

  // cancel form
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

  // save contest
  const handleSave = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: selectedContest ? "Update Contest?" : "Add Contest?",
      text: selectedContest
        ? "Are you sure you want to update this contest?"
        : "Are you sure you want to add this contest?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      add_by,
      name,
      description,
      entry_fee: entryFee,
      total_spots: totalSpots,
      prize_pool: prizePool,
      status,
    };

    if (selectedContest) payload.id = selectedContest._id;

    setLoading(true);
    let response;
    if (selectedContest) {
      response = await UpdateContest(token, payload);
    } else {
      response = await AddContest(token, payload);
    }

    if (response?.status) {
      toast.success(response?.message || "Saved successfully");
      fetchContests();
      handleCancel();
    } else {
      toast.error(response?.message || "Failed to save");
    }

    setLoading(false);
  };

  // toggle status
  const handleStatusChange = async (contest) => {
    const actionText = contest.status === "live" ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this contest?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      id: contest._id,
      status: contest.status === "live" ? "false" : "live",
    };

    const res = await UpdateContestStatus(token, payload);

    if (res?.status) {
      toast.success(res?.message || `Contest ${actionText}d`);
      fetchContests();
    } else {
      toast.error(res?.message || "Failed to change status");
    }
  };

 
  const columns = [
    { name: "S.No", selector: (row, i) => i + 1, width: "80px" },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Entry Fee", selector: (row) => row.entry_fee },
    { name: "Total Spots", selector: (row) => row.total_spots },
    { name: "Prize Pool", selector: (row) => row.prize_pool },
    {
      name: "Status",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status === "live"}
            onChange={() => handleStatusChange(row)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full border peer-checked:translate-x-full transition-transform"></div>
        </label>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <Edit
            className="cursor-pointer text-blue-600"
            onClick={() => handleOpen(row)}
          />
          <Trash2
            className="cursor-pointer text-red-600"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
    {
      name: "View",
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
    <Content Page_title="Contest Management" button_title="back" button_status={true}>
      <div className="p-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText />
            <h1 className="text-2xl font-bold">All Contests</h1>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded text-white"
            onClick={() => handleOpen()}
          >
            + Add Contest
          </button>
        </div>

        <div className="shadow-lg rounded-xl p-4 bg-white">
          <Datatable columns={columns} data={contests} title="Contest List" />
        </div>

        
        {open && (
          <div className="fixed mt-10 inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-4">
              <h2 className="text-lg font-semibold mb-2 border-b pb-2">
                {selectedContest ? "✏️ Edit Contest" : "➕ Add Contest"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Entry Fee</label>
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Total Spots</label>
                  <input
                    type="number"
                    value={totalSpots}
                    onChange={(e) => setTotalSpots(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Prize Pool</label>
                  <input
                    type="number"
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Contest */}
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

export default Contest;
