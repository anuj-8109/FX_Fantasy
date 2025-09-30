import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import { Edit, Eye, Trash2 } from "lucide-react";
import {
  AddClient,
  GetClientsWithFilter,
  DeleteClient,
  UpdateClientStatus,
  UpdateClient,
  getState,
  getStateByCity,
  getBankdetails,
  kyc_verification
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [dob, setDob] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [bankOpen, setBankOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");


  let stateObj = states.find((s) => s._id === stateId);
  let cityObj = cities.find((c) => c._id === cityId);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchClients({ page, limit: rowsPerPage, filter: filterText });
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(page);
    fetchClients({ page, limit: newPerPage, filter: filterText });
  };


  const handleFilterChange = (text) => {
    setFilterText(text);
    fetchClients({ page: 1, limit: rowsPerPage, filter: text }); // reset to page 1
  };

  function isValidAge(dob, minAge = 18) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge;
  }


  // Fetch clients
  const fetchClients = async () => {
    setLoading(true);
    const data = { status: "", kyc_verification: "", search: "", add_by: "", page: currentPage, limit: rowsPerPage }
    const response = await GetClientsWithFilter(token, data);
    if (response?.status) {
      setClients(response?.data);
      setTotalRows(response?.pagination.totalRecords);
    } else toast.error(response?.message || "Failed to load clients");
    setLoading(false);
  };

  const fetchBankDetails = async (client_id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await getBankdetails(token, client_id);
      if (res?.status) {
        setBankDetails(res?.data || []);
        setBankOpen(true);
      } else {
        toast.error(res?.message || "Failed to fetch bank details");
      }
    } catch (error) {
      toast.error("Error fetching bank details");
    }
  };

  // Fetch states
  const fetchStates = async () => {
    try {
      const res = await getState(token);
      setStates(res || []);
    } catch (error) {
      toast.error("Failed to load states");
    }
  };


  const fetchCities = async (stateName) => {
    try {
      if (!stateName) return setCities([]);
      const res = await getStateByCity(stateName, token);
      console.log("cities response:", res);
      setCities(res || []);
    } catch (error) {
      toast.error("Failed to load cities");
    }
  };



  useEffect(() => {
    fetchClients({ currentPage, rowsPerPage, filterText });
    fetchStates();
  }, [currentPage, rowsPerPage, filterText]);

  const handleOpen = (client = null) => {
    setSelectedClient(client);
    setFullName(client?.FullName || "");
    setEmail(client?.Email || "");
    setPhoneNo(client?.PhoneNo || "");
    setStateId(client?.stateId || "");
    setCityId(client?.cityId || "");
    setDob(client?.dob || "");

    if (client?.stateId) {
      const stateObj = states.find((s) => s._id === client.stateId);
      if (stateObj) fetchCities(stateObj.name);
    }

    setOpen(true);
  };


  const handleCancel = () => {
    setOpen(false);
    setSelectedClient(null);
    setFullName("");
    setEmail("");
    setPhoneNo("");
    setStateId("");
    setCityId("");
    setDob("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!dob) {
      toast.error("Please enter Date of Birth");
      return;
    }

    if (!isValidAge(dob, 18)) {
      toast.error("Client must be at least 18 years old");
      return;
    }

    if (!stateId) {
      toast.error("Please select state");
      return;
    }

    const confirm = await Swal.fire({
      title: selectedClient ? "Update Client?" : "Add Client?",
      text: selectedClient
        ? "Are you sure you want to update this client?"
        : "Are you sure you want to add this client?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const stateObj = states.find((s) => s._id === stateId);
    const cityObj = cities.find((c) => c._id === cityId);

    let payload = {
      add_by,
      FullName: fullName,
      Email: email,
      PhoneNo: phoneNo,
      state: stateObj?.name || "",
      city: cityObj?.city || "",
      dob,
    };
    if (selectedClient) payload.id = selectedClient._id;

    setLoading(true);
    let response;
    if (selectedClient) response = await UpdateClient(token, payload);
    else response = await AddClient(token, payload);

    if (response?.status) {
      toast.success(response?.message || "Saved successfully");
      fetchClients();
      handleCancel();
    } else toast.error(response?.message || "Failed to save");

    setLoading(false);
  };


  const handleStatusChange = async (client) => {
    const actionText = client.ActiveStatus === 1 ? "Deactivate" : "Activate";
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this client?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const res = await UpdateClientStatus(token, {
      id: client._id,
      status: client.ActiveStatus === 1 ? "0" : "1",
    });

    if (res?.status) {
      toast.success(res?.message || `Client ${actionText}d`);
      fetchClients();
    } else toast.error(res?.message || "Failed to change status");
  };

  const handleDelete = async (client) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this client?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    const res = await DeleteClient(token, client._id);
    if (res?.status) {
      toast.success(res?.message || "Client deleted successfully");
      fetchClients();
    } else toast.error(res?.message || "Failed to delete client");
  };

  const handleKycVerification = async (clientId, status) => {
    const actionText = status === 1 ? "Approve" : "Reject";

    const confirm = await Swal.fire({
      title: `${actionText} KYC?`,
      text: `Do you really want to ${actionText.toLowerCase()} this KYC?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await kyc_verification(token, {
        id: clientId,
        kyc_verification: status,
      });

      if (res?.status) {
        toast.success(res?.message || `KYC ${actionText}d successfully`);
        fetchClients(); // refresh list
      } else {
        toast.error(res?.message || "Failed to update KYC status");
      }
    } catch (error) {
      toast.error("Error updating KYC status");
    }
  };


  const columns = [
    { name: "Name", selector: (row) => row.FullName || "N/A", sortable: true },
    { name: "Email", selector: (row) => row.Email || "N/A" },
    { name: "Phone", selector: (row) => row.PhoneNo || "N/A" },
    { name: "City", selector: (row) => row.city || "N/A" },
    { name: "State", selector: (row) => row.state || "N/A" },
    {
      name: "Status",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row?.ActiveStatus === 1}
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
          <Edit className="cursor-pointer text-blue-600" onClick={() => handleOpen(row)} />
          <Trash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(row)} />
        </div>
      ),
    },
    {
      name: "KYC",
      width: "180px",
      cell: (row) => (
        <div className="flex gap-2">
          {row.kyc_type === 1 ? (
            row.kyc_verification === 1 ? (
              <span className="text-green-600 font-semibold">Verified ✅</span>
            ) : row.kyc_verification === 2 ? (
              <span className="text-red-600 font-semibold">Rejected ❌</span>
            ) : (
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 bg-green-600 text-white rounded-md text-sm"
                  onClick={() => handleKycVerification(row, 1)}
                >
                  Approve
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded-md text-sm"
                  onClick={() => handleKycVerification(row, 2)}
                >
                  Reject
                </button>
              </div>
            )
          ) : (
         
            row.kyc_verification === 1 ? (
              <span className="text-green-600 font-semibold">Verified ✅</span>
            ) : row.kyc_verification === 2 ? (
              <span className="text-red-600 font-semibold">Rejected ❌</span>
            ) : (
              <span className="text-gray-500 font-semibold">Pending ⏳</span>
            )
          )}
        </div>
      ),
    },


    {
      name: "Bank Details",
      width: "120px",
      cell: (row) => (
        <button
          className="px-2 py-1 bg-purple-600 text-white rounded-md text-sm"
          onClick={() => fetchBankDetails(row._id)}
        >
          View Banks
        </button>
      ),

    },

    {
      name: "View",
      cell: (row) => (
        <Eye
          className="cursor-pointer text-green-600"
          size={20}
          onClick={() => {
            setViewClient(row);
            setViewOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Content
      Page_title="Client Management"
      button_title="Back"
      button_status={true}
      route={"/superadmin/dashboard"}
      extra_button="Add client"
      extra_button_action={() => handleOpen(null)}
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          {/* <Datatable columns={columns}
           data={clients} 
           title="Client List"
            onRefresh={fetchClients} /> */}
          <Datatable
            columns={columns}
            data={clients}
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            filterText={filterText}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Add/Edit Client Modal */}
        {open && (
          <div className="fixed mt-5 inset-0 flex items-center justify-center z-50 bg-opacity-40">
            <div className="w-lg max-h-[80vh] overflow-y-auto Add-client-style shadow-2xl p-6 hide-scrollbar client-style">
              <h2 className="text-lg font-semibold border-b pb-2">
                {selectedClient ? "✏️ Edit Client" : "➕ Add Client"}
              </h2>

              <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  />
                </div>

                <div>
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  />
                </div>

                <div>
                  <label className="text-sm">Phone No</label>
                  <input
                    type="text"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ""))} 
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  />
                </div>

                <div>
                  <label className="text-sm">State</label>
                  <select
                    value={stateId}
                    onChange={(e) => {
                      const selectedStateId = e.target.value;
                      setStateId(selectedStateId);
                      setCityId("");

                      const stateObj = states.find((s) => s._id === selectedStateId);
                      if (stateObj) fetchCities(stateObj.name);
                      else setCities([]);
                    }}
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>


                </div>

                <div>
                  <label className="text-sm">City</label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.city}
                      </option>
                    ))}
                  </select>

                </div>


                <div>
                  <label className="text-sm">DOB</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  />
                </div>

                <div className="col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
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

        {bankOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 overflow-auto max-h-[80vh]">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>🏦 Bank Details</span>
                <button
                  onClick={() => {
                    setBankOpen(false);
                    setBankDetails([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              {bankDetails.length > 0 ? (
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2 border">#</th>
                      <th className="px-4 py-2 border">Bank Name</th>
                      <th className="px-4 py-2 border">Branch Name</th>
                      <th className="px-4 py-2 border">Account No</th>
                      <th className="px-4 py-2 border">IFSC</th>
                      {/* <th className="px-4 py-2 border">Status</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {bankDetails.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{item.name}</td>
                        <td className="px-4 py-2 border">{item.branch}</td>
                        <td className="px-4 py-2 border">{item.accountno}</td>
                        <td className="px-4 py-2 border">{item.ifsc}</td>
                        {/* <td className="px-4 py-2 border">
                          {item.status == "approved" ? (
                            <span className="text-green-600 font-semibold">Approved</span>
                          ) : (
                            <span className="text-yellow-600 font-semibold">Pending</span>
                          )}
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No bank details found.</p>
              )}
            </div>
          </div>
        )}


        {/* View Client */}
        {viewOpen && viewClient && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ Client Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewClient(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-3">
                <p>
                  <strong>Name:</strong> {viewClient?.FullName || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {viewClient?.Email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {viewClient?.PhoneNo || "N/A"}
                </p>
                <p>
                  <strong>City:</strong> {viewClient?.city || "N/A"}
                </p>
                <p>
                  <strong>State:</strong> {viewClient?.state || "N/A"}
                </p>
                <p>
                  <strong>DOB:</strong> {viewClient?.dob || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {viewClient?.status || "N/A"}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewClient(null);
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

export default Client;
