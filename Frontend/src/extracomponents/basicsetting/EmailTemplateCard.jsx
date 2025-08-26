import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import {
  GetMailTemplateDetails,
  UpdateMailTemplate,
} from "../../services/SuperAdmin";
import toast from "react-hot-toast";

const EmailTemplateCard = ({ template }) => {
  const [mailType, setMailType] = useState(template.mail_type || "");
  const [subject, setSubject] = useState(template.mail_subject || "");
  const [body, setBody] = useState(template.mail_body || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (open) {
      fetchTemplateDetails();
    }
  }, [open]);

  const fetchTemplateDetails = async () => {
    try {
      setLoading(true);
      const res = await GetMailTemplateDetails(token, template._id);

      if (res?.status) {
        setMailType(res.data.mail_type);
        setSubject(res.data.mail_subject);
        setBody(res.data.mail_body);
      } else {
        toast.error("Failed to fetch template details", res?.message);
      }
    } catch (error) {
      toast.error("Error fetching template:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const data = {
      mail_subject: subject,
      mail_body: body,
      id: template._id,
    };
    const response = await UpdateMailTemplate(token, data);
    if (response?.status) {
      toast.success(response?.message || "Template updated successfully");
    } else {
      toast.error("Failed to update template", response?.message);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Template Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-5 flex flex-col transition hover:shadow-lg hover:scale-[1.01] duration-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Mail Type
            </p>
            <p className="text-base font-medium text-gray-800">{mailType}</p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
            title="Edit Template"
          >
            <Pencil size={18} />
          </button>
        </div>

        <div className="mb-3">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            Subject
          </p>
          <p className="text-sm font-medium text-gray-700">{subject}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            Mail Body
          </p>
          <pre className="bg-gray-50 text-sm text-gray-700 p-3 rounded-lg h-36 overflow-auto whitespace-pre-wrap border border-gray-100">
            {body}
          </pre>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
              ✉️ Edit Email Template
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Mail Type
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    value={mailType}
                    onChange={(e) => setMailType(e.target.value)}
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Subject
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Mail Body
                  </label>
                  <textarea
                    className="w-full h-40 border border-gray-300 rounded-lg p-4 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </div>
            )}

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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailTemplateCard;
