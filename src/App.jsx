import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import CreateCourse from "./components/CreateCourse";
import Register from "./components/Register";
import ShowCourses from "./components/ShowCourses";
import Course from "./components/Course";
import Appbar from "./AppBar";
// import User from "./components/AdminCourses";
// import { AppBar } from "@mui/material";

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
  return (
    <Router>
      <Appbar />
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
  );
}

export default App;
