
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

// History
export async function GetContestHistory(token, data) {
  try {
    const url = `${config.base_url}api/list/gettradehistory`;
    const response = await axios.post(
      url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("API error", error?.response || error);
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}


// get user details
export async function GetUserDetails(token, id) {
  try {
    const response = await axios.get(
      `${config.base_url}api/client/detail/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("API error", error?.response || error);
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}