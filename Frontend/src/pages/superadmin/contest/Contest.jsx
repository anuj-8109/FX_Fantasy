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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";

const Contest = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewContest, setViewContest] = useState(null);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [totalSpots, setTotalSpots] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [status, setStatus] = useState("upcoming");

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");


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
    { name: "S.No", selector: (row, i) => i + 1, width: "70px" },
    { name: "Name", selector: (row) => row.name, sortable: true, width: "160px" },
    { name: "Description", selector: (row) => row.description, grow: 2 },
    { name: "Type", selector: (row) => row.contest_type },
    { name: "Entry Fee", selector: (row) => row.entry_fee },
    { name: "Total Spots", selector: (row) => row.total_spots },
    { name: "Max/User", selector: (row) => row.max_entry_per_user },
    { name: "Prize Pool", selector: (row) => row.prize_pool },

    {
      name: "Prize Dist.",
      cell: (row) => (
        <div className="text-xs">
          {row.prize_distribution?.map((p, idx) => (
            <div key={idx}>
              #{p.rank}: ₹{p.amount}
            </div>
          ))}
        </div>
      ),
      width: "150px",
    },

    // {
    //   name: "Stocks",
    //   cell: (row) => (
    //     <div className="text-xs">
    //       {row.stocks?.map((s, idx) => (
    //         <div key={idx}>{s.stock_name}</div>
    //       ))}
    //     </div>
    //   ),
    //   width: "120px",
    // },

    {
      name: "Guaranteed",
      selector: (row) => (row.is_guaranteed ? " Yes" : " No"),
      width: "120px",
    },

    {
      name: "Private",
      selector: (row) => (row.is_private ? " Yes" : " No"),
      width: "100px",
    },

    { name: "Code", selector: (row) => row.contest_code, width: "120px" },

    {
      name: "Start Date",
      selector: (row) =>
        row.startdate ? new Date(row.startdate).toLocaleString() : "-",
      width: "180px",
    },
    {
      name: "End Date",
      selector: (row) =>
        row.enddate ? new Date(row.enddate).toLocaleString() : "-",
      width: "180px",
    },

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
          <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full border bg-white peer-checked:translate-x-full transition-transform"></div>
        </label>
      ),
      width: "120px",
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
      width: "100px",
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
      width: "80px",
    },
  ];


  return (
    <Content Page_title="Contest Management" button_title="Back" button_status={true}
      extra_button="Add Contest" extra_button_action={"/superadmin/add-contest"} route="/superadmin/dashboard"
    >
      <div className="p-2 ">

        <div className="shadow-lg rounded-xl p-4">
          <Datatable columns={columns} data={contests} title="Contest List" onRefresh={fetchContests} />
        </div>


        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <AddContest
              token={token}
              onSuccess={() => {
                fetchContests();
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
            />
          </div>
        )}

        {viewOpen && viewContest && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 ">
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
