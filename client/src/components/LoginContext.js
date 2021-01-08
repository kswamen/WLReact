import React from "react";

export const LoginContext = React.createContext({
  isLoggedin: false,
  userName: "",
  userImageSrc: "",
  userID: "",

  setLogin: () => {},
  setLogout: () => {},
});
