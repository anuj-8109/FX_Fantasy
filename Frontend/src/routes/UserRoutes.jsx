import React from "react";
import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/UserLayout";
import UserDashboard from "../pages/user/UserDashboard";
import SuperAdminHeader from "../components/superadmin/Header";
// import SuperAdminSidebar from "../components/superadmin/Sidebar";


const UserRoutes = () => {
  return (
    <>
      <Route path="/user" element={<UserLayout />}>
      
        <Route path="userdashboard" element={<UserDashboard />} />
        <Route path="userheader" element={<SuperAdminHeader />} />
      
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
