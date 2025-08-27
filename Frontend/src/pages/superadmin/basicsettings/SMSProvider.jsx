import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import Swal from "sweetalert2";
import {
  GetSmsProviderList,
  UpdateSmsProvider,
  UpdateSmsProviderStatus,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";

const SMSProviders = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // form states
  const [name, setName] = useState("");
  const [apikey, setApikey] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [route, setRoute] = useState("");
  const [entityId, setEntityId] = useState("");
  const [sender, setSender] = useState("");
  const [url, setUrl] = useState("");

  const token = localStorage.getItem("token");

  // fetch all providers
  const fetchProviders = async () => {
    setLoading(true);
    const response = await GetSmsProviderList(token);
    if (response?.status) {
      setProviders(response?.data);
    } else {
      toast.error(response?.message || "Failed to load providers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // handle edit click
  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setName(provider?.name || "");
    setApikey(provider?.apikey || "");
    setUsername(provider?.username || "");
    setPassword(provider?.password || "");
    setRoute(provider?.route || "");
    setEntityId(provider?.entity_id || "");
    setSender(provider?.sender || "");
    setUrl(provider?.url || "");
    setOpen(true);
  };

  // save provider
  const handleSave = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this SMS Provider?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const data = {
      id: selectedProvider._id,
      name,
      apikey,
      username,
      password,
      route,
      entity_id: entityId,
      sender,
      url,
    };

    setLoading(true);
    const response = await UpdateSmsProvider(token, data);
    if (response?.status) {
      toast.success(response?.message || "Provider updated successfully");
      fetchProviders();
      setOpen(false);
    } else {
      toast.error(response?.message || "Failed to update provider");
    }
    setLoading(false);
  };

  // change status
  const handleStatusChange = async (provider) => {
    const actionText = provider.status === 1 ? "Deactivate" : "Activate";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this SMS Provider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = { providerId: provider._id };
    const res = await UpdateSmsProviderStatus(token, payload);

    if (res?.status) {
      toast.success(res?.message || `Provider ${actionText}d`);
      fetchProviders();
    } else {
      toast.error(res?.message || "Failed to change status");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedProvider(null);
  };

  return (
    <Content
      Page_title="SMS Providers"
      button_title="back"
      button_status={true}
    >
      <div className="p-6 min-h-screen">
        {/* Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers?.map((provider) => (
            <div
              key={provider._id}
              className="border rounded-2xl shadow-md p-5 flex flex-col bg-white"
            >
              {/* Top - Active Status & Edit */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={provider.status === 1}
                    onChange={() => handleStatusChange(provider)}
                    className="h-4 w-4"
                  />
                  Active Status
                </label>
                <button
                  onClick={() => handleEdit(provider)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  title="Edit Provider"
                >
                  <Edit size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className="border-b mb-3"></div>

              {/* Data Fields */}
              <div className="space-y-2 text-sm flex-1">
                {[
                  { label: "Name", value: provider.name },
                  { label: "Username", value: provider.username },
                  { label: "Password", value: provider.password },
                  { label: "API Key", value: provider.apikey },
                  { label: "Sender", value: provider.sender },
                  { label: "Route", value: provider.route },
                  { label: "Entity ID", value: provider.entity_id },
                  { label: "URL", value: provider.url },
                ]?.map((field, i) => (
                  <div key={i}>
                    <label className="text-gray-500 text-xs">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={field.value || "-"}
                      readOnly
                      className="w-full mt-1 border rounded-md px-2 py-1 text-gray-700 bg-gray-50 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-6 border-b pb-3 text-gray-800">
                ✏️ Edit SMS Provider
              </h2>

              {/* Edit Form */}
              <form onSubmit={handleSave}>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-sm">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm">API Key</label>
                    <input
                      type="text"
                      value={apikey}
                      onChange={(e) => setApikey(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm">Sender</label>
                    <input
                      type="text"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm">Route</label>
                    <input
                      type="text"
                      value={route}
                      onChange={(e) => setRoute(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm">Entity ID</label>
                    <input
                      type="text"
                      value={entityId}
                      onChange={(e) => setEntityId(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm">URL</label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-md border bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
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

export default SMSProviders;
