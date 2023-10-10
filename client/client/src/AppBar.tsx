// import React, { useState, useEffect } from "react";
import { emailState } from "./selectors/userEmail.js";
import { isLoadingState } from "./selectors/isLoading.js";
import { userState } from "./atoms/user.js";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Appbar() {
  const userEmail = useRecoilValue(emailState);
  const setUserEmail = useSetRecoilState(userState);
  const isLoading = useRecoilValue(isLoadingState);
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexFlow: 1, textDecoration: "none", color: "white" }}
          component={Link}
          to="/"
        >
          courseera
        </Typography>
        {isLoading ? ( // Display a loading indicator while isLoading is true
          <div></div>
        ) : userEmail ? (
          // If the user is logged in, render the user-specific buttons
          <div style={{ marginLeft: "auto" }}>
            {userEmail}
            <Button color="inherit" component={Link} to="/createCourse">
              Create
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                // localStorage.setItem("token", null);
                navigate("/courses");
              }}
            >
              Courses
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem("token");
                setUserEmail({ isLoading: false, userEmail: null });
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          // If the user is not logged in, render the login and register buttons
          <div style={{ marginLeft: "auto" }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;
