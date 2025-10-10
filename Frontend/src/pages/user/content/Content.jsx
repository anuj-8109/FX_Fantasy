
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getContent } from "../../../services/User";
import BackButton from "../../../pages/user/Backbutton";

function Content() {



  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fatchContent = async () => {
    try {
      setLoading(true);
      const data = { id: "66dbec0a9f7a0365f1f4527d" }
      const res = await getContent(token, data);
      if (res?.status === true) {
        setContent(res?.data || null);
      } else {
        toast.error(res?.message || "Failed to load content");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fatchContent();

  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 border p-1 rounded-xl shadow-sm bg-gray-50">        {/* Left: Back button */}
        <h2 className="text-2xl font-bold">Content</h2>
        {/* Right: Heading */}

        <BackButton />

      </div>


      {loading && <p>Loading...</p>}

      {!loading && content && (
        <div
          key={content._id}
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
        >
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {content.title}
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              {new Date(content.created_at).toLocaleDateString()}
            </p>

            <div
              className="text-gray-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;
