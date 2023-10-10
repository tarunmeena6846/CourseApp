// import React from "react";
import { useRecoilValue } from "recoil";
import { emailState } from "../selectors/userEmail";
import { isLoadingState } from "../selectors/isLoading";
import {
  // AppBar,
  Button,
  // Toolbar,
  // Typography,
  // CircularProgress,
} from "@mui/material";
import { InitUser } from "../App";
import { Link } from "react-router-dom";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  const userEmail = useRecoilValue(emailState);
  const isLoading = useRecoilValue(isLoadingState);

  return (
    <div
    // // style={{
    // //   display: "flex",
    // //   justifyContent: "center",
    // //   flexDirection: "column",
    // }}
    >
      <InitUser></InitUser>
      <h1 style={{ display: "flex", justifyContent: "center", padding: 50 }}>
        Welcome to course selling website!
      </h1>
      <img
        src="https://cdn.elearningindustry.com/wp-content/uploads/2020/08/5-ways-to-improve-your-course-cover-design-1024x575.png"
        style={{ width: "500px", height: "500px", objectFit: "cover" }}
      />
      {isLoading ? ( // Display a loading indicator while isLoading is true
        <div></div>
      ) : userEmail ? (
        <div></div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 50,
          }}
        >
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </div>
      )}
    </div>
  );
}

export default Landing;
