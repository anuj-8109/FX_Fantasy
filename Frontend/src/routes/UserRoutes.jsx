import React from "react";
import { Route } from "react-router-dom";


const UserRoutes = () => {
  return (
    <>
      <Route path="/user" element={<UserLayout />}>
      
      </Route>
    </>
  );
};

export default UserRoutes;
