import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import {
  GetTournament,
  UpdateTournament,
  DeleteTournament,
  UpdateTournamentStatus,
  UpdateTournamentStatusActive,
  stocklist,
} from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
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
    contest_code: "",
    startdate: "",
    useamount: "",
    enddate: "",
    status: "upcoming",
    stocks: [{ stock_id: "", stock_name: "" }],
  });

  const [stocklistData, setStocklistData] = useState([]);
  const [searchResults, setSearchResults] = useState({});
  const [inputValues, setInputValues] = useState({}); // Separate state for input display

  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  // Fetch stock list on component mount
  useEffect(() => {
    fetchStockList();
  }, []);

  const fetchStockList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await stocklist(token);
      if (res?.status) {
        setStocklistData(res?.data || []);
      } else {
        Swal.fire("Failed to fetch stocks");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (data) => {
    setEditData(data);
    const stocks =
      data?.stocks && data.stocks.length > 0
        ? data.stocks
        : [{ stock_id: "", stock_name: "" }];

    setFormData({
      name: data?.name || "",
      description: data?.description || "",
      useamount: data?.useamount || "",
      startdate: data
        ? new Date(data.startdate).toISOString().slice(0, 16)
        : "",
      enddate: data ? new Date(data.enddate).toISOString().slice(0, 16) : "",
      status: data?.status || "upcoming",
      stocks: stocks,
    });

    // Initialize input values with stock names
    const initialInputs = {};
    stocks.forEach((stock, idx) => {
      initialInputs[idx] = stock.stock_name || "";
    });
    setInputValues(initialInputs);
    setSearchResults({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setSearchResults({});
    setInputValues({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Stock management functions
  const addStockRow = () => {
    if (formData.stocks.length >= 2) {
      toast.error("You can add maximum 2 stocks only");
      return;
    }
    const newIndex = formData.stocks.length;
    setFormData((prev) => ({
      ...prev,
      stocks: [...prev.stocks, { stock_id: "", stock_name: "" }],
    }));
    setInputValues((prev) => ({ ...prev, [newIndex]: "" }));
  };

  const removeStockRow = (i) => {
    setFormData((prev) => ({
      ...prev,
      stocks: prev.stocks.filter((_, idx) => idx !== i),
    }));
    setInputValues((prev) => {
      const updated = { ...prev };
      delete updated[i];
      // Reindex remaining inputs
      const newInputs = {};
      Object.keys(updated).forEach((key, idx) => {
        if (parseInt(key) > i) {
          newInputs[parseInt(key) - 1] = updated[key];
        } else {
          newInputs[key] = updated[key];
        }
      });
      return newInputs;
    });
    setSearchResults((prev) => {
      const updated = { ...prev };
      delete updated[i];
      return updated;
    });
  };

  const handleInputChange = (i, value) => {
    // Update input display value
    setInputValues((prev) => ({ ...prev, [i]: value }));

    // Filter suggestions
    let filtered = stocklistData;
    if (value.length > 0) {
      filtered = stocklistData.filter((s) =>
        s.symbol.toLowerCase().includes(value.toLowerCase())
      );
    }
    setSearchResults((prev) => ({ ...prev, [i]: filtered }));
  };

  const handleInputFocus = (i) => {
    // Show all stocks on focus
    setSearchResults((prev) => ({ ...prev, [i]: stocklistData }));
  };

  const handleSelectStock = (i, stock) => {
    const updated = [...formData.stocks];
    updated[i] = {
      stock_id: stock._id,
      stock_name: stock.symbol,
      instrument_token: stock.instrument_token,
      lotsize: stock.lotsize,
    };
    setFormData((prev) => ({ ...prev, stocks: updated }));
    setInputValues((prev) => ({ ...prev, [i]: stock.symbol }));
    setSearchResults((prev) => ({ ...prev, [i]: [] }));
  };

  const handleUpdate = async () => {
    // Check if any change is made
    const isChanged =
      formData.name !== editData.name ||
      formData.description !== editData.description ||
      formData.useamount !== editData.useamount ||
      formData.startdate !==
        new Date(editData.startdate).toISOString().slice(0, 16) ||
      formData.enddate !==
        new Date(editData.enddate).toISOString().slice(0, 16) ||
      JSON.stringify(formData.stocks) !== JSON.stringify(editData.stocks);

    if (!isChanged) {
      Swal.fire({
        icon: "info",
        title: "No changes made",
        text: "You haven't changed any data to update.",
      });
      return;
    }

    // Validate stocks - check if input value matches selected stock
    const hasInvalidStock = formData.stocks.some((s, idx) => {
      const inputVal = inputValues[idx] || "";
      // If input value doesn't match stock_name OR stock_id is empty
      return !s.stock_id || inputVal !== s.stock_name;
    });

    if (hasInvalidStock) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select valid stocks from suggestions",
      });
      return;
    }

    if (formData.stocks.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "At least one stock is required",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update this tournament?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "custom-swal-popup",
          title: "text-xl font-semibold text-white-800",
          confirmButton:
            "px-2 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
          cancelButton:
            "px-2 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
        },
      });

      if (result.isConfirmed) {
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
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this tournament?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
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

    const confirm = await Swal.fire({
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
    {
      name: "Name",
      selector: (row) => row.name,
      exportValue: (row) => row.name || "N/A",
      export: true,
      sortable: true,
      width: "180px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      exportValue: (row) => row.status || "N/A",
      export: true,
      width: "100px",
    },
    {
      name: "Stock",
      selector: (row) =>
        row.stocks && row.stocks.length > 0
          ? row.stocks.map((s) => s.stock_name).join(", ")
          : "N/A",
      exportValue: (row) => row.stocks || "N/A",
      export: true,
      width: "150px",
    },
    {
      name: "Virtual Amount",
      selector: (row) => row.useamount || "N/A",
      exportValue: (row) => row.useamount || "N/A",
      export: true,
      width: "120px",
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startdate).toLocaleString(),
      exportValue: (row) => row.startdate || "N/A",
      export: true,
      sortable: true,
      width: "155px",
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.enddate).toLocaleString(),
      exportValue: (row) => row.enddate || "N/A",
      export: true,
      sortable: true,
      width: "155px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <Edit
            className={`cursor-pointer ${
              row.status === "live" || row.status === "completed"
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600"
            }`}
            onClick={() => {
              if (row.status === "live" || row.status === "completed") return; // Disable click
              openModal(row);
            }}
          />
        </div>
      ),
      export: false,
      width: "70px",
    },
    {
      name: "View",
      cell: (row) => (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() =>
            navigate("/superadmin/tournamentcontest", {
              state: { tournament_id: row._id },
            })
          }
        >
          View Contest
        </button>
      ),
      export: false,
      width: "140px",
    },
    {
      name: "Contest",
      cell: (row) => (
        <div>
          <button
            className={`px-4 py-2 rounded text-white transition ${
              row.status === "upcoming"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={row.status !== "upcoming"}
            onClick={() => {
              if (row.status === "upcoming") {
                navigate("/superadmin/add-contest", {
                  state: { tournament_id: row._id },
                });
              }
            }}
          >
            Add Contest
          </button>
        </div>
      ),
      export: false,
      width: "140px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      exportValue: (row) => row.description || "N/A",
      export: true,
    },
  ];

  const handlePageChange = (page) => setCurrentPage(page);

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (text) => {
    setFilterText(text);
    fatchTournament({ page: 1, limit: rowsPerPage, filter: text });
  };

  const paginatedData = tournament.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
        if (start > now) newStatus = "upcoming";
        else if (start <= now && end >= now) newStatus = "live";
        else if (end < now) newStatus = "completed";

        return { ...t, status: newStatus };
      });

      setTournament(updatedData);
      setTotalRows(updatedData.length);
    } else {
      toast.error(res?.message || "Failed to fetch");
    }
    setLoading(false);
  };

  useEffect(() => {
    fatchTournament({
      page: currentPage,
      limit: rowsPerPage,
      filter: filterText,
    });
  }, []);

  return (
    <Content
      Page_title="Tournament"
      button_title="Back"
      button_status={true}
      route="/superadmin/dashboard"
      extra_button="Add Tournament"
      extra_button_action="/superadmin/add-tournament"
    >
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Datatable
            columns={columns}
            data={paginatedData}
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRefresh={fatchTournament}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 mt-10">
          <div className="bg-white p-6 rounded-md w-[700px] max-h-[80vh] overflow-y-auto hide-scrollbar">
            <h2 className="text-lg font-bold mb-4">Edit Tournament</h2>
            <div className="grid gap-3">
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tournament Name"
                className="border p-2 rounded"
              />

              <label className="text-sm font-medium">Description</label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData((prev) => ({ ...prev, description: data }));
                }}
              />

              {/* Stocks Section */}
              <div>
                <h3 className="font-medium mb-2">Stocks *</h3>
                {formData.stocks?.map((s, idx) => (
                  <div key={idx} className="mb-4 relative">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Search stock by symbol"
                        value={inputValues[idx] || ""}
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                        onFocus={() => handleInputFocus(idx)}
                        className="w-full border rounded-md px-2 py-1"
                      />
                      {formData.stocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStockRow(idx)}
                          className="text-red-600 text-sm px-2"
                        >
                          X
                        </button>
                      )}
                    </div>

                    {/* Suggestions List */}
                    {searchResults[idx]?.length > 0 && (
                      <ul className="absolute z-10 bg-white border rounded-md shadow max-h-40 overflow-y-auto w-full mt-1">
                        {searchResults[idx].slice(0, 500).map((stock) => (
                          <li
                            key={stock._id}
                            onClick={() => handleSelectStock(idx, stock)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            {stock.symbol} ({stock.tradesymbol})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {formData.stocks.length < 2 && (
                  <button
                    type="button"
                    onClick={addStockRow}
                    className="text-blue-600 text-sm"
                  >
                    + Add Stock
                  </button>
                )}
              </div>

              <label className="text-sm font-medium">Use Amount</label>
              <input
                name="useamount"
                value={formData.useamount}
                onChange={handleChange}
                placeholder="Use Amount"
                className="border p-2 rounded"
              />

              <label className="text-sm font-medium">Start Date</label>
              <input
                type="datetime-local"
                name="startdate"
                value={formData.startdate}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <label className="text-sm font-medium">End Date</label>
              <input
                type="datetime-local"
                name="enddate"
                value={formData.enddate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6 sticky bg-white py-2">
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
