import React, { useState, useEffect } from "react";
import { Getfaq } from "../../../services/User";
import toast from "react-hot-toast";

function FAQ() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(false);
   console.log("faq",faq)
  const token = localStorage.getItem("token");

  const fetchFaq = async () => {
    try {
      setLoading(true);
      const res = await Getfaq(token);
        console.log("res", res)
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

  return (
    <div>
      <h2>FAQ</h2>

      {loading && <p>Loading...</p>}

      {!loading && faq?.length === 0 && <p>No FAQ found.</p>}

      {!loading &&
        faq?.length > 0 &&
        faq.map((item, index) => (
          <div
            key={item._id}
            style={{
              marginBottom: "20px",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <p>
              <strong>Q{index + 1}: {item.title}</strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: item.description }}
              style={{ marginLeft: "10px", color: "#555" }}
            />
          </div>
        ))}
    </div>
  );
}

export default FAQ;
