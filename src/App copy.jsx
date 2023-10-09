import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import CreateCourse from "./components/CreateCourse";
import Register from "./components/Register";
import ShowCourses from "./components/ShowCourses";
import Course from "./components/Course";
import Appbar from "./AppBar";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { userState } from "./atoms/user";
import { BASE_URL } from "./config.js";
import axios from "axios";
import { useEffect } from "react";

// import User from "./components/AdminCourses";
// import { AppBar } from "@mui/material";

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
  return (
    <RecoilRoot>
      <Router>
        <Appbar />
        <InitUser />
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/user" element={<User />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createCourse" element={<CreateCourse />} />
          <Route path="/courses" element={<ShowCourses />} />
          <Route path="/course/:courseId" element={<Course />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

function InitUser() {
  const setUserEmail = useSetRecoilState(userState);
  const init = async () => {
    try {
      let resp = await fetch(`${BASE_URL}/admin/me`, {
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
              // setUserEmail(data.username);
              setUserEmail({
                isLoading: false,
                userEmail: resp.data.username,
              });
            } else {
              setUserEmail({
                isLoading: false,
                userEmail: null,
              });
            }
          });
        })
        .catch((error) => {
          console.error("Error while logging in", error);
        });

      if (resp.data.username) {
        setUserEmail({
          isLoading: false,
          userEmail: resp.data.username,
        });
      } else {
        setUserEmail({
          isLoading: false,
          userEmail: null,
        });
      }
    } catch {
      setUserEmail({
        isLoading: false,
        userEmail: null,
      });
    }
  };
  useEffect(() => {
    init();
  }, []);

  return <></>;
}

export default App;
