import React, { useEffect } from "react";
import { GetUserDetails } from "../../../services/SuperAdmin";

const ProfileManagement = () => {
  const [userdetails, setUserDetails] = useState();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const fetchUserDetails = async () => {
    try {
      const response = await GetUserDetails(token, id);
      setUserDetails(response?.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
   <div>
    your profile management content goes here
    <div>

    </div>
   </div>
  );
};

export default ProfileManagement;
