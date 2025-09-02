import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { FileQuestion, Edit, Eye, Trash2 } from "lucide-react";

import {
  GetFAQsList,
  AddFAQs,
  UpdateFAQs,
  UpdateFAQsStatus,
  DeleteFAQs,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewFAQ, setViewFAQ] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");


  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await GetFAQsList(token);
      if (response?.status) {
        setFaqs(response?.data || []);
      } else {
        toast.error(response?.message || "Failed to load FAQs");
      }
    } catch (error) {
      toast.error("Error fetching FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);


  const handleOpen = (faq = null) => {
    setSelectedFAQ(faq);
    setQuestion(faq?.title || "");
    setAnswer(faq?.description || "");
    setOpen(true);
  };

  // reset modal
  const handleCancel = () => {
    setOpen(false);
    setSelectedFAQ(null);
    setQuestion("");
    setAnswer("");
  };


  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    if (!question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    const confirm = await Swal.fire({
      title: selectedFAQ ? "Update FAQ?" : "Add FAQ?",
      text: selectedFAQ
        ? "Are you sure you want to update this FAQ?"
        : "Are you sure you want to add this FAQ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const data = { title: question, description: answer, add_by };
    if (selectedFAQ) data.id = selectedFAQ._id;

    try {
      setLoading(true);
      let response = selectedFAQ
        ? await UpdateFAQs(token, data)
        : await AddFAQs(token, data);

      if (response?.status) {
        toast.success(response?.message || "FAQ saved successfully");
        fetchFAQs();
        handleCancel();
      } else {
        toast.error(response?.message || "Failed to save FAQ");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleStatusChange = async (faq) => {
    const actionText = faq.status ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} this FAQ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const payload = { id: faq._id, status: (!faq.status).toString() };
      const res = await UpdateFAQsStatus(token, payload);

      if (res?.status) {
        toast.success(res?.message || `FAQ ${actionText}d`);
        fetchFAQs();
      } else {
        toast.error(res?.message || "Failed to change status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };


  const handleDelete = async (faq) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the FAQ.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await DeleteFAQs(token, faq._id);
      if (response?.status) {
        toast.success("FAQ deleted successfully");
        fetchFAQs();
      } else {
        toast.error(response?.message || "Failed to delete FAQ");
      }
    } catch (error) {
      toast.error("Error deleting FAQ");
    }
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Title",
      selector: (row) => row?.title,
      sortable: true,
      wrap: true,
    },
    {
      name: "Description",
      cell: (row) => (
        <div
          className="prose prose-sm max-w-xs truncate"
          dangerouslySetInnerHTML={{ __html: row.description }}
        />
      ),
    },

    {
      name: "Status",
      cell: (row) => (
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
            setViewFAQ(row);
            setViewOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Content Page_title="FAQ Management" button_status={true} button_title="back"
     extra_button="+ Add FAQ" extra_button_action={handleOpen}
    >
      <div className="p-2 ">

        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileQuestion />
            <h1 className="text-2xl font-bold">All FAQs</h1>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded text-white"
            onClick={() => handleOpen()}
          >
            + Add FAQ
          </button>
        </div> */}

        <div className="shadow-lg rounded-xl p-4 bg-white">
          <Datatable columns={columns} data={faqs} title="FAQs List" progressPending={loading} />
        </div>

        {/* Add/Edit Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                {selectedFAQ ? "✏️ Edit FAQ" : "➕ Add FAQ"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">

                {/* Title Input */}
                <div>
                  <label className="text-sm text-gray-600">Title</label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>


                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={answer}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setAnswer(data);
                    }}
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

        {viewOpen && viewFAQ && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ FAQ Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewFAQ(null);
                  }}
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
                  onClick={() => {
                    setViewOpen(false);
                    setViewFAQ(null);
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

export default FAQs;
