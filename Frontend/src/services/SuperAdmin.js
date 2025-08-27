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
    const response = await axios.put(`${config.base_url}user/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

export async function GetSmsProviderList(token) {
  try {
    const response = await axios.get(`${config.base_url}smsprovider/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateSmsProvider(token, data) {
  try {
    const response = await axios.put(
      `${config.base_url}smsprovider/update`,
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

export async function UpdateSmsProviderStatus(token, providerId) {
  try {
    const response = await axios.post(
      `${config.base_url}smsprovider/changestatus`,
      providerId,
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

export async function GetBasicSettingDetails(token) {
  try {
    const response = await axios.get(`${config.base_url}basicsetting/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateBasicSettings(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}basicsetting/add`,
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
export async function GetSMSTemplateList(token) {
  try {
    const response = await axios.get(`${config.base_url}smstemplate/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateSMSTemplate(token, data) {
  try {
    const response = await axios.put(
      `${config.base_url}smstemplate/update`,
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

export async function GetContentList(token){
  try{
    const response = await axios.get(`${config.base_url}content/list`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddContent(token,data){

  try {
    const response = await axios.post(`${config.base_url}content/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateContent(token,data){

  try {
    const response = await axios.put(`${config.base_url}content/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateContentStatus(token,data) {
  try {
    const response = await axios.post(`${config.base_url}content/change-status`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
} 

export async function GetContentDetails(token, contentId) {
  try {
    const response = await axios.get(`${config.base_url}content/detail/${contentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetBannerList(token){
  try{
    const response = await axios.get(`${config.base_url}banner/list`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddBanner(token,data){

  try {
    const response = await axios.post(`${config.base_url}banner/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateBanner(token,data){

  try {
    const response = await axios.put(`${config.base_url}banner/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateBannerStatus(token,data) {
  try {
    const response = await axios.post(`${config.base_url}banner/change-status`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
