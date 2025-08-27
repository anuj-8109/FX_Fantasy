import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { Image, Edit, Eye, FileImage } from "lucide-react";
import {
  GetBannerList,
  AddBanner,
  UpdateBanner,
  UpdateBannerStatus,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewBanner, setViewBanner] = useState(null);

  // form fields
  const [image, setImage] = useState("");
  const [hyperlink, setHyperlink] = useState("");
  const [type, setType] = useState("");

  const token = localStorage.getItem("token");

  // fetch banners
  const fetchBanners = async () => {
    setLoading(true);
    const response = await GetBannerList(token);
    if (response?.status) {
      setBanners(response?.data || []);
    } else {
      toast.error(response?.message || "Failed to load banners");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // open modal
  const handleOpen = (banner = null) => {
    setSelectedBanner(banner);
    setImage(banner?.image || "");
    setHyperlink(banner?.hyperlink || "");
    setType(banner?.type || "");
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedBanner(null);
    setImage("");
    setHyperlink("");
    setType("");
  };

  // save (add/update)
  const handleSave = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: selectedBanner ? "Update Banner?" : "Add Banner?",
      text: selectedBanner
        ? "Are you sure you want to update this banner?"
        : "Are you sure you want to add this banner?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const data = {
      image,
      hyperlink,
      type,
    };

    setLoading(true);
    let response;
    if (selectedBanner) {
      data.id = selectedBanner._id;
      response = await UpdateBanner(token, data);
    } else {
      response = await AddBanner(token, data);
    }

    if (response?.status) {
      toast.success(response?.message || "Saved successfully");
      fetchBanners();
      handleCancel();
    } else {
      toast.error(response?.message || "Failed to save");
    }

    setLoading(false);
  };

  // status change
  const handleStatusChange = async (banner) => {
    const actionText = banner.status ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this banner?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      id: banner._id,
      status: (!banner.status).toString(),
    };

    const res = await UpdateBannerStatus(token, payload);

    if (res?.status) {
      toast.success(res?.message || `Banner ${actionText}d`);
      fetchBanners();
    } else {
      toast.error(res?.message || "Failed to change status");
    }
  };

  // Datatable columns
  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Image",
      cell: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt="banner"
            className="w-20 h-12 object-cover rounded"
          />
        ) : (
          "No Image"
        ),
    },
    {
      name: "Hyperlink",
      selector: (row) => row.hyperlink || "-",
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type || "-",
      sortable: true,
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
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full border border-gray-300 peer-checked:translate-x-full transition-transform duration-200"></div>
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
        <Eye
          className="cursor-pointer text-green-600"
          size={20}
          onClick={() => {
            setViewBanner(row);
            setViewOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Content
      Page_title="Banner Management"
      button_title="back"
      button_status={true}
    >
      <div className="p-6 min-h-screen">
        {/* Header + Add button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileImage />
            <h1 className="text-2xl font-bold">All Banners</h1>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded text-white"
            onClick={() => handleOpen()}
          >
            + Add Banner
          </button>
        </div>

        {/* DataTable */}
        <div className="shadow-lg rounded-xl p-4 bg-white">
          <Datatable columns={columns} data={banners} title="Banners List" />
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                {selectedBanner ? "✏️ Edit Banner" : "➕ Add Banner"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Hyperlink</label>
                  <input
                    type="text"
                    value={hyperlink}
                    onChange={(e) => setHyperlink(e.target.value)}
                    placeholder="Enter hyperlink"
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Enter banner type"
                    className="w-full border rounded-md px-3 py-2 mt-1"
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

        {/* View Modal */}
        {viewOpen && viewBanner && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
                <span>👁️ Banner Details</span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewBanner(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Image:</h3>
                  {viewBanner.image ? (
                    <img
                      src={viewBanner.image}
                      alt="banner"
                      className="w-full max-h-56 object-cover rounded"
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">Hyperlink:</h3>
                  <p className="text-blue-600">{viewBanner.hyperlink}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">Type:</h3>
                  <p className="text-gray-600">{viewBanner.type}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setViewBanner(null);
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

export default Banner;
