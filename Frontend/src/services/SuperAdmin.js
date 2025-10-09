import axios from "axios";
import * as config from "../utils/config";
import { GetTicket, TicketReply } from "./User";

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

export async function AddUser(data, token) {
  try {
    const response = await axios.post(`${config.base_url}user/add`, data, {
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

export async function UpdatePermissions(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}user/update-permissions`,
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

export async function UpdateProfile(token, data) {
  try {
    const response = await axios.put(
      `${config.base_url}user/update-profile`,
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

export async function ForgotPassword(token, email) {
  try {
    const response = await axios.post(
      `${config.base_url}user/forgot-password`,
      email,
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

export async function ResetPassword(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}user/reset-password`,
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

export async function GetSMSTemplateDetails(token, id) {
  try {
    const response = await axios.get(
      `${config.base_url}smstemplate/detail/${id}`,
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

export async function GetActiveContent(token) {
  try {
    const response = await axios.get(
      `${config.base_url}content/activecontent`,
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

export async function GetBannerDetails(token, bannerId) {
  try {
    const response = await axios.get(
      `${config.base_url}banner/detail/${bannerId}`,
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

export async function GetActiveBanners(token) {
  try {
    const response = await axios.get(`${config.base_url}banner/activebanner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

export async function GetBlogDetails(token, blogId) {
  try {
    const response = await axios.get(
      `${config.base_url}blogs/detail/${blogId}`,
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

export async function GetActiveBlogs(token) {
  try {
    const response = await axios.get(`${config.base_url}blogs/activeblogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function DeleteBlog(token, blogId) {
  try {
    const response = await axios.get(
      `${config.base_url}blogs/delete/${blogId}`,
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
      `${config.base_url}news/change-status`,
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

export async function GetActiveNews(token) {
  try {
    const response = await axios.get(`${config.base_url}news/activenews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    const response = await axios.post(
      `${config.base_url}faq/change-status`,
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
    const response = await axios.post(
      `${config.base_url}coupon/change-status`,
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

export async function GetCouponsDetails(token, couponId) {
  try {
    const response = await axios.get(
      `${config.base_url}coupon/detail/${couponId}`,
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
    const response = await axios.get(
      `${config.base_url}coupon/delete/${couponId}`,
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

export async function ShowChangeStatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}coupon/show-change-status`,
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

//Coupons API Ends Here

//Client API Start here

export async function AddClient(token, data) {
  try {
    const response = await axios.post(`${config.base_url}client/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetClientsWithFilter(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}client/listwithfilter`,
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

export async function DeleteClientsWithFilter(token, filters) {
  try {
    const response = await axios.post(
      `${config.base_url}client/deletelistwithfilter`,
      filters,
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

export async function GetClientDetails(token, clientId) {
  try {
    const response = await axios.get(
      `${config.base_url}client/detail/${clientId}`,
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

export async function DeleteClient(token, clientId) {
  try {
    const response = await axios.get(
      `${config.base_url}client/delete/${clientId}`,
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

export async function UpdateClientStatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}client/change-status`,
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

export async function UpdateClient(token, data) {
  try {
    const response = await axios.put(`${config.base_url}client/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

// Client API Ends Here

//Contest API Start Here

export async function AddContest(token, data) {
  try {
    const response = await axios.post(`${config.base_url}contest/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function GetContestsList(
  token,
  { page = 1, limit = 10, filter = "" } = {}
) {
  try {
    const response = await axios.get(
      `${config.base_url}contest/list?page=${page}&limit=${limit}&filter=${filter}`,
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

export async function GetContestDetails(token, contestId) {
  try {
    const response = await axios.get(
      `${config.base_url}contest/detail/${contestId}`,
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

export async function UpdateContest(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}contest/update`,
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

export async function DeleteContest(token, contestId) {
  try {
    const response = await axios.get(
      `${config.base_url}contest/delete/${contestId}`,
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

export async function UpdateContestStatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}contest/change-status`,
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

export async function UpdateContestStatusActive(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}contest/change-status-active`,
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

export async function GetContestStockList(token) {
  try {
    const response = await axios.get(`${config.base_url}contest/stock-list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

//Tournament

export async function GetTournament(token) {
  try {
    // const response = await axios.get(`${config.base_url}tournament/list?page=1&status=live&search=Mega`),
    const response = await axios.get(`${config.base_url}tournament/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function addTournament(data, token) {
  try {
    const response = await axios.post(
      `${config.base_url}tournament/add`,
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

// Upadate tournament
export async function UpdateTournament(data, token) {
  try {
    const response = await axios.post(
      `${config.base_url}tournament/update`,
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

// delete tournament

export async function DeleteTournament(_id, token) {
  try {
    const response = await axios.get(
      `${config.base_url}tournament/delete/${_id}`,
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

export async function UpdateTournamentStatus(data, token) {
  try {
    const response = await axios.post(
      `${config.base_url}tournament/change-status`,
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

export async function UpdateTournamentStatusActive(data, token) {
  try {
    const response = await axios.post(
      `${config.base_url}tournament/change-status-active`,
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

export async function GetTournamentById(token, id) {
  try {
    const response = await axios.get(
      `${config.base_url}tournament/detail/${id}`,
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

// ChangePassword
export async function PassWordChange(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}user/change-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Password change API error", error?.response || error);
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// Tickes

// GetTicket
export async function GetTicketsuper(
  token,
  clientId,
  { page = 1, limit = 10, filter = "" } = {}
) {
  try {
    const response = await axios.post(
      `${config.base_url}ticket/listwithfilter`,
      { clientId, page, limit, filter },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return (
      error.response?.data || { status: false, message: "Something went wrong" }
    );
  }
}

// getdetailsticket
export async function getticketDetailAdmin(token, ticketId) {
  try {
    const response = await axios.get(
      `${config.base_url}ticket/detail/${ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// TicketReply

export async function TicketReplyadmin(token, data) {
  try {
    const formData = new FormData();
    formData.append("ticket_id", data.ticket_id);
    formData.append("message", data.message);
    formData.append("adminname", data.adminname);

    const response = await axios.post(
      `${config.base_url}ticket/reply`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log(error.response?.data);
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// ticketStatus

export async function ticketstatus(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}ticket/change-status`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// withdrawalPayoutrequest
export async function withdrawalPayoutrequest(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}client/process-payout-request`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unkmown error" };
  }
}

export async function payoutlist(token, params) {
  try {
    const response = await axios.get(`${config.base_url}client/payoutlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

//Stock List

export async function stocklist(token) {
  try {
    const response = await axios.get(`${config.base_url}contest/stocklist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getContestsByTournamentId(token, tournament_id) {
  if (!tournament_id)
    return { status: false, message: "Tournament ID missing" };

  try {
    const response = await axios.get(
      `${config.base_url}contest/getcontestsbytournamentid/${tournament_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

// get state client
export async function getState(token) {
  try {
    const response = await axios.get(`${config.base_url}api/list/getstates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Network Error" };
  }
}

export async function getStateByCity(stateName, token) {
  try {
    const response = await axios.get(
      `${config.base_url}api/list/getcitybystates/${stateName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

// getBank details

export async function getBankdetails(token, client_id) {
  try {
    const response = await axios.get(
      `${config.base_url}client/listbankdetails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { client_id },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Server error" };
  }
}

//get Kyc details

export async function kyc_verification(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}client/kycverificationupdate`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Server Error" };
  }
}

// Contest API Ends Here

const logout = () => {
  localStorage.clear();
  window.location.href = "/superadminlogin";
};
