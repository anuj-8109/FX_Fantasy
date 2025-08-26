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
  const handleSave = async () => {
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
              className="border rounded-2xl shadow-md p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide ">
                    Provider Name
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {provider.name}
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(provider)}
                  className="p-2 rounded-full   transition"
                  title="Edit Provider"
                >
                  <Edit size={18} />
                </button>
              </div>

              {/* Details Section */}
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">API Key:</span>{" "}
                  {provider.apikey || "-"}
                </p>
                <p>
                  <span className="font-medium">Username:</span>{" "}
                  {provider.username || "-"}
                </p>
                <p>
                  <span className="font-medium">Password:</span>{" "}
                  {provider.password || "-"}
                </p>
                <p>
                  <span className="font-medium">Route:</span>{" "}
                  {provider.route || "-"}
                </p>
                <p>
                  <span className="font-medium">Entity ID:</span>{" "}
                  {provider.entity_id || "-"}
                </p>
                <p>
                  <span className="font-medium">Sender:</span>{" "}
                  {provider.sender || "-"}
                </p>
                <p className="break-words">
                  <span className="font-medium">URL:</span>{" "}
                  {provider.url || "-"}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {provider.status === 1 ? "Active" : "Inactive"}
                </p>
              </div>

              <button
                onClick={() => handleStatusChange(provider)}
                className={`mt-4 px-4 py-2 rounded-lg  ${
                  provider.status === 1
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {provider.status === 1 ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className=" w-full max-w-lg rounded-2xl bg-blue-400 shadow-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold  mb-6 border-b pb-3">
                ✏️ Edit SMS Provider
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium  mb-1 block">
                    Name
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium  mb-1 block">
                    API Key
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={apikey}
                    onChange={(e) => setApikey(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Username
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium  mb-1 block">
                    Password
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium  mb-1 block">
                    Route
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium  mb-1 block">
                    Entity ID
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Sender
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    URL
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
};

export default SMSProviders;
