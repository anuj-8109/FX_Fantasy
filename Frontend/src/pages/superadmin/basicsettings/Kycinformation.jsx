import React, { useEffect, useState } from "react";
import Content from "../../../components/superadmin/Content";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { GetBasicSettingDetails, UpdateBasicSettings } from "../../../services/SuperAdmin";

const KycInformation = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [formData, setFormData] = useState({
    digio_client_id: "",
    digio_client_secret: "",
    digio_template_name: "",
  });

  const fetchKycSettings = async () => {
    setLoading(true);
    try {
      const response = await GetBasicSettingDetails(token);
      if (response?.data) {
        const data = response.data;
        setFormData({
          digio_client_id: data.digio_client_id || "",
          digio_client_secret: data.digio_client_secret || "",
          digio_template_name: data.digio_template_name || "KYC_AGREEMENT",
        });
      }
    } catch (error) {
      toast.error("Error fetching KYC settings: " + (error?.message || error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update KYC settings?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setUpdateLoading(true);
    try {
      const response = await UpdateBasicSettings(token, formData);
      toast.success(response?.message || "KYC settings updated successfully");
      fetchKycSettings();
    } catch (error) {
      toast.error("Error updating KYC settings: " + (error?.message || error));
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchKycSettings();
  }, []);

  if (loading) {
    return (
      <Content Page_title="KYC" button_title="Back" route="/superadmin/dashboard" button_status={true}>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading KYC settings...</p>
        </div>
      </Content>
    );
  }

  return (
    <Content Page_title="KYC" button_title="Back" route="/superadmin/dashboard" button_status={true}>
      <div className="p-4 bg-white rounded shadow-md max-w-6xl mx-auto">
        <h2 className="text-lg font-bold mb-4">KYC Information</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Digio Client ID</label>
          <input
            type="text"
            name="digio_client_id"
            value={formData.digio_client_id}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Digio Client Secret</label>
          <input
            type="text"
            name="digio_client_secret"
            value={formData.digio_client_secret}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Digio Template Name</label>
          <input
            type="text"
            name="digio_template_name"
            value={formData.digio_template_name}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={updateLoading}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            updateLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {updateLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </Content>
  );
};

export default KycInformation;
