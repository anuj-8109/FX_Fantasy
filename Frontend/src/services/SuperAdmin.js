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

// Add User

export async function AddUser(data, token) {
  try {
    const response = await axios.post(`${config.base_url}user/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!token) {
      return logout();
    }
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

// Delete User
export async function DeleteUser(token, id) {
  try {
    const response = await axios.get(`${config.base_url}user/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

// Update Or Edit User
export async function EditUser(token, data) {
  try {
    const response = await axios.put(
      `${config.base_url}user/update/${id}`,
      data,
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

export async function GetUserDetails(token, id) {
  console.log(token, id);
  try {
    const response = await axios.get(`${config.base_url}user/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function ChangePassword(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}user/change-password`,
      data,
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

export async function GetMailTemplateList(token) {
  try {
    const response = await axios.get(`${config.base_url}mailtemplate/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetMailTemplateDetails(token, id) {
  try {
    const response = await axios.get(
      `${config.base_url}mailtemplate/detail/${id}`,
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

export async function UpdateMailTemplate(token, data) {
  try {
    const response = await axios.put(
      `${config.base_url}mailtemplate/update`,
      data,
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

const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
