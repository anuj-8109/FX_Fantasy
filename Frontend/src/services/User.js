
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

export async function GetContestByTurnament(token,tournament_id) {
    try {
        const response = await axios.get(
            `${config.base_url}api/list/getcontestsbytournamentid/${tournament_id}`,
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