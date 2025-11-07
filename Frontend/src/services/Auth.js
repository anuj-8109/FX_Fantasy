import axios from "axios";
import * as config from "../utils/config";

export async function LoginApi(data) {
  try {
    const response = await axios.post(`${config.base_url}user/login`, data);
    return response?.data;
  } catch (error) {
    return error;
  }
}


export async function UserLoginApi(data){
  try {
    const response = await axios.post(`${config.base_url}api/client/login-with-otp`,data);
    return response?.data;
  } catch (error) {
    return error;
  }
}


export async function OtpSubmitWithPhoneApi(data){
  try {
    const response = await axios.post(`${config.base_url}api/client/otpsubmitwithphone`,data);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function LoginWithOtpApi(data) {
  try {
    const response = await axios.post(`${config.base_url}api/client/otpsubmitwithphone`, data);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function GoogleAuthApi() {
  try {
    // const response = await axios.get(`${config.base_url}api/client/google`);
    const response = await axios.get(`${config.base_url}api/client/google`);
    return response?.data;
  } catch (error) {
    return error;
  }
}