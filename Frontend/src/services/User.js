
import axios from "axios";
import * as config from "../utils/config";

// tournament service

export async function GetTurnament(token) {
  try {
    const response = await axios.get(
      `${config.base_url}api/list/getupcomingtournaments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}


// Get contest by turnament
export async function GetContestByTurnament(tournamentId, token) {
  try {
    const response = await axios.get(
      `${config.base_url}api/list/getcontestsbytournamentid/${tournamentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}


// join contest
export async function JoinContest(contestId, clientId, price, discount, total, token) {
  try {
    const response = await axios.post(
      `${config.base_url}api/list/joincontest`,
      {
        contest_id: contestId,
        client_id: clientId,
        price,
        discount,
        total
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

// get my contests
export async function GetMyContests(token, clientId) {
  if (!token || !clientId) {
    throw new Error("Token and Client ID are required");
  }

  try {
    const response = await axios.post(
      `${config.base_url}api/list/mycontests`,
      { client_id: clientId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("API error", error);
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}



