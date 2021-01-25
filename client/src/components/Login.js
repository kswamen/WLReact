import React, { useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import { LoginContext } from "./LoginContext";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      provider: "",
      anchorEl: null,
    };
  }

  render() {
    const handleClick = (event) => {
      this.setState({ anchorEl: event.currentTarget });
    };

    const handleClose = () => {
      this.setState({ anchorEl: null });
    };

    return (
      <LoginContext.Consumer>
        {({
          isLoggedIn,
          userName,
          userImageSrc,
          userID,
          setLogin,
          setLogout,
        }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto",
            }}
          >
            {!isLoggedIn ? (
              ""
            ) : (
                <Button
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      overflow: "auto",
                    }}
                    src={userImageSrc}
                  />
                </Button>
              )}
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              variant="outlined"
              color="default"
              style={{ borderColor: "#ffffff", height: "30%" }}
            >
              <Typography style={{ color: "#ffffff" }} variant="h5">
                {!isLoggedIn ? "Login" : "Logout"}
              </Typography>
            </Button>

            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={handleClose}
            >
              {!isLoggedIn ? (
                <MenuItem onClick={handleClose}>
                  <GoogleLogin
                    clientId={
                      "236487257759-e0kij4llhdga8ii4d1551vehfp5j4ap8.apps.googleusercontent.com"
                    }
                    onSuccess={setLogin}
                    onFailure={setLogout}
                    cookiePolicy={"single_host_origin"}
                    isSignedIn={true}
                  ></GoogleLogin>
                </MenuItem>
              ) : (
                  <MenuItem onClick={handleClose}>
                    <GoogleLogout
                      buttonText="로그아웃하시겠습니까?"
                      onLogoutSuccess={setLogout}
                    ></GoogleLogout>
                  </MenuItem>
                )}
            </Menu>
          </div>
        )}
      </LoginContext.Consumer>
    );
  }
}
