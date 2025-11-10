import React, { useState, useEffect } from "react";
import { Getfaq } from "../../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../../pages/user/Backbutton";

function FAQ() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null); // track which accordion is open

  const token = localStorage.getItem("token");

  const fetchFaq = async () => {
    try {
      setLoading(true);
      const res = await Getfaq(token);
      if (res?.status === true) {
        setFaq(res?.data || []);
      } else {
        toast.error(res?.message || "Failed to load FAQs");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="flex justify-between items-center mb-6 border p-2 bg-gray-50 rounded-xl shadow-sm border-blue-200">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <BackButton />
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && faq?.length === 0 && (
        <p className="text-gray-500">No FAQ found.</p>
      )}

      {!loading &&
        faq?.length > 0 &&
        faq.map((item, index) => (
          <div
            key={item._id}
            className="border rounded-lg mb-3 shadow-sm overflow-hidden"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <span className="font-medium text-left">
                Q{index + 1}: {item.title}
              </span>
              <span className="text-lg">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Accordion Content */}
            {openIndex === index && (
              <div
                className="px-4 py-3 text-gray-600 bg-white animate-fadeIn"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
          </div>
        ))}
    </div>
  );
}

export default FAQ;
