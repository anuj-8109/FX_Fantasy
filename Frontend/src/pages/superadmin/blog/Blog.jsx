import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Datatable from "../../../extracomponents/Datatable";
import { Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";
import {
  GetBlogList,
  UpdateBlogStatus,
  DeleteBlog,
} from "../../../services/SuperAdmin";
import * as config from "../../../utils/config";

const Blog = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewBlog, setViewBlog] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    const response = await GetBlogList(token);
    if (response?.status) setBlogs(response?.data || []);
    else toast.error(response?.message || "Failed to load blogs");
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleStatusChange = async (blog) => {
    const actionText = blog.status ? "Deactivate" : "Activate";
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} this blog?`,
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

    const payload = { id: blog._id, status: (!blog.status).toString() };
    const res = await UpdateBlogStatus(token, payload);
    if (res?.status) toast.success(res?.message || `Blog ${actionText}d`);
    else toast.error(res?.message || "Failed to update status");
    fetchBlogs();
  };

  const handleDelete = async (blog) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog.",
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

    const res = await DeleteBlog(token, blog._id);
    if (res?.status) toast.success(res?.message || "Blog deleted successfully");
    else toast.error(res?.message || "Failed to delete blog");
    fetchBlogs();
  };

  const columns = [
    {
      name: "Image",
      cell: (row) =>
        row?.image ? (
          <img
            src={`${config.image_url}uploads/blogs/${row.image}`}
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
      selector: (row) => row.title,
      exportValue: (row) => row.title || "N/A",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      exportValue: (row) => row.description || "N/A",
      cell: (row) => (
        <div
          className="line-clamp-2 prose max-w-xs text-sm"
          dangerouslySetInnerHTML={{ __html: row.description }}
        />
      ),
    },
    {
      name: "Status",
      selector: (row) => (row.status ? "Active" : "Inactive"),
      exportValue: (row) => (row.status ? "Active" : "Inactive"),
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
              navigate("/superadmin/add-blog", { state: { blog: row } })
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
        <Eye
          className="cursor-pointer text-green-600"
          size={20}
          onClick={() => {
            setViewBlog(row);
            setViewOpen(true);
          }}
        />
      ),
      export: false,
    },
  ];

  return (
    <Content
      Page_title="All Blogs"
      button_status={true}
      button_title="Back"
      extra_button="+ Add Blog"
      extra_button_action={() => navigate("/superadmin/add-blog")}
      route="/superadmin/dashboard"
    >
      <div className="p-2">
        <div className="shadow-lg rounded-xl p-4">
          <Datatable
            columns={columns}
            data={blogs}
            title="Blogs List"
            progressPending={loading}
            onRefresh={fetchBlogs}
          />
        </div>

        {/* View Blog Modal */}
        {viewOpen && viewBlog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ Blog Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewBlog(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Title:</h3>
                  <p className="text-gray-600">{viewBlog.title}</p>
                </div>

                {viewBlog?.image && (
                  <div>
                    <h3 className="font-semibold text-gray-800">Image:</h3>
                    <img
                      src={viewBlog.image}
                      alt={viewBlog.title}
                      className="w-full max-h-64 object-contain rounded-md border"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-800">Description:</h3>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: viewBlog.description }}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewBlog(null);
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

export default Blog;
