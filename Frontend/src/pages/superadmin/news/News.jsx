import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { Edit, Eye, Trash2 } from "lucide-react";
import {
  GetNewsList,
  UpdateNewsStatus,
  DeleteNews,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";
import { useNavigate } from "react-router-dom";
import * as config from "../../../utils/config";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewNews, setViewNews] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const handleDelete = async (newsItem) => {
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
    const response = await DeleteNews(token, newsItem._id);
    setLoading(false);

    if (response?.status) {
      toast.success(response?.message || "News deleted successfully");
      fetchNews();
    } else {
      toast.error(response?.message || "Failed to delete news");
    }
  };

  const handleStatusChange = async (newsItem) => {
    const actionText = newsItem.status ? "Deactivate" : "Activate";

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
      id: newsItem._id,
      status: (!newsItem.status).toString(),
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
      name: "Image",
      cell: (row) =>
        row?.image ? (
          <img
            src={`${config?.image_url}uploads/news/${row.image}`}
            alt={row.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 italic">No Image</span>
        ),
      export: false,
    },
    {
      name: "Title",
      selector: (row) => row?.title,
      exportValue: (row) => row.title || "N/A",
      export: true,
      sortable: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => row?.description,
      exportValue: (row) => row.description || "N/A",
      export: true,
      cell: (row) => (
        <div
          className="line-clamp-2 prose max-w-xs text-sm"
          dangerouslySetInnerHTML={{ __html: row?.description }}
        />
      ),
    },
    {
      name: "Status",
      selector: (row) => (row.status ? "Active" : "Inactive"),
      exportValue: (row) => (row.status ? "Active" : "Inactive"),
      export: true,
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
            onClick={() =>
              navigate("/superadmin/add-news", { state: { news: row } })
            }
          />
          <Trash2
            className="cursor-pointer text-red-600"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
      export: false,
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
      export: false,
    },
  ];

  return (
    <Content
      Page_title="All News"
      button_title="Back"
      route="/superadmin/dashboard"
      button_status={true}
      extra_button="+ Add News"
      extra_button_action={() => navigate("/superadmin/add-news")}
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          <Datatable
            columns={columns}
            data={news}
            title="News List"
            onRefresh={fetchNews}
          />
        </div>

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
                      src={`${config?.image_url}uploads/news/${viewNews.image}`}
                      alt={viewNews?.title}
                      className="w-full max-h-64 object-contain rounded-md border"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-800">Description:</h3>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: viewNews?.description }}
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
