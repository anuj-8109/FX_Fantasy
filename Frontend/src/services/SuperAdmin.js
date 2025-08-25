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
    return error;
  }
}


// Add User 

export async function AddUser(data,token){
  try {
    const response = await axios.post(`${config.base_url}user/add`,data,
      {
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
     return response?.data;
  } catch (error) {
    console.log(error)
  }
}