import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Datatable from "../../../extracomponents/Datatable";
import Content from "../../../components/superadmin/Content";
import { GetFAQsList, UpdateFAQsStatus, DeleteFAQs } from "../../../services/SuperAdmin";
import { Edit, Trash2, Eye } from "lucide-react";

const FAQs = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewFAQ, setViewFAQ] = useState(null);

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await GetFAQsList(token);
      if (response?.status) setFaqs(response?.data || []);
      else toast.error(response?.message || "Failed to load FAQs");
    } catch {
      toast.error("Error fetching FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Toggle status
  const handleStatusChange = async (faq) => {
    const actionText = faq.status ? "Deactivate" : "Activate";
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} this FAQ?`,
      icon: "warning",
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
      const payload = { id: faq._id, status: (!faq.status).toString() };
      const res = await UpdateFAQsStatus(token, payload);
      if (res?.status) toast.success(res?.message || `FAQ ${actionText}d`);
      else toast.error(res?.message || "Failed to update status");
      fetchFAQs();
    } catch {
      toast.error("Error updating status");
    }
  };

  // Delete FAQ
  const handleDelete = async (faq) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the FAQ.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
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
      const res = await DeleteFAQs(token, faq._id);
      if (res?.status) toast.success("FAQ deleted successfully");
      else toast.error(res?.message || "Failed to delete FAQ");
      fetchFAQs();
    } catch {
      toast.error("Error deleting FAQ");
    }
  };

  const columns = [
    {
      name: "Title",
      selector: row => row.title,
      sortable: true,
      exportValue: row => row.title || "N/A",
    },
    {
      name: "Description",
      selector: row => row.description,
      exportValue: row => row.description || "N/A",
      cell: row => (
        <div className="prose prose-sm max-w-xs truncate" dangerouslySetInnerHTML={{ __html: row.description }} />
      ),
    },
    {
      name: "Status",
      selector: row => row.status,
      exportValue: row => (row.status ? "Active" : "Inactive"),
      cell: row => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.status === true}
            onChange={() => handleStatusChange(row)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-300 peer-focus:ring-2 peer-focus:ring-green-300"></div>
          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
        </label>
      ),
    },
    {
      name: "Action",
      cell: row => (
        <div className="flex gap-3">
          <Edit className="cursor-pointer text-blue-600" onClick={() => navigate("/superadmin/add-faq", { state: { faq: row } })} />
          <Trash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(row)} />
        </div>
      ),
      export: false,
    },
    {
      name: "View",
      cell: row => (
        <Eye
          className="cursor-pointer text-green-600"
          size={20}
          onClick={() => {
            setViewFAQ(row);
            setViewOpen(true);
          }}
        />
      ),
      export: false,
    },
  ];

  return (
    <Content
      Page_title="FAQ Management"
      button_status={true}
      button_title="Back"
      extra_button="+ Add FAQ"
      extra_button_action={() => navigate("/superadmin/add-faq")}
      route="/superadmin/dashboard"
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          <Datatable
            columns={columns}
            data={faqs}
            title="FAQs List"
            progressPending={loading}
            onRefresh={fetchFAQs}
          />
        </div>

        {/* View FAQ Modal */}
        {viewOpen && viewFAQ && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ FAQ Details</span>
                <button
                  onClick={() => { setViewOpen(false); setViewFAQ(null); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Title:</h3>
                  <p className="text-gray-600">{viewFAQ.title}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">Description:</h3>
                  <div
                    className="prose prose-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: viewFAQ.description }}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => { setViewOpen(false); setViewFAQ(null); }}
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

export default FAQs;
