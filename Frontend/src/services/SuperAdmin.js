import axios from "axios";
import * as config from "../utils/config";

export async function GetAllUser(token) {
  try {
    const response = await axios.get(`${config.base_url}user/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetActiveUser(token) {
  try {
    const response = await axios.get(`${config.base_url}user/activeuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function StatusChange(token, status, id) {
  try {
    const response = await axios.post(
      `${config.base_url}user/change-status`,
      { status, id },
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
