import React, { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

function Appbar() {
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // setTimeout(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        // Make an API call to check the user's login status
        fetch("http://localhost:3000/admin/me", {
          method: "GET",
          headers: {
            "content-Type": "application/json",
            authorization: "Bearer " + storedToken,
          },
        })
          .then((resp) => {
            if (!resp.ok) {
              throw new Error("Network response is not ok");
            }
            resp.json().then((data) => {
              if (data && data.username) {
                setUserEmail(data.username);
              } else {
                setUserEmail(null);
              }
            });
          })
          .catch((error) => {
            console.error("Error while logging in", error);
          })
          .finally(() => {
            setIsLoading(false); // Set isLoading to false once the request is complete
          });
      } else {
        setIsLoading(false); // Set isLoading to false if there's no stored token
      }
    // }, 200);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexFlow: 1 }}>
          courseera
        </Typography>
        {isLoading ? ( // Display a loading indicator while isLoading is true
          <CircularProgress color="inherit" />
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
                window.location = "/courses";
              }}
            >
              Courses
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem("token");
                setUserEmail(null);
                window.location = "/";
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
