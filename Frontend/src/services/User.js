import axios from "axios";
import * as config from "../utils/config";
import { LucideTicketsPlane, Ticket } from "lucide-react";

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
export async function JoinContest(
  contestId,
  clientId,
  price,
  discount,
  total,
  token
) {
  try {
    const response = await axios.post(
      `${config.base_url}api/list/joincontest`,
      {
        contest_id: contestId,
        client_id: clientId,
        price,
        discount,
        total,
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
export async function GetContestHistory(token, { client_id, contest_id, page }) {
  try {
    const response = await axios.post(
      `${config.base_url}api/list/gettradehistory`,
      { client_id, contest_id, page }, // body
      {
        headers: { Authorization: `Bearer ${token}` }, // config
      }
    );
    return response?.data;
  } catch (error) {
    console.error("API error", error?.response?.data || error);
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

// for Ticket Status

// get Ticket

export async function GetTicket(token, clientId) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/gettickets`,
      { clientId: clientId },
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

// Add Ticket

export async function addTicket(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/addticket`,
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
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// Ticketdetails

export async function getticketDetail(token, ticketId) {
  try {
    const response = await axios.get(
      `${config.base_url}api/client/ticketdetail/${ticketId}`,
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
export async function TicketReply(token, data) {
  console.log("data", data);
  try {
    // const response = await axios.post(
    //   `${config.base_url}api/client/ticketreply`,
    //   data,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    const formData = new FormData();
    formData.append("ticket_id", data.ticket_id);
    formData.append("client_id", data.client_id);
    formData.append("message", data.message);
    // if (file) {
    //   formData.append("attachment", data.attachment);
    // }

    const response = await axios.post(
      `${config.base_url}api/client/ticketreply`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("response", response);
    return response?.data;
  } catch (error) {
    console.log(error.response?.data);
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// AddMoney in walllet

export async function addMoneyInWallet(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/addmoneyinwallet`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// WalletHistory

export async function WalletHistory(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/getwallethistory`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// withdrolmonwy

export async function withdrolmoney(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/requestpayout`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

// withdrolmoneyList

export async function withdrolHistory(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/payoutlist`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Unknown error" };
  }
}

//Get Active Banners

export async function GetBanners(token) {
  try {
    const response = await axios.get(`${config.base_url}api/list/banner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}


// get Coupons
export async function GetCoupons(token) {

  try {
    const response = await axios.get(`${config.base_url}api/list/coupon`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

// get FAQ
export async function Getfaq(token) {
  try {
    const response = await axios.get(`${config.base_url}api/list/faq`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response?.data;
  } catch (error) {
    return response?.data;
  }
}

//getBlog 
export async function GetBlog(token) {
  try {
    const response = await axios.get(`${config.base_url}api/list/blogspagination`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response?.data;
  } catch (error) {
    return response?.data;
  }
}

// getContent


export async function getContent(token, data) {
  try {
    const response = await axios.get(
      `${config.base_url}api/list/content/${data?.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("getContent error:", error);
    return error?.response?.data;
  }
}


// BuySell trade
export async function BuySelltrade(token, payload) {
  try {
    const response = await axios.post(`${config.base_url}api/list/buyselltrade`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Network error" };
  }
}


// UpdateClient profile
export async function updateclientname(token, data) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/updateclientname`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Network error" };
  }
}

//updateclientimage 

// services/User.js
export async function updateClientImage(token, formData) {
  try {
    const response = await axios.post(
      `${config.base_url}api/client/updateclientimage`,
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
    return error?.response?.data || { status: false, message: "Network Error" };
  }
}


// KYCVarifiaction

export async function KYCVarifiaction(token, formData) {
  try {
    const response = await axios.post(`${config.base_url}api/client/manualkyc`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Network Error" }
  }
}

//Bank details

export async function addBank(token, data) {
  try {
    const response = await axios.post(`${config.base_url}api/client/addbankdetail`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Network error" }
  }
}

//getBank Account 

export async function getBankdetalis(token, client_id) {
  try {
    const response = await axios.get(`${config.base_url}api/client/listbankdetails`, {
      params: { client_id },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return response?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: "Network Error" }
  }
}

//deletebank

export async function deletebank(token, id) {
  try {
    const response = await axios.get(
      `${config.base_url}api/client/deletebank`,
      {
        params: { id }, 
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || {
      status: false,
      message: "Network Error",
    };
  }
}
