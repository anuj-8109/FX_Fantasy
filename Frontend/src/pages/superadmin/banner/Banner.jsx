import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { Image, Edit, FileImage, Trash2 } from "lucide-react";
import {
  GetBannerList,
  AddBanner,
  UpdateBanner,
  UpdateBannerStatus,
  DeleteBanner,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Content from "../../../components/superadmin/Content";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const add_by = localStorage.getItem("add_by");
  const [image, setImage] = useState("");
  const [hyperlink, setHyperlink] = useState("");
  const [type, setType] = useState("");

  const token = localStorage.getItem("token");

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

  const handleDelete = async (banner) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    const res = await DeleteBanner(token, banner._id);
    setLoading(false);

    if (res?.status) {
      toast.success(res?.message || "Banner deleted successfully");
      fetchBanners();
    } else {
      toast.error(res?.message || "Failed to delete banner");
    }
  };

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

    const formData = new FormData();
    formData.append("add_by", add_by);
    formData.append("image", image);
    formData.append("hyperlink", hyperlink);
    formData.append("type", type);
    if (selectedBanner) formData.append("id", selectedBanner._id);

    setLoading(true);
    let response;
    if (selectedBanner) {
      response = await UpdateBanner(token, formData);
    } else {
      response = await AddBanner(token, formData);
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

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "Image",
      cell: (row) =>
        row?.image ? (
          <img
            src={`/uploads/banner/${row.image}`}
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
          {/* Track */}
          <div className="w-10 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>

          {/* Thumb */}
          <div className="absolute left-0.5  w-4 h-4 bg-white rounded-full border border-gray-300 shadow-sm peer-checked:translate-x-5 transition-transform duration-300"></div>
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
  ];

  return (
    <Content
      Page_title="Banner Management"
      button_title="back"
      button_status={true}
      route="/superadmin/superadmindashboard"
      extra_button="+ Add Banner" extra_button_action={handleOpen}
    >
      <div className="p-2 ">
       

        <div className="shadow-lg rounded-xl p-4 bg-#1E293B">
          <Datatable columns={columns} data={banners} title="Banners List" onRefresh={fetchBanners} />
        </div>

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
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
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
      </div>
    </Content>
  );
};

export default Banner;
