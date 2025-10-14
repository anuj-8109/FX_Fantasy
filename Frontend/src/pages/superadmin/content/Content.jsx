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
import { useNavigate } from "react-router-dom";

const Contents = () => {
  const [contents, setContents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewContent, setViewContent] = useState(null);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");

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

  const handleStatusChange = async (content) => {
    const actionText = content.status ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this content?`,
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
    // {
    //   name: "S.No",
    //   selector: (row, index) => index + 1,
    //   width: "80px",
    // },
    {
      name: "Title",
      selector: (row) => row?.title,
      exportValue: (row) => row?.title || "N/A",
      export: true,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row?.description,
      exportValue: (row) => row.description || "N/A",
      export: true,
      cell: (row) => (
        <div
          className="line-clamp-2 prose max-w-xs text-sm"
          dangerouslySetInnerHTML={{ __html: row.description }}
        />
      ),
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      exportValue: (row) => (row.status === true ? "Active" : "InActive"),
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
              navigate("/superadmin/add-content", { state: { content: row } })
            }
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
              setViewContent(row);
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
      Page_title="All Contents"
      button_title="Back"
      button_status={true}
      extra_button="+ Add Content"
      extra_button_action={() => navigate("/superadmin/add-content")}
      route="/superadmin/dashboard"
    >
      <div className="p-2 ">
        {/* <div className="flex items-center justify-between mb-6">
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
        </div> */}
        <div className="shadow-lg rounded-xl p-4 bg-#1E293B">
          <Datatable
            columns={columns}
            data={contents}
            title="Contents List"
            onRefresh={fetchContent}
          />
        </div>

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
