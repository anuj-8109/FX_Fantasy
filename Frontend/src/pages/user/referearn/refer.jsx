import React, { useEffect, useState } from "react";
import { GetUserDetails } from "../../../services/User";

const ReferForm = () => {
    const [referLink, setReferLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Get user ID and token from localStorage
    const userid = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!userid || !token) return;

            try {
                const res = await GetUserDetails(token, userid); // use userid from localStorage
                if (res.status && res.data?.refer_token) {
                    setReferLink(`${window.location.origin}/?refer=${res.data.refer_token}`);
                    // Update localStorage with latest user data
                    localStorage.setItem("user", JSON.stringify(res.data));
                }
            } catch (err) {
                console.error("Error fetching user details", err);
            }
            setLoading(false);
        };

        fetchUser();
    }, [userid, token]); // use userid, not undefined user

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
    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        if (user && user.refer_token) {
            setReferLink(`${window.location.origin}/?refer=${user.refer_token}`);
        }
    }, [user]);


    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-800 via-pink-700 to-orange-500">
            <div className="w-full max-w-3xl bg-gray-900 text-white rounded-3xl p-8 shadow-2xl">
                <h2 className="text-4xl font-bold text-yellow-400 text-center mb-4">🎯 Refer & Earn</h2>
                <p className="text-gray-300 mb-6 text-center">
                    Invite your friends, earn coins, and boost your rewards!
                </p>

                <div className="flex gap-2 mb-4 bg-gray-700 rounded-full overflow-hidden">
                    <input
                        type="text"
                        value={referLink}
                        readOnly
                        className="flex-1 px-4 py-3 bg-transparent text-white font-mono outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-yellow-400 text-gray-900 font-bold px-4 py-3 hover:bg-yellow-500 transition-colors"
                    >
                        {copied ? "✅ Copied!" : "Copy"}
                    </button>
                </div>

                <div className="flex gap-4 flex-col sm:flex-row">
                    <button
                        className="w-full bg-blue-500 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors"
                    >
                        Apply My Referral
                    </button>
                    <button
                        onClick={handleShareWhatsApp}
                        className="w-full bg-green-500 py-3 rounded-full font-bold hover:bg-green-600 transition-colors"
                    >
                        Share on WhatsApp
                    </button>
                </div>

                {message && <div className="mt-4 text-yellow-300 font-bold text-center">{message}</div>}
            </div>
        </div>
    );
};

export default ReferForm;
