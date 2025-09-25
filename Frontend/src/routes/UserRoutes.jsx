import React from "react";
import { Route } from "react-router-dom";

import Userdashboard from "../pages/user/UserDashboard";
import UserLayout from "../layouts/UserLayout";
import Pricepol from "../pages/user/Pricepol";
// import SuperAdminHeader from "../components/superadmin/Header";
// import SuperAdminSidebar from "../components/superadmin/Sidebar";
import HistoryPage from "../pages/user/ContestHistory";
import UserProfile from "../pages/user/profile/UserProfile";

import HelpDesk from "../pages/user/helpdesk/HelpDesk";
import Chat from "../pages/user/helpdesk/Chat";
import WalletPage from "../pages/user/walletPage/WalletPage";
import Coupons from "../pages/user/coupons/Coupons";
import FAQ from "../pages/user/faq/FAQ";
import Blog from "../pages/user/blog/Blog";
import Content from "../pages/user/content/Content";
import Tradehistory from "../pages/user/Buysell";
import BackButton from "../pages/user/Backbutton";
import Alert from "../pages/user/alert/Alert";
import Search from "../pages/user/search/Search";
import ContestTracking from "../pages/user/contestTracking/ContestTracking"
import Kycdetails from "../pages/user/kyc/Kycdetails";
import Bankdetail from "../pages/user/bankdetail/Bankdetail";

const UserRoutes = () => {
  return (
    <>

      <Route path="/" element={<UserLayout />}>

        <Route path="dashboard" element={<Userdashboard />} />
        <Route path="pricepol" element={<Pricepol />} />
        <Route path="trade" element={<HistoryPage />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="helpdesk" element={<HelpDesk />} />
        <Route path="chat/:ticketId" element={<Chat />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="coupon" element={<Coupons />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="blog" element={<Blog />} />
        <Route path="content" element={<Content />} />
        <Route path="tradehistory" element={<Tradehistory/>}/>
        <Route path="back" element={<BackButton/>}/>
        <Route path="alert" element={<Alert/>}/>
        <Route path="search" element={<Search/>}/>
        <Route path="contesttracking" element={<ContestTracking/>}/>
        <Route path="kycdetail" element={<Kycdetails/>}/>
        <Route path="bankdetail" element={<Bankdetail/>}/>


        {/* <Route path="userheader" element={<SuperAdminHeader />} /> */}

        {/* <Route path="analytics" element={<Analytics />} />
        <Route path="games" element={<Games />} />
        <Route path="security" element={<Security />} />
        <Route path="settings" element={<Settings />} />
        <Route path="trading" element={<Trading />} />
        <Route path="user" element={<Users />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="alluser" element={<AllUsers />} />
        <Route path="activeuser" element={<ActiveUser />} />
        <Route path="AddUser" element={<AddUser />} />
        <Route path="EditUsers/:id" element={<EditUsers />} />
        <Route path="myprofile" element={<MyProfile />} />
        <Route path="changepassword" element={<ChangePassword />} />
        <Route path="email-templates" element={<EmailTemplates />} />
        <Route path="sms-providers" element={<SMSProviders />} />
        <Route path="general-settings" element={<GeneralSettings />} />
        <Route path="sms-templates" element={<SMSTemplates />} />
        <Route path="content" element={<Content />} />
        <Route path="banner" element={<Banner />} />
        <Route path="blog" element={<Blog />} />
        <Route path="news" element={<News />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="contest" element={<Contest />} />
        <Route path="add-contest" element={<AddContest />} />
      <Route path="clients" element={<Client />} /> */}
      </Route>

    </>
  );
};

export default UserRoutes;
