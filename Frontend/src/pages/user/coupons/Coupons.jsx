import React, { useEffect, useState } from "react";
import { GetCoupons } from "../../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../../pages/user/Backbutton";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await GetCoupons(token);

      if (res?.status === true) {
        setCoupons(res?.data || []);
      } else {
        toast.error(res?.message || "Failed to load coupons");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <BackButton />
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && coupons.length === 0 && (
        <p className="text-gray-500">No coupons found.</p>
      )}

      {!loading && coupons.length > 0 && (
        <div className="space-y-4">
          {coupons.map((coupon, index) => (
            <div
              key={coupon._id}
              className="border rounded-lg shadow-sm overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-4 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  {coupon.image && (
                    <img
                      src={coupon.image}
                      alt={coupon.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium">{coupon.name}</span>
                </div>
                <span className="text-lg">{openIndex === index ? "−" : "+"}</span>
              </button>

              {/* Accordion Content */}
              {openIndex === index && (
                <div className="px-4 py-3 bg-white text-gray-700 animate-fadeIn space-y-1">
                  <p><strong>Code:</strong> {coupon.code}</p>
                  {/* <p><strong>Type:</strong> {coupon.type}</p> */}
                  <p><strong>Value:</strong> {coupon.value}</p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(coupon.startdate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(coupon.enddate).toLocaleDateString()}
                  </p>
                  <p><strong>Min Purchase:</strong> {coupon.minpurchasevalue}</p>
                  <p><strong>Min Coupon:</strong> {coupon.mincouponvalue}</p>
                  <p><strong>Limit:</strong> {coupon.limitation}/{coupon.totallimitation}</p>
                  {coupon.description && (
                    <p><strong>Description:</strong> {coupon.description}</p>
                  )}
                  <p>
                    <strong>Status:</strong>{" "}
                    {coupon.status ? "Active" : "Inactive"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Coupons;
