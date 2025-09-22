import React, { useEffect, useState } from "react";
import { GetCoupons } from "../../../services/User";
import toast from "react-hot-toast";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Coupons</h2>

      {loading && <p>Loading...</p>}

      {!loading && coupons?.length === 0 && <p>No coupons found.</p>}

      {!loading && coupons?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">{coupon.code}</h3>
              <p className="text-gray-600">
                Discount: <span className="font-bold">{coupon.discount}%</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Coupons;
