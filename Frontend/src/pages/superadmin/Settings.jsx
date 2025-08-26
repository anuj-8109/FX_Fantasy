import React, { useState } from "react";
import Swal from "sweetalert2";


const Settings = () => {
  const [general, setGeneral] = useState({
    siteName: "Dream Trading App",
    siteDescription: "Fantasy Trading Contest Platform",
    supportEmail: "support@dreamtrading.com",
    maintenanceMode: false,
    registrationEnabled: true,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    contestReminders: true,
    prizeNotifications: true,
    systemAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactorRequired: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    ipWhitelist: "",
    maxLoginAttempts: 5,
  });

  const [payments, setPayments] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    usdtEnabled: true,
    minDeposit: 10,
    maxWithdrawal: 10000,
    withdrawalFee: 2.5,
  });

  const handleSave = (title) => {
    Swal.fire({
      icon: "success",
      title: `${title} Saved`,
      text: `Your ${title.toLowerCase()} have been updated successfully.`,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  };

  return (
    <div className="min-h-screen flex w-full">
    
      <div className="flex-1 flex flex-col">
      
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          {/* Example: General Settings Form */}
          <div className="mb-4">
            <label>Site Name</label>
            <input
              type="text"
              value={general.siteName}
              onChange={(e) =>
                setGeneral({ ...general, siteName: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            onClick={() => handleSave("General Settings")}
            className="bg-blue-600  px-4 py-2 rounded"
          >
            Save General Settings
          </button>
        </main>
      </div>
    </div>
  );
};

export default Settings;
