import React from "react";
import useAuth from "../../../hook/useAuth";

const Logout = () => {
  const { logoutUser } = useAuth();
  const handleLogOut = () => {
    logoutUser()
      // .then((result) => console.log(result))
      // .catch((err) => console.log(err));
  };
  return <button className="btn btn-primary text-black" onClick={handleLogOut}>LogOut</button>;
};

export default Logout;
