import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { FileText, Edit, Eye } from "lucide-react";
import {
  GetContentList,
  AddContent,
  UpdateContent,
  UpdateContentStatus,
  GetContentDetails,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Content from "../../../components/superadmin/Content";

const Contents = () => {
  const [contents, setContents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewContent, setViewContent] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const fetchContent = async () => {
    setLoading(true);
    const response = await GetContentList(token);
    if (response?.status) {
      setContents(response?.data);
    } else {
      toast.error(response?.message || "Failed to load content");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleOpen = (content = null) => {
    setSelectedContent(content);
    setTitle(content?.title || "");
    setDescription(content?.description || "");
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedContent(null);
    setTitle("");
    setDescription("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: selectedContent ? "Update Content?" : "Add Content?",
      text: selectedContent
        ? "Are you sure you want to update this content?"
        : "Are you sure you want to add this content?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const data = {
      title,
      description,
      add_by: "68008bb27f449bc31b57916c",
    };

    setLoading(true);
    let response;
    if (selectedContent) {
      data.id = selectedContent._id;
      response = await UpdateContent(token, data);
    } else {
      response = await AddContent(token, data);
    }

    if (response?.status) {
      toast.success(response?.message || "Saved successfully");
      fetchContent();
      handleCancel();
    } else {
      toast.error(response?.message || "Failed to save");
    }

    setLoading(false);
  };

  const handleStatusChange = async (content) => {
    const actionText = content.status ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this content?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      id: content._id,
      status: (!content.status).toString(),
    };

    const res = await UpdateContentStatus(token, payload);

    if (res?.status) {
      toast.success(res?.message || `Content ${actionText}d`);
      fetchContent();
    } else {
      toast.error(res?.message || "Failed to change status");
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
    },
    {
      name: "Description",
      cell: (row) => (
        <div
          className="line-clamp-2 prose max-w-xs text-sm"
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
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5  w-5 h-5 rounded-full border border-gray-300 peer-checked:translate-x-full transition-transform duration-200"></div>
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
        </div>
      ),
    },
    {
      name: "View",
      cell: (row) => (
        <div className="flex gap-3">
          <Eye
            className="cursor-pointer text-green-600"
            size={20}
            onClick={() => {
              setViewContent(row);
              setViewOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <Content
      Page_title="Content Management"
      button_title="back"
      button_status={true}
    >
      <div className="p-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText />
            <h1 className="text-2xl font-bold">All Contents</h1>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded text-white"
            onClick={() => handleOpen()}
          >
            + Add Content
          </button>
        </div>
        <div className="shadow-lg rounded-xl p-4 bg-white">
          <Datatable columns={columns} data={contents} title="Contents List" />
        </div>

        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                {selectedContent ? "✏️ Edit Content" : "➕ Add Content"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setDescription(data);
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
        {viewOpen && viewContent && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ Content Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewContent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Title:</h3>
                  <p className="text-gray-600">{viewContent.title}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">Description:</h3>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: viewContent.description,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewContent(null);
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

export default Contents;
