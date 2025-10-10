import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import Swal from "sweetalert2";
import {
  GetSMSTemplateList,
  UpdateSMSTemplate,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";

const SMSTemplates = () => {
  const token = localStorage.getItem("token");

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateid, setTemplateId] = useState("");
  const [smsBody, setSmsBody] = useState("");

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await GetSMSTemplateList(token);
      if (response?.status) {
        setTemplates(response?.data || []);
      } else {
        toast.error(response?.message || "Failed to load templates");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching SMS Templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setTemplateId(template?.templateid || "");
    setSmsBody(template?.sms_body || "");
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedTemplate(null);
  };

  const handleSave = async (e) => {
  e.preventDefault();

  // ✅ Check if any changes were made
  const hasChanges =
    templateid !== (selectedTemplate?.templateid || "") ||
    smsBody !== (selectedTemplate?.sms_body || "");

  if (!hasChanges) {
    Swal.fire({
      icon: "info",
      title: "No changes made",
      text: "You haven’t modified any fields in this template.",
      confirmButtonText: "OK",
    });
    return;
  }

  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update this SMS Template?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Update",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  const payload = {
    id: selectedTemplate._id,
    templateid,
    sms_body: smsBody,
  };

  try {
    setLoading(true);
    const response = await UpdateSMSTemplate(token, payload);
    if (response?.status) {
      toast.success(response?.message || "Template updated successfully");
      fetchTemplates();
      setOpen(false);
    } else {
      toast.error(response?.message || "Failed to update template");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error updating SMS Template");
  } finally {
    setLoading(false);
  }
};

  return (
    <Content
      Page_title="SMS Templates"
      button_title="Back"
      route="/superadmin/dashboard"
      button_status={true}
    >
      <div className="p-6 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {templates?.map((template) => (
            <div
              key={template._id}
              className="border rounded-2xl shadow-md p-5 flex flex-col sms-style "
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium ">SMS Template</span>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-2 rounded-full transition"
                  title="Edit Template"
                >
                  <Edit size={18} />
                </button>
              </div>

              <div className="border-b mb-3"></div>
              <div className="space-y-2 text-sm flex-1 ">
                {[
                  { label: "SMS Type", value: template.sms_type },
                  { label: "Template ID", value: template.templateid },
                  { label: "SMS Body", value: template.sms_body },
                ].map((field, i) => (
                  <div key={i}>
                    <label className=" text-xs">{field.label}</label>
                    <input
                      type="text"
                      value={field.value || "-"}
                      readOnly
                      className="w-full mt-1 border rounded-md px-2 py-1 sms-style  text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {open && (
          <div className="fixed mt-5 inset-0 flex items-center justify-center z-50 bg-opacity-40">
            <div className="w-lg max-h-[80vh] overflow-y-auto Add-client-style shadow-2xl p-6 hide-scrollbar client-style">
              <h2 className="text-xl font-semibold mb-6 border-b pb-3 ">
                ✏️ Edit SMS Template
              </h2>

              <form onSubmit={handleSave}>
                <div className="space-y-4">
                  <div>
                    <label className=" text-sm">Template ID</label>
                    <input
                      type="text"
                      value={templateid}
                      onChange={(e) => setTemplateId(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 mt-1 sms-style "
                    />
                  </div>

                  <div>
                    <label className=" text-sm">SMS Body</label>
                    <textarea
                      value={smsBody}
                      onChange={(e) => setSmsBody(e.target.value)}
                      rows="4"
                      className="w-full border rounded-md px-3 py-2 mt-1 sms-style "
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-md border "
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

export default SMSTemplates;
