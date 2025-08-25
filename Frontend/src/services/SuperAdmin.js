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
      if(!token){
        return logout()
      }
     return response?.data;
  } catch (error) {
    console.log(error)
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
    return error;
  }
}

export async function StatusChange(token,status,id) {
  console.log("Token",token);
  console.log("Status and Id",status,id);
  try {
    const response = await axios.post(`${config.base_url}user/change-status`,{ status,id},{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}



const logout =()=>{
  localStorage.clear()
  window.location.href="/"
}