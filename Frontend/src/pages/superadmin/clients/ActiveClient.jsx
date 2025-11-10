import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/DatatablePagination";
import {
  GetClientsWithFilter,
  getBankdetails,
  kyc_verification,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";

const ActiveClient = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch only Active Clients
  const fetchClients = async () => {
    setLoading(true);
    const data = {
      status: "1", // 👈 only active clients
      kyc_verification: "",
      search: filterText,
      add_by: "",
      page: currentPage,
      limit: rowsPerPage,
    };

    const response = await GetClientsWithFilter(token, data);
    if (response?.status) {
      setClients(response?.data);
      setTotalRows(response?.pagination?.totalRecords || 0);
    } else {
      toast.error(response?.message || "Failed to load active clients");
    }
    setLoading(false);
  };

  // ✅ Bank details
  const fetchBankDetails = async (client_id) => {
    try {
      const res = await getBankdetails(token, client_id);
      if (res?.status) {
        setBankDetails(res?.data || []);
        setBankOpen(true);
      } else toast.error(res?.message || "Failed to fetch bank details");
    } catch (error) {
      toast.error("Error fetching bank details");
    }
  };

  // ✅ KYC Verification
  const handleKycVerification = async (client, status) => {
    const actionText = status === 1 ? "Approve" : "Reject";

    const confirm = await Swal.fire({
      title: `${actionText} KYC?`,
      text: `Do you really want to ${actionText.toLowerCase()} this KYC?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-swal-popup",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await kyc_verification(token, {
        id: client._id,
        kyc_verification: status,
      });

      if (res?.status) {
        toast.success(res?.message || `KYC ${actionText}d successfully`);
        fetchClients();
      } else {
        toast.error(res?.message || "Failed to update KYC status");
      }
    } catch (error) {
      toast.error("Error updating KYC status");
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, rowsPerPage, filterText]);

  // ✅ Columns — no Status or Action column now
  const columns = [
    {
      name: "Name",
      selector: (row) => row.FullName || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.Email || "N/A",
      width: "250px",
    },
    {
      name: "Phone",
      selector: (row) => row.PhoneNo || "N/A",
      width: "120px",
    },
    {
      name: "City",
      selector: (row) => row.city || "N/A",
      width: "120px",
    },
    {
      name: "State",
      selector: (row) => row.state || "N/A",
      width: "180px",
    },
    {
      name: "DOB",
      selector: (row) => row.dob || "N/A",
      width: "120px",
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
      name: "KYC",
      width: "170px",
      selector: (row) =>
        row.kyc_verification === 1
          ? "Verified"
          : row.kyc_verification === 2
          ? "Rejected"
          : "Pending",
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
          ) : row.kyc_verification === 1 ? (
            <span className="text-green-600 font-semibold">Verified ✅</span>
          ) : row.kyc_verification === 2 ? (
            <span className="text-red-600 font-semibold">Rejected ❌</span>
          ) : (
            <span className="text-gray-500 font-semibold">Pending ⏳</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Content
      Page_title="Active Clients"
      button_title="Back"
      button_status={true}
      route={"/superadmin/dashboard"}
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          <Datatable
            columns={columns}
            data={clients}
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
            filterText={filterText}
            onFilterChange={setFilterText}
            onRefresh={fetchClients}
          />
        </div>

        {/* Bank Details Modal */}
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
                      <th className="px-4 py-2 border">Branch</th>
                      <th className="px-4 py-2 border">Account No</th>
                      <th className="px-4 py-2 border">IFSC</th>
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
      </div>
    </Content>
  );
};

export default ActiveClient;
