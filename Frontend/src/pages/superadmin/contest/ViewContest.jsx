import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  GetContestDetails,
  GetContestRanking,
} from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import toast from "react-hot-toast";

const ViewContest = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // contest data
  const [contest, setContest] = useState(location.state || null);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);

  // for ranks data
  const [prizeDist, setPrizeDist] = useState([]);
  const [memberRanks, setMemberRanks] = useState([]);

  useEffect(() => {
    fetchContestDetails();
    fetchMemberRank();
  }, [id]);

  const fetchContestDetails = async () => {
    setLoading(true);
    try {
      const res = await GetContestDetails(token, id);
      if (res?.status) {
        setContest(res.data);
        setPrizeDist(res.data?.prize_distribution || []);
        // setMemberRanks(res.data?.member_ranks || []);
      } else {
        toast.error(res?.message || "Failed to fetch contest details");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching contest details");
    }
    setLoading(false);
  };

  const fetchMemberRank = async () => {
    setLoading(true);
    try {
      const res = await GetContestRanking(token, { contest_id: id });
      if (res?.status) {
        const formattedData = res.data?.map((item) => ({
          member_name: item?.client_id?.FullName || "-",
          email: item?.client_id?.Email || "-",
          phone: item?.client_id?.PhoneNo || "-",
          rank: item?.rank || "-",
          points: item?.points || 0,
          wallet_balance: item?.wallet_balance || 0,
          joined_at: item?.joined_at
            ? new Date(item.joined_at).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
        }));
        setMemberRanks(formattedData);
      } else {
        toast.error(res?.message || "Failed to fetch contest ranking");
      }
    } catch (err) {
      toast.error("Something went wrong while fetching contest ranking");
    }
    setLoading(false);
  };

  return (
    <Content
      Page_title="Contest Details"
      button_title="Back"
      button_status={true}
      route="/superadmin/contest"
    >
      <div className="p-4 bg-white rounded-xl shadow-md">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium ${
              activeTab === "details"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            View Details
          </button>
          <button
            onClick={() => setActiveTab("ranks")}
            className={`px-4 py-2 font-medium ${
              activeTab === "ranks"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            View Ranks
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 font-medium ${
              activeTab === "members"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Member Ranks
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Contest Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {contest?.name || "-"}
              </div>

              <div>
                <strong>Type:</strong> {contest?.contest_type || "-"}
              </div>

              <div>
                <strong>Entry Fee:</strong> ₹{contest?.entry_fee || 0}
              </div>

              {/* <div>
                <strong>Total Spots:</strong> {contest?.total_spots || 0}
              </div>

              <div>
                <strong>Filled Spots:</strong> {contest?.filled_spots || 0}
              </div> */}

              <div>
                <strong>Spots:</strong> {contest?.filled_spots || 0}/
                {contest?.total_spots || 0}
              </div>

              <div>
                <strong>Prize Pool:</strong> ₹{contest?.prize_pool || 0}
              </div>

              <div>
                <strong>Max Entry/User:</strong>{" "}
                {contest?.max_entry_per_user || 0}
              </div>

              <div>
                <strong>Status:</strong>{" "}
                {contest?.activestatus ? "Active" : "Inactive"}
              </div>

              <div>
                <strong>Type Flags:</strong>{" "}
                {contest?.is_guaranteed && contest?.is_private
                  ? "Guaranteed, Private"
                  : contest?.is_guaranteed
                  ? "Guaranteed"
                  : contest?.is_private
                  ? "Private"
                  : "-"}
              </div>

              <div>
                <strong>Created Date:</strong>
                <p className="text-gray-700 mt-1">
                  {contest?.created_at
                    ? new Date(contest.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>
              </div>

              <div className="col-span-2">
                <strong>Description:</strong>
                <div
                  className="text-gray-700 mt-1 prose"
                  dangerouslySetInnerHTML={{
                    __html:
                      contest?.description ||
                      "<p>No description available.</p>",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "ranks" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Prize Distribution</h2>
            {prizeDist?.length > 0 ? (
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Rank</th>
                    <th className="border px-3 py-2 text-left">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {prizeDist.map((p, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2">{p.rank}</td>
                      <td className="border px-3 py-2">{p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No prize distribution data found.</p>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Member Ranks</h2>
            {memberRanks?.length > 0 ? (
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">#</th>
                    <th className="border px-3 py-2 text-left">Member Name</th>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-3 py-2 text-left">Phone</th>
                    <th className="border px-3 py-2 text-left">Rank</th>
                    <th className="border px-3 py-2 text-left">Points</th>
                    <th className="border px-3 py-2 text-left">
                      Wallet Balance
                    </th>
                    <th className="border px-3 py-2 text-left">Joined At</th>
                  </tr>
                </thead>
                <tbody>
                  {memberRanks.map((m, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2">{i + 1}</td>
                      <td className="border px-3 py-2">{m.member_name}</td>
                      <td className="border px-3 py-2">{m.email}</td>
                      <td className="border px-3 py-2">{m.phone}</td>
                      <td className="border px-3 py-2">{m.rank}</td>
                      <td className="border px-3 py-2">{m.points}</td>
                      <td className="border px-3 py-2">₹{m.wallet_balance}</td>
                      <td className="border px-3 py-2">{m.joined_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No member rank data found.</p>
            )}
          </div>
        )}
      </div>
    </Content>
  );
};

export default ViewContest;
