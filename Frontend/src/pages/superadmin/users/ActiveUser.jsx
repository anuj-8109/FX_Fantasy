import React, { useEffect, useState } from "react";
import Datatable from "../../../extracomponents/Datatable";
import { UserCheck } from "lucide-react";
import { GetActiveUser } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";


const ActiveUser = () => {
  const [activeuser, setActiveUser] = useState([]);
  const token = localStorage.getItem("token");

  const fetchActiveUsers = async () => {
    try {
      const response = await GetActiveUser(token);
      setActiveUser(response?.data);
    } catch (error) {
      console.log(`Error in fetching All Users`);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row?.FullName,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row?.UserName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.Email,
    },
    {
      name: "Phone No",
      selector: (row) => row?.PhoneNo,
      sortable: true,
    },
  ];

  return (
    <Content Page_title="Active Users" button_status={true} button_title="Back" route="/superadmin/dashboard">
      <div className="p-2  ">
        <div className=" shadow-lg rounded-xl p-4">
          <Datatable columns={columns} data={activeuser} title="Users List"  />
        </div>
      </div>
    </Content>
  );
};

export default ActiveUser;
