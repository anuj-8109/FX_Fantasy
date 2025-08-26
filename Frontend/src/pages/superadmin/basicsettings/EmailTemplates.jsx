import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import {
  GetMailTemplateList,
  GetMailTemplateDetails,
  UpdateMailTemplate,
} from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [mailType, setMailType] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // fetch all templates
  const fetchTemplates = async () => {
    const response = await GetMailTemplateList(token);
    if (response?.status) {
      setTemplates(response?.data);
    } else {
      toast.error(response?.message || "Failed to load templates");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // fetch single template details
  const fetchTemplateDetails = async (id) => {
    try {
      setLoading(true);
      const res = await GetMailTemplateDetails(token, id);

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

  // handle edit click
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setOpen(true);
    fetchTemplateDetails(template._id);
  };

  // save template
  const handleSave = async () => {
    const data = {
      mail_subject: subject,
      mail_body: body,
      id: selectedTemplate._id,
    };
    const response = await UpdateMailTemplate(token, data);
    if (response?.status) {
      toast.success(response?.message || "Template updated successfully");
      fetchTemplates(); // refresh list after update
    } else {
      toast.error("Failed to update template", response?.message);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <Content Page_title="Email Templates" button_title="back" button_status={true}>
      <div className="p-6  min-h-screen">

        {/* Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <div
              key={template._id}
              className=" border border-gray-200 rounded-2xl shadow-md p-5 flex flex-col transition hover:shadow-lg hover:scale-[1.01] duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide ">
                    Mail Type
                  </p>
                  <p className="text-base font-medium ">
                    {template.mail_type}
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(template)}
                  className="p-2 rounded-full   transition"
                  title="Edit Template"
                >
                  <Edit size={18} />
                </button>
              </div>

              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide  mb-1">
                  Subject
                </p>
                <p className="text-sm font-medium ">
                  {template.mail_subject}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide  mb-1">
                  Mail Body
                </p>
                <pre className=" text-sm  p-3 rounded-lg h-36 overflow-auto whitespace-pre-wrap border border-gray-100">
                  {template.mail_body}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className=" w-full max-w-xl rounded-2xl shadow-2xl p-6 animate-fadeIn">
              <h2 className="text-xl font-semibold  mb-6 border-b pb-3">
                ✉️ Edit Email Template
              </h2>

              {loading ? (
                <p className="text-center ">Loading...</p>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium  mb-1 block">
                      Mail Type
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm "
                      value={mailType}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Subject
                    </label>
                    <input
                      className="w-full border  rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium  mb-1 block">
                      Mail Body
                    </label>
                    <textarea
                      className="w-full h-40 border rounded-lg p-4 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
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
                  className="px-5 py-2.5 border border-gray-300 rounded-lg   transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5  rounded-lg hover:bg-indigo-700 transition shadow"
                  disabled={loading}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Content>
  );
};

export default EmailTemplates;
