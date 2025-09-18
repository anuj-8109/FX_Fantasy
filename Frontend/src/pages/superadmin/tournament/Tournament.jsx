import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { GetTournament, UpdateTournament, DeleteTournament, UpdateTournamentStatus, UpdateTournamentStatusActive } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function Tournament() {
    const navigate = useNavigate();
    const [tournament, setTournament] = useState([]);
    const [loading, setLoading] = useState(false);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        contest_type: "Mega",
        entry_fee: "",
        total_spots: "",
        max_entry_per_user: 1,
        // prize_pool: "",
        contest_code: "",
        startdate: "",
        enddate: "",
        status: "upcoming",
    });

    const openModal = (data) => {
        setEditData(data);
        setFormData({
            name: data?.name || "",
            description: data?.description || "",
            contest_type: data?.contest_type || "Mega",
            entry_fee: data?.entry_fee || "",
            total_spots: data?.total_spots || "",
            max_entry_per_user: data?.max_entry_per_user || 1,
            // prize_pool: data?.prize_pool || "",
            contest_code: data?.contest_code || "",
            startdate: data ? new Date(data.startdate).toISOString().slice(0, 16) : "",
            enddate: data ? new Date(data.enddate).toISOString().slice(0, 16) : "",
            status: data?.status || "upcoming",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditData(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                id: editData._id,
            };

            const response = await UpdateTournament(payload, token);

            if (response?.status) {
                toast.success("Tournament updated successfully!");
                closeModal();
                fatchTournament();
            } else {
                toast.error(response?.message || "Update failed!");
            }
        } catch (err) {
            toast.error("Something went wrong!");
        }
    };


    const handleDelete = async (row) => {
        if (await swal.fire("Are you sure you want to delete this tournament?")) {
            const token = localStorage.getItem("token");
            const res = await DeleteTournament(row._id, token);
            if (res?.status) {
                toast.success("Deleted successfully!");
                fatchTournament();
            } else {
                toast.error(res?.message || "Failed to delete");
            }
        }
    };

    const handleStatusChange = async (tournament) => {
        const token = localStorage.getItem("token");
        const actionText = tournament.status === "live" ? "Deactivate" : "Activate";

        const confirm = await swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${actionText} this tournament?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText}`,
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        const payload = {
            id: tournament._id,
            status: tournament.status === "live" ? "inactive" : "live",
        };

        try {
            const res = await UpdateTournamentStatus(payload, token);

            if (res?.status) {
                toast.success(res?.message || `Tournament ${actionText}d`);
                fatchTournament();
            } else {
                toast.error(res?.message || "Failed to change status");
            }
        } catch (err) {
            toast.error("Something went wrong!");
        }
    };


    const columns = [
        { name: "Sr No.", selector: (row, i) => i + 1, width: "80px" },
        { name: "Name", selector: (row) => row.name, sortable: true },
        // { name: "Description", selector: (row) => row.description },
        // { name: "Type", selector: (row) => row.contest_type },
        // { name: "Entry Fee", selector: (row) => `₹${row.entry_fee}` },
        // { name: "Total Spots", selector: (row) => row.total_spots },
        // { name: "Max Entry/User", selector: (row) => row.max_entry_per_user },
        // { name: "Prize Pool", selector: (row) => `₹${row.prize_pool}` },
        // {
        //     name: "Status",
        //     cell: (row) => (
        //         <label className="relative inline-flex items-center cursor-pointer">
        //             <input
        //                 type="checkbox"
        //                 checked={row.status === "live"}
        //                 onChange={() => handleStatusChange(row)}
        //                 className="sr-only peer"
        //             />
        //             <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
        //             <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full border bg-white peer-checked:translate-x-full transition-transform"></div>
        //         </label>

        //     ),
        //     width: "120px",
        // },
        { name: "Status", selector: (row) => row.status },
        {
            name: "Start Date",
            selector: (row) => new Date(row.startdate).toLocaleString(),
            sortable: true,
        },
        {
            name: "End Date",
            selector: (row) => new Date(row.enddate).toLocaleString(),
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex gap-3">
                    <Edit
                        className="cursor-pointer text-blue-600"
                        onClick={() => openModal(row)}
                    />
                    <Trash2
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDelete(row)}
                    />
                </div>
            ),
        },
        {
            name: "Contest",
            cell: (row) => (
                <div>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={() =>
                            navigate("/superadmin/add-contest", {
                                state: { tournament_id: row._id },
                            })
                        }
                    >
                        Add Contest
                    </button>
                </div>
            ),
            width: "140px",
        },


    ];


    const fatchTournament = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await GetTournament(token);

        if (res?.status) {
            const now = new Date();

            const updatedData = res.data.map((t) => {
                const start = new Date(t.startdate);
                const end = new Date(t.enddate);

                let newStatus = t.status;

                if (start > now) {
                    newStatus = "upcoming";
                } else if (start <= now && end >= now) {
                    newStatus = "live";
                } else if (end < now) {
                    newStatus = "completed"; 
                }

                return { ...t, status: newStatus };
            });

            setTournament(updatedData);
        } else {
            toast.error(res?.message || "Failed to fetch");
        }
        setLoading(false);
    };


    useEffect(() => {
        fatchTournament();
    }, []);

    return (
        <Content
            Page_title="Tournament"
            button_title="back"
            button_status={true}
            route="/superadmin/dashboard"
            extra_button="Add Tournament"
            extra_button_action="/superadmin/add-tournament"
        >
            <div>
                {loading ? <p>Loading...</p> : <Datatable columns={columns} data={tournament} onRefresh={fatchTournament} />}
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 mt-10 ">
                    <div className="bg-white p-6 rounded-md w-[500px] max-h-[80vh] overflow-y-auto hide-scrollbar">
                        <h2 className="text-lg font-bold mb-4">Edit Tournament</h2>
                        <div className="grid gap-3">
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Tournament Name"
                                className="border p-2 rounded"
                            />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border p-2 rounded"
                            />
                            <input
                                name="entry_fee"
                                value={formData.entry_fee}
                                onChange={handleChange}
                                placeholder="Entry Fee"
                                className="border p-2 rounded"
                            />
                            <input
                                name="total_spots"
                                value={formData.total_spots}
                                onChange={handleChange}
                                placeholder="Total Spots"
                                className="border p-2 rounded"
                            />
                            <input
                                name="prize_pool"
                                value={formData.prize_pool}
                                onChange={handleChange}
                                placeholder="Prize Pool"
                                className="border p-2 rounded"
                            />
                            <input
                                type="datetime-local"
                                name="startdate"
                                value={formData.startdate}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                            <input
                                type="datetime-local"
                                name="enddate"
                                value={formData.enddate}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6 sticky  bg-white py-2">
                            <button
                                className="px-4 py-2 bg-gray-400 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Content>
    );
}

export default Tournament;
