// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar
// } from '@/components/ui/sidebar.jsx';
// import { useTheme } from '@/contexts/ThemeContext.jsx';
// import { 
//   LayoutDashboard, 
//   Palette, 
//   Users, 
//   Shield, 
//   Settings, 
//   Trophy,
//   TrendingUp,
//   Gamepad2,
//   BarChart3,
//   Wallet
// } from 'lucide-react';

// const SuperAdminSidebar = () => {
//   const location = useLocation();
//   const { state } = useSidebar();
//   const { currentAppType } = useTheme();
//   const isCollapsed = state === 'collapsed';

//   const menuItems = [
//     { title: 'Dashboard', url: '/', icon: LayoutDashboard },
//     // { title: 'Theme Manager', url: '/ThemeSwitcher', icon: Palette },
//     { title: 'User Management', url: '/users', icon: Users },
//     { title: 'Game Analytics', url: '/analytics', icon: BarChart3 },
//     { title: 'Trading Contests', url: '/contests', icon: Trophy },
//     { title: 'Live Trading', url: '/trading', icon: TrendingUp },
//     { title: 'Game Settings', url: '/games', icon: Gamepad2 },
//     { title: 'Wallet System', url: '/wallet', icon: Wallet },
//     { title: 'Security', url: '/security', icon: Shield },
//     { title: 'Settings', url: '/settings', icon: Settings }
//   ];

//   const getNavClassName = (isActive) =>
//     `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
//       isActive 
//         ? 'bg-primary text-primary-foreground' 
//         : 'text-muted-foreground hover:bg-accent'
//     }`;

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel className="flex items-center gap-2 px-4 py-2">
//             <span className="text-lg">{currentAppType.icon}</span>
//             {!isCollapsed && <span>{currentAppType.name} Admin</span>}
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <NavLink 
//                       to={item.url} 
//                       className={({ isActive }) => getNavClassName(isActive)}
//                       end
//                     >
//                       <item.icon className="h-4 w-4" />
//                       {!isCollapsed && <span>{item.title}</span>}
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// };

// export default SuperAdminSidebar;
