import React, { useEffect } from "react";
import { Card, FormControlLabel, Typography } from "@mui/material";
// import { AppBar } from "@mui/material";
function ShowCourses() {
  const [courses, setCourses] = React.useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/admin/courses", {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Network response is not ok");
        }
        resp.json().then((data) => {
          console.log("tarun", data);
          setCourses(data);
        });
      })
      .catch((error) => {
        console.error("Error signing in email");
      });
  }, []);
  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Typography variant={"h6"}>Course</Typography>
      <div>
        {/* <Card variant="outlined" style={{ width: 400, padding: 20 }}> */}
        {courses.map((course) => {
          // <div key={course.id}>{course.title}</div>;
          // return <Course course={course} />;
        })}
      </div>
    </div>
  );
}

// function Course({ props }) {
//   return (
//     <div>
//       <h1>{props.title}</h1>
//     </div>
//   );
// }

export default ShowCourses;
