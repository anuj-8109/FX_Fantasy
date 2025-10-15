// import React from "react";

// const SuperAdminDashboard = () => {

//   const currentAppType = {
//     id: "ecommerce",
//     name: "Ecommerce",
//     features: ["Product Management", "Order Tracking", "Customer Support"],
//   };

//   const adminUser = { name: "Shakti" };

//   const stats = [
//     { title: "Total Sales", value: "$45,231", change: "+20.1%", changeType: "positive" },
//     { title: "Orders", value: "1,234", change: "+12.5%", changeType: "positive" },
//     { title: "Customers", value: "8,642", change: "+8.2%", changeType: "positive" },
//     { title: "Revenue", value: "$12,234", change: "+15.3%", changeType: "positive" },
//   ];

//   const activities = [
//     { action: "User registration", time: "2 minutes ago", type: "success" },
//     { action: "Database backup", time: "15 minutes ago", type: "info" },
//     { action: "Security scan", time: "1 hour ago", type: "warning" },
//     { action: "System update", time: "3 hours ago", type: "success" },
//   ];

//   return (
//   <div className="min-h-screen flex w-full dashBoardSuper">

//   <div className="flex-1 flex flex-col">
   
//     <main className="flex-1 p-6 overflow-auto ">
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//             <p className="text-muted-foreground">
//               Welcome back, Game Master! Here's what's happening with your game
//               arena.
//             </p>
//           </div>
//           <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-sm">
//             Gaming Neon Theme
//           </div>
//         </div>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
//             <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
//               <h3 className="tracking-tight text-sm font-medium">
//                 Total Users
//               </h3>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={24}
//                 height={24}
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-users h-4 w-4 text-muted-foreground"
//               >
//                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                 <circle cx={9} cy={7} r={4} />
//                 <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//               </svg>
//             </div>
//             <div className="p-6 pt-0">
//               <div className="text-2xl font-bold">12,345</div>
//               <p className="text-xs text-green-600">+14.2% from last month</p>
//             </div>
//           </div>
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
//             <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
//               <h3 className="tracking-tight text-sm font-medium">
//                 Active Sessions
//               </h3>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={24}
//                 height={24}
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-activity h-4 w-4 text-muted-foreground"
//               >
//                 <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
//               </svg>
//             </div>
//             <div className="p-6 pt-0">
//               <div className="text-2xl font-bold">3,456</div>
//               <p className="text-xs text-green-600">+8.9% from last month</p>
//             </div>
//           </div>
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
//             <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
//               <h3 className="tracking-tight text-sm font-medium">Revenue</h3>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={24}
//                 height={24}
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-dollar-sign h-4 w-4 text-muted-foreground"
//               >
//                 <line x1={12} x2={12} y1={2} y2={22} />
//                 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//               </svg>
//             </div>
//             <div className="p-6 pt-0">
//               <div className="text-2xl font-bold">$23,456</div>
//               <p className="text-xs text-green-600">+22.1% from last month</p>
//             </div>
//           </div>
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
//             <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
//               <h3 className="tracking-tight text-sm font-medium">
//                 Growth Rate
//               </h3>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={24}
//                 height={24}
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-trending-up h-4 w-4 text-muted-foreground"
//               >
//                 <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
//                 <polyline points="16 7 22 7 22 13" />
//               </svg>
//             </div>
//             <div className="p-6 pt-0">
//               <div className="text-2xl font-bold">15.8%</div>
//               <p className="text-xs text-green-600">+5.2% from last month</p>
//             </div>
//           </div>
//         </div>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
//             <div className="flex flex-col space-y-1.5 p-6">
//               <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
//                 <span className="text-xl">🎮</span>Game Arena Features
//               </h3>
//               <p className="text-sm text-muted-foreground">
//                 Key capabilities of your current application type
//               </p>
//             </div>
//             <div className="p-6 pt-0 space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Tournament Brackets</span>
//                 <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
//                   Active
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Player Rankings</span>
//                 <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
//                   Active
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Prize Pools</span>
//                 <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
//                   Active
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Live Streaming</span>
//                 <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
//                   Active
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
//             <div className="flex flex-col space-y-1.5 p-6">
//               <h3 className="text-2xl font-semibold leading-none tracking-tight">
//                 System Performance
//               </h3>
//               <p className="text-sm text-muted-foreground">
//                 Current system health and performance metrics
//               </p>
//             </div>
//             <div className="p-6 pt-0 space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>CPU Usage</span>
//                   <span>67%</span>
//                 </div>
//                 <div
//                   aria-valuemax={100}
//                   aria-valuemin={0}
//                   role="progressbar"
//                   data-state="indeterminate"
//                   data-max={100}
//                   className="relative w-full overflow-hidden rounded-full bg-secondary h-2"
//                 >
//                   <div
//                     data-state="indeterminate"
//                     data-max={100}
//                     className="h-full w-full flex-1 bg-primary transition-all"
//                     style={{ transform: "translateX(-33%)" }}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Memory Usage</span>
//                   <span>84%</span>
//                 </div>
//                 <div
//                   aria-valuemax={100}
//                   aria-valuemin={0}
//                   role="progressbar"
//                   data-state="indeterminate"
//                   data-max={100}
//                   className="relative w-full overflow-hidden rounded-full bg-secondary h-2"
//                 >
//                   <div
//                     data-state="indeterminate"
//                     data-max={100}
//                     className="h-full w-full flex-1 bg-primary transition-all"
//                     style={{ transform: "translateX(-16%)" }}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Storage</span>
//                   <span>45%</span>
//                 </div>
//                 <div
//                   aria-valuemax={100}
//                   aria-valuemin={0}
//                   role="progressbar"
//                   data-state="indeterminate"
//                   data-max={100}
//                   className="relative w-full overflow-hidden rounded-full bg-secondary h-2"
//                 >
//                   <div
//                     data-state="indeterminate"
//                     data-max={100}
//                     className="h-full w-full flex-1 bg-primary transition-all"
//                     style={{ transform: "translateX(-55%)" }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
//             <div className="flex flex-col space-y-1.5 p-6">
//               <h3 className="text-2xl font-semibold leading-none tracking-tight">
//                 Recent Activity
//               </h3>
//               <p className="text-sm text-muted-foreground">
//                 Latest system events and user actions
//               </p>
//             </div>
//             <div className="p-6 pt-0">
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-green-500" />
//                     <span>User registration</span>
//                   </div>
//                   <span className="text-muted-foreground">2 minutes ago</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-blue-500" />
//                     <span>Database backup</span>
//                   </div>
//                   <span className="text-muted-foreground">15 minutes ago</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-yellow-500" />
//                     <span>Security scan</span>
//                   </div>
//                   <span className="text-muted-foreground">1 hour ago</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-green-500" />
//                     <span>System update</span>
//                   </div>
//                   <span className="text-muted-foreground">3 hours ago</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
//           <div className="flex flex-col space-y-1.5 p-6">
//             <h3 className="text-2xl font-semibold leading-none tracking-tight">
//               Quick Actions
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               Frequently used actions for game arena management
//             </p>
//           </div>
//           <div className="p-6 pt-0">
//             <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
//               <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
//                 <div className="font-medium text-sm">Tournament Brackets</div>
//                 <div className="text-xs text-muted-foreground mt-1">
//                   Manage tournament brackets
//                 </div>
//               </div>
//               <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
//                 <div className="font-medium text-sm">Player Rankings</div>
//                 <div className="text-xs text-muted-foreground mt-1">
//                   Manage player rankings
//                 </div>
//               </div>
//               <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
//                 <div className="font-medium text-sm">Prize Pools</div>
//                 <div className="text-xs text-muted-foreground mt-1">
//                   Manage prize pools
//                 </div>
//               </div>
//               <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
//                 <div className="font-medium text-sm">Live Streaming</div>
//                 <div className="text-xs text-muted-foreground mt-1">
//                   Manage live streaming
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   </div>
// </div>

