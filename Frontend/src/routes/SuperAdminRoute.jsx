import React from "react";
import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import SuperAdminHeader from "../components/superadmin/Header";
import SuperAdminSidebar from "../components/superadmin/Sidebar";
import Analytics from "../pages/superadmin/Analytics";
import Games from "../pages/superadmin/Games";
import Security from "../pages/superadmin/Security";
import Settings from "../pages/superadmin/Settings";
import Trading from "../pages/superadmin/Trading";
import Users from "../pages/superadmin/Users";
import Wallet from "../pages/superadmin/Wallet";
import AllUsers from "../pages/superadmin/users/AllUser";
import ActiveUser from "../pages/superadmin/users/ActiveUser";
import AddUser from "../pages/superadmin/users/AddUser";
import EditUsers from "../pages/superadmin/users/EditUser";
import MyProfile from "../pages/superadmin/profile/MyProfile";
import ChangePassword from "../pages/superadmin/profile/ChangePassword";
import EmailTemplates from "../pages/superadmin/basicsettings/EmailTemplates";
import SMSProviders from "../pages/superadmin/basicsettings/SMSProvider";
import GeneralSettings from "../pages/superadmin/basicsettings/GeneralSettings";
import SMSTemplates from "../pages/superadmin/basicsettings/SMSTemplates";
import Content from "../pages/superadmin/content/Content";
import Banner from "../pages/superadmin/banner/Banner";
import Blog from "../pages/superadmin/blog/Blog";
import News from "../pages/superadmin/news/News";
import FAQs from "../pages/superadmin/faqs/FAQs";
import Coupons from "../pages/superadmin/coupons/Coupons";
import Contest from "../pages/superadmin/contest/Contest";

const SuperAdminRoutes = () => {
  return (
    <>
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route path="superadmindashboard" element={<SuperAdminDashboard />} />
        <Route path="superadminheader" element={<SuperAdminHeader />} />
        <Route path="superadminsidebar" element={<SuperAdminSidebar />} />
        <Route path="analytics" element={<Analytics />} />
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
      </Route>
    </>
  );
};

export default SuperAdminRoutes;
