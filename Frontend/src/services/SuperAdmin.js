import axios from "axios";
import * as config from "../utils/config";

//User API Starts Here

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

//User API Ends Here

//MailTemplate API Starts Here

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

//Mail Template API Ends Here

//Sms Provider API Starts Here

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

//SMS Provider API Ends Here

//Basic API Starts Here

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

//Basic Setting  API Ends Here

//SMS Template API Starts Here

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

//SMS Tempelate API Ends Here

//Content API Starts Here

export async function GetContentList(token) {
  try {
    const response = await axios.get(`${config.base_url}content/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddContent(token, data) {
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

export async function UpdateContent(token, data) {
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

export async function UpdateContentStatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}content/change-status`,
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

export async function GetContentDetails(token, contentId) {
  try {
    const response = await axios.get(
      `${config.base_url}content/detail/${contentId}`,
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

//Content API Ends Here

//Banner API Starts Here

export async function GetBannerList(token) {
  try {
    const response = await axios.get(`${config.base_url}banner/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddBanner(token, data) {
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

export async function UpdateBanner(token, data) {
  try {
    const response = await axios.post(`${config.base_url}banner/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateBannerStatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}banner/change-status`,
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

export async function DeleteBanner(token, bannerId) {
  try {
    const response = await axios.get(
      `${config.base_url}banner/delete/${bannerId}  `,
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

//Banner API Ends Here

//Blogs API Starts Here

export async function GetBlogList(token) {
  try {
    const response = await axios.get(`${config.base_url}blogs/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddBlog(token, data) {
  try {
    const response = await axios.post(`${config.base_url}blogs/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateBlog(token, data) {
  try {
    const response = await axios.post(`${config.base_url}blogs/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateBlogStatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}blogs/change-status`,
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

//Blogs API Ends Here

//News API Starts Here

export async function GetNewsList(token) {
  try {
    const response = await axios.get(`${config.base_url}news/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddNews(token, data) {
  try {
    const response = await axios.post(`${config.base_url}news/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateNews(token, data) {
  try {
    const response = await axios.post(`${config.base_url}news/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetNewsDetails(token, newsId) {
  try {
    const response = await axios.get(
      `${config.base_url}news/detail/${newsId}`,
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

export async function UpdateNewsStatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}news/activenews`,
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

export async function DeleteNews(token, newsId) {
  try {
    const response = await axios.get(
      `${config.base_url}news/delete/${newsId}`,
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

//News API Ends Here


// FAQs API Starts Here

export async function GetFAQsList(token) {
  try {
    const response = await axios.get(`${config.base_url}faq/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddFAQs(token, data) {
  try {
    const response = await axios.post(`${config.base_url}faq/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateFAQs(token, data) {
  try {
    const response = await axios.put(`${config.base_url}faq/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateFAQsStatus(token, data) {
  try {
    const response = await axios.post(`${config.base_url}faq/change-status`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetActiveFAQs(token) {
  try {
    const response = await axios.get(`${config.base_url}faq/activefaq`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetFAQsDetails(token, faqId) {
  try {
    const response = await axios.get(`${config.base_url}faq/detail/${faqId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function DeleteFAQs(token, faqId) {
  try {
    const response = await axios.get(`${config.base_url}faq/delete/${faqId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

//FAQs API Ends Here

//Coupons API Start Here

export async function GetCouponsList(token) {
  try {
    const response = await axios.get(`${config.base_url}coupon/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function AddCoupons(token, data) {
  try {
    const response = await axios.post(`${config.base_url}coupon/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateCoupons(token, data) {
  try {
    const response = await axios.put(`${config.base_url}coupon/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function UpdateCouponsStatus(token, data) {
  try {
    const response = await axios.post(`${config.base_url}coupon/change-status`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetCouponsDetails(token, couponId) {
  try {
    const response = await axios.get(`${config.base_url}coupon/detail/${couponId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetActiveCoupons(token) {
  try {
    const response = await axios.get(`${config.base_url}coupon/activecoupon`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function DeleteCoupons(token, couponId) {
  try {
    const response = await axios.get(`${config.base_url}coupon/delete/${couponId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

//Coupons API Ends Here

const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
