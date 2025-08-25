import React from "react";
import Datatable from "../../../extracomponents/Datatable";
import { UserCheck } from "lucide-react";

const ActiveUser = () => {
  const users = [
    {
      id: 1,
      name: "Shakti Kumar",
      email: "shakti@example.com",
      role: "Super Admin",
    },
    { id: 2, name: "Rahul Sharma", email: "rahul@example.com", role: "Admin" },
    { id: 3, name: "Priya Singh", email: "priya@example.com", role: "User" },
    { id: 4, name: "Aman Verma", email: "aman@example.com", role: "User" },
    { id: 5, name: "Neha Gupta", email: "neha@example.com", role: "Manager" },
    { id: 6, name: "Ravi Patel", email: "ravi@example.com", role: "User" },
    { id: 7, name: "Sneha Mehra", email: "sneha@example.com", role: "Admin" },
    { id: 8, name: "Vikas Yadav", email: "vikas@example.com", role: "User" },
    {
      id: 9,
      name: "Anjali Sharma",
      email: "anjali@example.com",
      role: "Manager",
    },
    { id: 10, name: "Kunal Joshi", email: "kunal@example.com", role: "User" },
    { id: 11, name: "Meena Rani", email: "meena@example.com", role: "User" },
    { id: 12, name: "Arjun Kapoor", email: "arjun@example.com", role: "Admin" },
    { id: 13, name: "Divya Nair", email: "divya@example.com", role: "User" },
    { id: 14, name: "Manoj Tiwari", email: "manoj@example.com", role: "User" },
    {
      id: 15,
      name: "Pooja Singh",
      email: "pooja@example.com",
      role: "Manager",
    },
    { id: 16, name: "Sameer Khan", email: "sameer@example.com", role: "User" },
    { id: 17, name: "Kiran Das", email: "kiran@example.com", role: "Admin" },
    { id: 18, name: "Rohit Sinha", email: "rohit@example.com", role: "User" },
    { id: 19, name: "Alok Mishra", email: "alok@example.com", role: "User" },
    {
      id: 20,
      name: "Jyoti Kumari",
      email: "jyoti@example.com",
      role: "Manager",
    },
  ];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Active Users</h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        <Datatable columns={columns} data={users} title="Users List" />
      </div>
    </div>
  );
};

export default ActiveUser;
