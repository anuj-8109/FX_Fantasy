import React, { useEffect, useState } from "react";
import {
  GetBasicSettingDetails,
  UpdateBasicSettings,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";
import Swal from "sweetalert2";

const GeneralSettings = () => {
  const token = localStorage.getItem("token");
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [formData, setFormData] = useState({
    favicon: "",
    logo: "",
    website_title: "",
    email_address: "",
    contact_number: "",
    address: "",
    smtp_status: "",
    smtp_host: "",
    smtp_port: "",
    encryption: "",
    smtp_username: "",
    smtp_password: "",
    from_name: "",
  });

  const fetchBasicSettings = async () => {
    setLoading(true);
    try {
      const response = await GetBasicSettingDetails(token);
      setSettings(response?.data);

      if (response?.data && response.data.length > 0) {
        const settingData = response.data[0];
        setFormData({
          favicon: settingData.favicon || "",
          logo: settingData.logo || "",
          website_title: settingData.website_title || "",
          email_address: settingData.email_address || "",
          contact_number: settingData.contact_number || "",
          address: settingData.address || "",
          smtp_status: settingData.smtp_status || "",
          smtp_host: settingData.smtp_host || "",
          smtp_port: settingData.smtp_port || "",
          encryption: settingData.encryption || "",
          smtp_username: settingData.smtp_username || "",
          smtp_password: settingData.smtp_password || "",
          from_name: settingData.from_name || "",
        });
      }
    } catch (error) {
      toast.error(
        "Error fetching basic settings: " + (error?.message || error)
      );
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateBasicSettings = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update the basic settings?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setUpdateLoading(true);
    try {
      const response = await UpdateBasicSettings(token, formData);
      toast.success(response?.message || "Basic settings updated successfully");
      fetchBasicSettings();
    } catch (error) {
      toast.error(
        "Error updating basic settings: " + (error?.message || error)
      );
      console.error("Error updating settings:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBasicSettings();
  };

  useEffect(() => {
    fetchBasicSettings();
  }, []);

  if (loading) {
    return (
      <Content
        Page_title="General Settings"
        button_title="back"
        button_status={true}
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </Content>
    );
  }

  return (
    <Content
      Page_title="General Settings"
      button_title="back"
       route="/superadmin/superadmindashboard"
      button_status={true}
    >
      <div className="max-w-4xl mx-auto Content_Style">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border rounded-lg shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium   mb-2">
                  Website Title:
                </label>

                <input
                  type="text"
                  name="website_title"
                  value={formData.website_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 input-Add"
                />
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Favicon URL:
                </label>
                <input
                  type="url"
                  name="favicon"
                  value={formData.favicon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 input-Add"
                /> 
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Logo URL:
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 input-Add"
                />
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Email Address:
                </label>
                <input
                  type="email"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 input-Add"
                />
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Contact Number:
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 input-Add"
                />
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Address:
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y input-Add"
                />
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  SMTP Status:
                </label>
                <select
                  name="smtp_status"
                  value={formData.smtp_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 input-Add"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    SMTP Host:
                  </label>
                  <input
                    type="text"
                    name="smtp_host"
                    value={formData.smtp_host}
                    onChange={handleInputChange}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 input-Add"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    SMTP Port:
                  </label>
                  <input
                    type="number"
                    name="smtp_port"
                    value={formData.smtp_port}
                    onChange={handleInputChange}
                    placeholder="587"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 input-Add"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Encryption:
                </label>
                <select
                  name="encryption"
                  value={formData.encryption}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 input-Add"
                >
                  <option value="">Select Encryption</option>
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    SMTP Username:
                  </label>
                  <input
                    type="text"
                    name="smtp_username"
                    value={formData.smtp_username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 input-Add"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    SMTP Password:
                  </label>
                  <input
                    type="password"
                    name="smtp_password"
                    value={formData.smtp_password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 input-Add"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  From Name:
                </label>
                <input
                  type="text"
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 input-Add"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              disabled={updateLoading}
              className={`px-8 py-3 rounded-md text-sm font-medium transition-colors duration-300  ${
                updateLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              } text-white`}
            >
              {updateLoading ? "Updating..." : "Update Settings"}
            </button>
          </div>
        </form>
      </div>
    </Content>
  );
};

export default GeneralSettings;
