import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { FileText, Edit, Eye, Trash2 } from "lucide-react";
import {
  GetNewsList, AddNews, UpdateNews, UpdateNewsStatus, DeleteNews
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Content from "../../../components/superadmin/Content";

const News = () => {
  const [news, setNews] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewNews, setViewNews] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

  const fetchNews = async () => {
    setLoading(true);
    const response = await GetNewsList(token);
    if (response?.status) {
      setNews(response?.data);
    } else {
      toast.error(response?.message || "Failed to load news");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpen = (news = null) => {
    setSelectedNews(news);
    setTitle(news?.title || "");
    setDescription(news?.description || "");
    setImage(news?.image || "");
    setOpen(true);
  };

  const handleDelete = async (news) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this news?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    const response = await DeleteNews(token, news._id);
    setLoading(false);

    if (response?.status) {
      toast.success(response?.message || "News deleted successfully");
      fetchNews();
    } else {
      toast.error(response?.message || "Failed to delete news");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedNews(null);
    setTitle("");
    setDescription("");
    setImage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: selectedNews ? "Update News?" : "Add News?",
      text: selectedNews
        ? "Are you sure you want to update this news?"
        : "Are you sure you want to add this news?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const formData = new FormData();
    formData.append("add_by", add_by);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    if (selectedNews) formData.append("id", selectedNews._id);

    setLoading(true);
    let response;
    if (selectedNews) {
      formData.id = selectedNews._id;
      response = await UpdateNews(token, formData);
    } else {
      response = await AddNews(token, formData);
    }

    if (response?.status) {
      toast.success(response?.message || "Saved successfully");
      fetchNews();
      handleCancel();
    } else {
      toast.error(response?.message || "Failed to save");
    }

    setLoading(false);
  };

  const handleStatusChange = async (news) => {
    const actionText = news.status ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this news?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      id: news._id,
      status: (!news.status).toString(),
    };

    const res = await UpdateNewsStatus(token, payload);

    if (res?.status) {
      toast.success(res?.message || `News ${actionText}d`);
      fetchNews();
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
      name: "Image",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.title}
          className="w-16 h-16 object-cover"
        />
      ),
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
          dangerouslySetInnerHTML={{ __html: row?.description }}
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
        <div className="flex gap-3">
          <Eye
            className="cursor-pointer text-green-600"
            size={20}
            onClick={() => {
              setViewNews(row);
              setViewOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <Content
      Page_title="All News"
      button_title="back"
      route="/superadmin/superadmindashboard"
      button_status={true}
      extra_button="+ Add News" extra_button_action={handleOpen}
    >
      <div className="p-2 ">

        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText />
            <h1 className="text-2xl font-bold">All News</h1>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded text-white"
            onClick={() => handleOpen()}
          >
            + Add News
          </button>
        </div> */}

        <div className="shadow-lg rounded-xl p-4 ">
          <Datatable columns={columns} data={news} title="News List" onRefresh={fetchNews} />
        </div>

        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 Add-client-style">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                {selectedNews ? "✏️ Edit News" : "➕ Add News"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm ">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  />
                </div>
                <div>
                  <label className="text-sm">Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setDescription(data);
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm ">Image URL</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full border rounded-md px-3 py-2 mt-1 input-Add"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-blue-600 rounded-md"
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
        {viewOpen && viewNews && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ News Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewNews(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Title:</h3>
                  <p className="text-gray-600">{viewNews?.title}</p>
                </div>

                {viewNews?.image && (
                  <div>
                    <h3 className="font-semibold text-gray-800">Image:</h3>
                    <img
                      src={viewNews?.image}
                      alt={viewNews?.title}
                      className="w-full max-h-64 object-contain rounded-md border"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-800">Description:</h3>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: viewNews?.description,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewNews(null);
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

export default News;
