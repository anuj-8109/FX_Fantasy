import React, { useEffect, useState } from 'react';
import { ListPrivateContests, SharePrivateContest } from '../../../services/User';

function GetPrivateContest() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareMsg, setShareMsg] = useState(null);

  const token = localStorage.getItem('token');
  const client_id = localStorage.getItem('client_id'); // current client

  const fetchContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ListPrivateContests(token, client_id);
      if (data.status) setContests(data.contests);
      else setError(data.message || 'Failed to fetch contests');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleShare = async (contest_id, target_client_id) => {
    setShareMsg(null);
    try {
      const data = await SharePrivateContest(token, contest_id, target_client_id, client_id);
      if (data.status) {
        setShareMsg(`Contest shared successfully with client ${target_client_id}`);
      } else {
        setShareMsg(`Failed to share: ${data.message}`);
      }
    } catch (err) {
      setShareMsg(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading contests...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!contests.length) return <p>No private contests available.</p>;

  return (
    <div>
      <h2>Private Contests</h2>
      {shareMsg && <p>{shareMsg}</p>}
      <ul>
        {contests.map((contest) => (
          <li key={contest._id} style={{ marginBottom: '10px' }}>
            <strong>{contest.name}</strong> - {contest.description} <br />
            <input
              type="text"
              placeholder="Enter client ID to share"
              id={`share-client-${contest._id}`}
            />
            <button
              onClick={() => {
                const target_client_id = document.getElementById(`share-client-${contest._id}`).value;
                if (target_client_id) handleShare(contest._id, target_client_id);
              }}
              style={{ marginLeft: '5px' }}
            >
              Share
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GetPrivateContest;
