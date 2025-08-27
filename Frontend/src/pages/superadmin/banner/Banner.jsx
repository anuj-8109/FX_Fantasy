import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { GetBannerList,AddBanner,UpdateBanner,UpdateBannerStatus } from "../../../services/SuperAdmin";
import { Edit } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // ya jahan se token mil raha ho

  // 🔹 Fetch all banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await GetBannerList(token);
      if (response?.status) {
        setBanners(response?.data || []);
      } else {
        setBanners([]);
        toast.error(response?.message || "Failed to fetch banners");
      }
    } catch (error) {
      toast.error("Error fetching banners");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 🔹 Handle status change
  const handleStatusChange = async (id, status) => {
    const actionText = status ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this banner?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await UpdateBannerStatus(token, { id, status: !status });
        if (response?.status) {
          toast.success(response?.message || "Status updated");
          fetchBanners();
        } else {
          toast.error(response?.message || "Failed to update status");
        }
      } catch (error) {
        toast.error("Error updating status");
      }
    }
  };

  // 🔹 Columns for Datatable
  const columns = [
    {
      name: "Image",
      selector: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt="banner"
            className="w-16 h-12 object-cover rounded"
          />
        ) : (
          "No Image"
        ),
      sortable: false,
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
        <span
          className={`px-2 py-1 rounded text-white text-xs ${
            row.status ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.status ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          {/* Edit button */}
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => console.log("Edit", row)}
          >
            <Edit size={18} />
          </button>

          {/* Status toggle button */}
          <button
            className={`px-2 py-1 rounded text-xs ${
              row.status
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
            onClick={() => handleStatusChange(row._id, row.status)}
          >
            {row.status ? "Deactivate" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      {loading ? (
        <p className="text-center">Loading banners...</p>
      ) : banners?.length > 0 ? (
        <Datatable columns={columns} data={banners} title="Banner List" />
      ) : (
        <p className="text-center text-gray-500">No Banners Found</p>
      )}
    </div>
  );
};

export default Banner;
