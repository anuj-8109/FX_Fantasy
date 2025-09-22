import React, { useEffect, useState } from "react";
import { GetCoupons } from "../../../services/User"; // adjust path
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
    <div>
      <h2>Coupons</h2>

      {loading && <p>Loading...</p>}

      {!loading && coupons?.length === 0 && <p>No coupons found.</p>}

      {!loading && coupons?.length > 0 && (
        <ul>
          {coupons.map((coupon, index) => (
            <li key={index}>
              <strong>{coupon.code}</strong> - {coupon.discount}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Coupons;
