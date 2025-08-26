import React, { useEffect, useState } from "react";
import EmailTemplateCard from "../../../extracomponents/basicsetting/EmailTemplateCard";
import { GetMailTemplateList } from "../../../services/SuperAdmin";
import toast from "react-hot-toast";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const token = localStorage.getItem("token");

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

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Email Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <EmailTemplateCard
            key={template._id}
            template={template}
          />
        ))}
      </div>
    </div>
  );
};

export default EmailTemplates;
