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
import * as config from "../../../utils/config";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      name: "Image",
      cell: (row) => (
        <img
          src={`${config?.image_url}uploads/banner/${row?.image}`}
          alt="banner"
          className="w-20 h-12 object-cover rounded"
        />
      ),
      export: false,
    },

    {
      name: "Hyperlink",
      selector: (row) => row.hyperlink || "-",
      exportValue: (row) => row.hyperlink || "N/A",
      export: true,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type || "-",
      exportValue: (row) => row.type || "N/A",
      export: true,
      sortable: true,
    },
    {
      name: "Status",
      exportValue: (row) => (row.status === true ? "Active" : "Inactive"),
      export: true,
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
            onClick={() =>
              navigate("/superadmin/add-banner", { state: { banner: row } })
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
  ];

  return (
    <Content
      Page_title="Banner Management"
      button_title="Back"
      button_status={true}
      extra_button="+ Add Banner"
      extra_button_action={() => navigate("/superadmin/add-banner")}
      route="/superadmin/dashboard"
    >
      <div className="p-2 ">
        <div className="shadow-lg rounded-xl p-4 bg-#1E293B">
          <Datatable
            columns={columns}
            data={banners}
            title="Banners List"
            onRefresh={fetchBanners}
          />
        </div>
      </div>
    </Content>
  );
};

export default Banner;
