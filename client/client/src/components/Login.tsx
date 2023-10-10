import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Card, Typography } from "@mui/material";
// import { BASE_URL } from "../config.ts";
import { userState } from "../atoms/user.js";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const setUserEmail = useSetRecoilState(userState);
  const navigate = useNavigate();
  console.log("tarun", email);
  console.log(password);
  const handleRegister = () => {
    const headers = new Headers();
    headers.append("Username", email);
    headers.append("Password", password);
    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: headers,
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
          setUserEmail({
            isLoading: false,
            userEmail: email,
          });
          navigate("/courses");
          console.log(data.token);
          console.log("Login sucessfully", data);
        });
      })
      .catch((error) => {
        console.error("Error signing in email", error);
      });
  };

  return (
    <div>
      <div
        style={{ paddingTop: 120, display: "flex", justifyContent: "center" }}
      >
        <Typography variant={"h6"}>Welcome Back!! </Typography>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
        <Card variant="outlined" style={{ width: 400, padding: 20 }}>
          <TextField
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            label="Email"
            variant="outlined"
            type={"email"}
            fullWidth
          />
          <br />
          <br />
          <TextField
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            label="Password"
            variant="outlined"
            type={"password"}
            fullWidth
          />
          <br />
          <br></br>
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Login
          </Button>
        </Card>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* Already a user? <a href="/login">Login</a> */}
      </div>
    </div>
  );
}

export default Login;
