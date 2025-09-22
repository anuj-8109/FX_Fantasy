import React, { useState, useEffect } from "react";
import { GetBlog } from "../../../services/User";
import toast from "react-hot-toast";

function Blog() {
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await GetBlog(token);

      if (res?.status === true) {
        setBlog(res?.data || []);
      } else {
        toast.error(res?.message || "Failed to load blogs");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <div className="max-w-4xl max-h-4xl mx-auto px-4 py-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Latest Blogs
      </h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && blog?.length === 0 && (
        <p className="text-center text-gray-500">No Blogs found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          blog?.length > 0 &&
          blog.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mb-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                <div
                  className="text-gray-700 text-sm leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Blog;
