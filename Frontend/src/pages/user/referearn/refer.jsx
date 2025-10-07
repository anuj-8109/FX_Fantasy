import React, { useEffect, useState } from "react";
import { GetUserDetails, getReferEarnData } from "../../../services/User";

const ReferForm = () => {
  const [referLink, setReferLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReferrals, setShowReferrals] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const userid = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch user details and generate referral link
  useEffect(() => {
    const fetchUser = async () => {
      if (!userid || !token) return;
      try {
        const res = await GetUserDetails(token, userid);
        if (res.status && res.data?.refer_token) {
          setReferLink(`${window.location.origin}/?refer=${res.data.refer_token}`);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching user details", err);
      }
      setLoading(false);
    };
    fetchUser();
  }, [userid, token]);

  // Fetch referral data
  useEffect(() => {
    const fetchReferData = async () => {
      if (!token || !userid) return;
      try {
        const res = await getReferEarnData(token, userid);
        if (res?.status) {
          setReferrals(res.data.referrals || []);
          setTotalEarnings(res.data.totalEarnings || 0);
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("Error fetching referral data", error);
      }
    };
    fetchReferData();
  }, [token, userid]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=Join using my referral link: ${referLink}`,
      "_blank"
    );
  };

  if (loading) return <div className="text-gray-600 text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-8 text-center relative">
        {/* Back Arrow */}
        <div className="absolute left-5 top-5 text-gray-600 text-xl cursor-pointer">←</div>

        {/* Header */}
        <h2 className="text-gray-800 text-2xl font-semibold mt-4">Invite & Earn</h2>

        {/* Gift Image */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
          alt="Gift Box"
          className="mx-auto mt-6 mb-4 w-40 h-40 object-contain "
        />

        {/* Reward Text */}
        <p className="text-gray-600">Refer 10 friends and earn</p>
        <h3 className="text-3xl font-bold text-green-600 mb-6">$10</h3>

        {/* Referral Link Box */}
        <div className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-inner mb-6">
          <input
            type="text"
            value={referLink}
            readOnly
            className="flex-1 px-4 py-2 text-sm bg-transparent outline-none text-gray-700"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-4 py-2 font-semibold hover:bg-blue-600 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Buttons */}
        <button
          onClick={handleShareWhatsApp}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition mb-3"
        >
          Share & Earn Now
        </button>

        {/* Earnings Section */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left shadow-inner">
          <p className="text-gray-700 font-medium">Total Earnings</p>
          <h4 className="text-xl font-bold text-green-600 mt-1">${totalEarnings}</h4>

          {/* Expand/Collapse Referral List */}
          <button
            onClick={() => setShowReferrals(!showReferrals)}
            className="mt-3 w-full flex justify-between items-center text-gray-600 text-sm font-medium"
          >
            <span>Referrals</span>
            <span>{showReferrals ? "▲" : "▼"}</span>
          </button>

          {showReferrals && (
            <div className="mt-3">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(referrals.filter((r) => r.status === "Completed").length / 10) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {referrals.filter((r) => r.status === "Completed").length} of 10 completed
              </p>

              {/* Referral List */}
              {referrals.map((r, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-none"
                >
                  <span className="text-gray-700 text-sm">{r.name}</span>
                  <span className="text-gray-700 text-sm">{r.amount}</span>
                  <span
                    className={`text-xs font-semibold ${
                      r.status === "Completed" ? "text-green-600" : "text-yellow-500"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferForm;
