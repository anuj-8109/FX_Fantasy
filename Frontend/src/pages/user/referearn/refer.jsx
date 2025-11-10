import React, { useEffect, useState } from "react";
import { GetUserDetails, getReferEarnData } from "../../../services/User";
import BackButton from "../Backbutton";


const ReferForm = () => {
  const [referLink, setReferLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReferrals, setShowReferrals] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const userid = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userid || !token) {
        setLoading(false);
        return;
      }
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

  useEffect(() => {
    const fetchReferData = async () => {
      if (!token || !userid) return;
      try {
        const res = await getReferEarnData(token, userid);
        if (res?.status) {
          setReferrals(res.data.referrals || []);
          setTotalEarnings(res.data.totalEarnings || 0);
        }
      } catch (error) {
        console.error("Error fetching referral data", error);
      }
    };
    fetchReferData();
  }, [token, userid]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Join using my referral link: ${referLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`Join using my referral link: ${referLink}`);
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referLink)}&text=${text}`,
      "_blank"
    );
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  const goal = 10;
  const completedCount = referrals.filter((r) => r.status === "Completed").length;
  const progressPercent = Math.min(100, Math.round((completedCount / goal) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white  px-4">
       <div className="bg-white border rounded-2xl shadow-md px-4 py-3 sm:p-4 mb-4 flex items-center justify-between">
        <h2 className="text-base sm:text-xl font-bold text-gray-800 tracking-wide">
          Refer & Earn
        </h2>
        <BackButton />
      </div>
      <div className="mx-auto w-full max-w-6xl">

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

          <div className="p-8 space-y-8">

            {/* Referral Link */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">
                Your referral link
              </p>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  readOnly
                  value={referLink}
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition active:scale-95 ${
                      copied
                        ? "bg-orange-600 text-white"
                        : "bg-orange-600 text-white hover:bg-orange-700"
                    }`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-500"
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={handleShareTelegram}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-500"
                  >
                    Telegram
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Share your referral link anywhere and earn rewards for each successful signup.
              </p>
            </div>

            {/* Earnings card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-500">Total Earnings</p>
              <p className="text-2xl font-bold text-slate-900">${totalEarnings}</p>
            </div>

            {/* Progress */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Referral Progress</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {completedCount} of {goal} referrals completed
                  </p>
                </div>
                <p className="text-sm font-bold text-indigo-600">{progressPercent}%</p>
              </div>

              <div className="mt-3 h-2 bg-white border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg,#6366f1,#a855f7)"
                  }}
                />
              </div>
            </div>

            {/* Referral List */}
            <div className="space-y-3">
              <button
                onClick={() => setShowReferrals(!showReferrals)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                {showReferrals ? "Hide referral list" : "Show referral list"}
              </button>

              {showReferrals && (
                <div className="space-y-3 animate-fadeIn">

                  {referrals.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No referrals yet. Start inviting friends!
                    </p>
                  )}

                  {referrals.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                          {r.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {r.name || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500">{r.email || "---"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <p className="text-sm font-semibold text-slate-800">
                          ${r.amount || 0}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-md ${
                            r.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t text-center text-xs text-slate-500">
            Rewards are credited after verification. By referring, you agree to Terms & Conditions.
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReferForm;
