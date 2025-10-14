import React, { useState, useEffect } from "react";
import Content from "../../../components/superadmin/Content";
import Datatable from "../../../extracomponents/Datatable";
import {
  withdrawalPayoutrequest,
  payoutlist,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const WithdrawalRequest = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const tabs = [
    { label: "Pending", status: 0 },
    { label: "Complete", status: 1 },
    { label: "Reject", status: 2 },
  ];

  const statusMap = {
    0: "Pending",
    1: "Complete",
    2: "Reject",
  };
  // Inside your component
  const filteredTransactions = transactions.filter(
    (t) => statusMap[t.status] === activeTab
  );

  const fetchTransactions = async (status) => {
    try {
      setLoading(true);
      const res = await payoutlist(token, { status });
      if (res?.status) {
        setTransactions(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setTransactions([]);
        toast.error(res?.message || "No transactions found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectedTab = tabs.find((t) => t.label === activeTab);
    if (selectedTab) fetchTransactions(selectedTab.status);
  }, [activeTab]);

  const handleUpdateStatus = async (transaction, newStatus) => {
    const actionText = newStatus === 1 ? "Approve" : "Reject";

    const confirm = await Swal.fire({
      title: `${actionText} Transaction?`,
      text: `Do you want to ${actionText.toLowerCase()} this transaction of ₹${transaction.amount
        }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",

      },
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const res = await withdrawalPayoutrequest(token, {
        payoutRequestId: transaction._id,
        status: String(newStatus),
        remark: actionText,
      });

      if (res?.status) {
        toast.success(res.message || "Status updated successfully");
        fetchTransactions(tabs.find((t) => t.label === activeTab)?.status);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    // {
    //   name: "S.No",
    //   selector: (row, index) => index + 1,
    //   width: "80px",
    // },
    // { name: "ID", selector: (row) => row._id },
    {
      name: "Client Name",
      selector: (row) => row.client_details.FullName || "N/A",
      exportValue: (row) => row.client_details.FullName || "N/A",
      export: true,
      width: "150px",
    },
    {
      name: "E-mail",
      selector: (row) => row.client_details.Email || "N/A",
      exportValue: (row) => row.client_details.Email || "N/A",
      export: true,
      width: "150px",
    },
    {
      name: "Phone No",
      selector: (row) => row.client_details.PhoneNo || "N/A",
      exportValue: (row) => row.client_details.PhoneNo || "N/A",
      export: true,
      width: "110px",
    },

    {
      name: "Amount",
      selector: (row) => `₹${row.amount}` || "N/A",
      exportValue: (row) => row.amount || "N/A",
      export: true,
      width: "80px",
    },

    {
      name: "Date and Time",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      exportValue: (row) => new Date(row.created_at).toLocaleString() || "N/A",
      export: true,
      width: "160px",
    },
    // {
    //   name: "Updated At",
    //   selector: (row) => new Date(row.updated_at).toLocaleString(),
    // },
    {
      name: "Status",
      selector: (row) => statusMap[row.status],
      exportValue: (row) => statusMap[row.status],
      export: true,
    },
    {
      name: "Action",
      cell: (row) =>
        row.status === 0 ? (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={() => handleUpdateStatus(row, 1)}
            >
              Approve
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => handleUpdateStatus(row, 2)}
            >
              Reject
            </button>
          </div>
        ) : (
          <span>—</span>
        ),
      width: "180px",
      export: false,
    },
  ];

  return (
    <Content
      Page_title="Withdrawal Requests"
      button_status={true}
      button_title="Back"
      route={"/superadmin/dashboard"}
    >
      <div className="p-4">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-2 font-medium ${activeTab === tab.label
                  ? "text-white bg-sky-600 rounded-t-lg"
                  : "text-gray-600 hover:text-gray-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Datatable */}
        <div className="shadow-lg rounded-xl p-4">
          <Datatable
            columns={columns}
            data={filteredTransactions}
            title="Withdrawal List"
            loading={loading}
            onRefresh={() =>
              fetchTransactions(tabs.find((t) => t.label === activeTab)?.status)
            }
          />
        </div>
      </div>
    </Content>
  );
};

export default WithdrawalRequest;
