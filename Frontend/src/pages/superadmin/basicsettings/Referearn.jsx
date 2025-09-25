import React, { useEffect, useState } from "react";
import Content from "../../../components/superadmin/Content";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { GetBasicSettingDetails, UpdateBasicSettings } from "../../../services/SuperAdmin";

const Referearn = () => {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    refer_title: "",
    refer_description: "",
    sender_earn: 0,
    receiver_earn: 0,
    refer_status: "inactive",
    refersendmsg: "",
    image: null,
    multipleTime: true,
  });

  const fetchReferSettings = async () => {
    setLoading(true);
    try {
      const response = await GetBasicSettingDetails(token);
      if (response?.data) {
        const data = response.data;
        setFormData({
          refer_title: data.refer_title || "",
          refer_description: data.refer_description || "",
          sender_earn: data.sender_earn || 0,
          receiver_earn: data.receiver_earn || 0,
          refer_status: data.refer_status || "inactive",
          refersendmsg: data.refersendmsg || "",
          image: null,
          multipleTime: data.multipleTime ?? true,
        });
      }
    } catch (error) {
      toast.error("Error fetching Refer & Earn settings: " + (error?.message || error));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update Refer & Earn settings?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setUpdateLoading(true);
    try {
      const response = await UpdateBasicSettings(token, formData);
      toast.success(response?.message || "Refer & Earn settings updated successfully");
      fetchReferSettings();
    } catch (error) {
      toast.error("Error updating settings: " + (error?.message || error));
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchReferSettings();
  }, []);

  if (loading) {
    return (
      <Content Page_title="Refer & Earn" button_title="Back" route="/superadmin/dashboard" button_status={true}>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </Content>
    );
  }

  return (
    <Content Page_title="Refer & Earn" button_title="Back" route="/superadmin/dashboard" button_status={true}>
      <div className="max-w-6xl mx-auto  p-5 border rounded shadow sms-style">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="refer_title"
              value={formData.refer_title}
              onChange={handleChange}
              className="w-full border p-2 rounded sms-style "
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium">Sender Earn (%)</label>
              <input
                type="number"
                name="sender_earn"
                value={formData.sender_earn}
                onChange={handleChange}
                className="w-full border p-2 rounded sms-style "
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium">Receiver Earn (%)</label>
              <input
                type="number"
                name="receiver_earn"
                value={formData.receiver_earn}
                onChange={handleChange}
                className="w-full border p-2 rounded sms-style "
              />
            </div>
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="refer_description"
              value={formData.refer_description}
              onChange={handleChange}
              className="w-full border p-2 rounded sms-style "
              rows={4}
            />
          </div>

          <div>
            <label className="block font-medium">Share Message</label>
            <textarea
              name="refersendmsg"
              value={formData.refersendmsg}
              onChange={handleChange}
              className="w-full border p-2 rounded sms-style "
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium ">Image</label>
            <input type="file" name="image" onChange={handleChange}  />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="refer_status"
              value={formData.refer_status}
              onChange={handleChange}
              className="w-full border p-2 rounded sms-style "
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <label>
              <input
                type="checkbox"
                name="multipleTime"
                checked={formData.multipleTime}
                onChange={handleChange}
              />{" "}
              Multiple Time
            </label>
            <label>
              <input
                type="checkbox"
                name="singleTime"
                checked={!formData.multipleTime}
                onChange={() =>
                  setFormData({ ...formData, multipleTime: !formData.multipleTime })
                }
              />{" "}
              Single Time
            </label>
          </div>

          <button
            type="submit"
            disabled={updateLoading}
            className={`bg-orange-500 text-white px-4 py-2 rounded ${
              updateLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updateLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </Content>
  );
};

export default Referearn;
