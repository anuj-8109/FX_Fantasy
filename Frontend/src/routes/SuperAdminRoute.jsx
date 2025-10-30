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
import Client from "../pages/superadmin/clients/Clients";
import AddContest from "../pages/superadmin/contest/AddContest";
import Tournament from "../pages/superadmin/tournament/Tournament";
import AddTournament from "../pages/superadmin/tournament/AddTournament";
import HelpDesk from "../pages/superadmin/helpdesk/HelpDesk";
import Chatreply from "../pages/superadmin/helpdesk/Chatreply";
import Withdrawal from "../pages/superadmin/withdrawal/Withdrawal";
import Viewtournamentcontest from "../pages/superadmin/contest/Viewtournamentcontest";
import Kycinformation from "../pages/superadmin/basicsettings/kycinformation";
import Referearn from "../pages/superadmin/basicsettings/Referearn";
import Kycapproval from "../pages/superadmin/kycapproval/Kycapproval";
import Bankdetails from "../pages/superadmin/bankdetails/Bankdetails";
import ViewContest from "../pages/superadmin/contest/ViewContest";
import AddCoupon from "../pages/superadmin/coupons/AddCoupon";
import AddEditFAQ from "../pages/superadmin/faqs/AddFAQs";
import AddEditNews from "../pages/superadmin/news/AddNews";
import AddEditBlog from "../pages/superadmin/blog/AddBlog";
import AddEditContent from "../pages/superadmin/content/AddContent";
import AddEditBanner from "../pages/superadmin/banner/AddBanner";
import AddEditClient from "../pages/superadmin/clients/AddClient";
import Revenue from "../pages/superadmin/revenue/Revenue";
import Winnings from "../pages/superadmin/winning/Winnings";
import Notifications from "../pages/superadmin/notification/Notifiaction";
import ActiveClient from "../pages/superadmin/clients/ActiveClient";
import InactiveClient from "../pages/superadmin/clients/InActiveClient";
import UpcomingTournament from "../pages/superadmin/tournament/UpComingTournament";
import CompletedTournament from "../pages/superadmin/tournament/CompletedTornament";
import LiveTournament from "../pages/superadmin/tournament/LiveTournament";
import CancelledTournament from "../pages/superadmin/tournament/CancelledTournament";
import ActiveContest from "../pages/superadmin/contest/ActiveContest";
import InactiveContest from "../pages/superadmin/contest/InActiveContest";

const SuperAdminRoutes = () => {
  return (
    <>
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route path="dashboard" element={<SuperAdminDashboard />} />
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
        <Route path="clients" element={<Client />} />
        <Route path="tournament" element={<Tournament />} />
        <Route path="add-tournament" element={<AddTournament />} />
        <Route path="help" element={<HelpDesk />} />
        <Route path="chatreply/:ticketId" element={<Chatreply />} />
        <Route path="withdrawal" element={<Withdrawal />} />
        <Route path="tournamentcontest" element={<Viewtournamentcontest />} />
        <Route path="kycinformation" element={<Kycinformation />} />
        <Route path="referearn" element={<Referearn />} />
        <Route path="kycapproval" element={<Kycapproval />} />
        <Route path="bankdetail" element={<Bankdetails />} />
        <Route path="viewcontest/:id" element={<ViewContest />} />
        <Route path="add-coupon" element={<AddCoupon />} />
        <Route path="add-faq" element={<AddEditFAQ />} />
        <Route path="add-news" element={<AddEditNews />} />
        <Route path="add-blog" element={<AddEditBlog />} />
        <Route path="add-content" element={<AddEditContent />} />
        <Route path="add-banner" element={<AddEditBanner />} />
        <Route path="add-client" element={<AddEditClient />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="winning" element={<Winnings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="activeclient" element={<ActiveClient />} />
        <Route path="inactiveclient" element={<InactiveClient />} />
        <Route path="upcomingtournament" element={<UpcomingTournament />} />
        <Route path="completedtournamnet" element={<CompletedTournament />} />
        <Route path="livetournament" element={<LiveTournament />} />
        <Route path="cancelledtournament" element={<CancelledTournament/>}/>
        <Route path="activecontest" element={<ActiveContest/>}/>
        <Route path="inactivecontest" element={<InactiveContest/>}/>
      </Route>
    </>
  );
};

export default SuperAdminRoutes;