//   );
// };

// export default SuperAdminDashboard;

import React from 'react';
import { 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaTrophy, 
  FaClipboardList, 
  FaDollarSign, 
  FaCoins 
} from 'react-icons/fa';

function SuperAdminDashboard() {
  const stats = [
    { title: 'Total Clients', value: 1200, icon: <FaUsers />, trend: '+12%' },
    { title: 'Active Clients', value: 950, icon: <FaUserCheck />, trend: '+8%' },
    { title: 'Inactive Clients', value: 250, icon: <FaUserTimes />, trend: '-5%' },
    { title: 'Total Tournaments', value: 45, icon: <FaTrophy />, trend: '+20%' },
    { title: 'Contests (Live)', value: 12, icon: <FaClipboardList />, trend: '+3%' },
    { title: 'Contests (Completed)', value: 28, icon: <FaClipboardList />, trend: '+15%' },
    { title: 'Contests (Upcoming)', value: 5, icon: <FaClipboardList />, trend: '+10%' },
    { title: 'Revenue', value: '$45,000', icon: <FaDollarSign />, trend: '+25%' },
    { title: 'Winnings', value: '$12,500', icon: <FaCoins />, trend: '+18%' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-200 text-black rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-right">
                <h2 className="text-sm font-medium">{stat.title}</h2>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-black">
              Trend: <span className="font-semibold">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;



