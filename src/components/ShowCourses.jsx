import React, { useEffect } from "react";
import { Card, FormControlLabel, Typography } from "@mui/material";
import { Button } from "@mui/material";
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

  // console.log(courses);
  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {courses.map((course) => {
        return <CoursesDisplay course={course} />;
      })}
    </div>
  );
}
export function CoursesDisplay({ course }) {
  // const navigate = useNavigate();

  return (
    <Card
      style={{
        margin: 10,
        width: 200,
        minHeight: 150,
        padding: 20,
      }}
    >
      {course._id}
      <Typography textAlign={"center"} variant="h5">
        {course.title}
      </Typography>
      <Typography textAlign={"center"} variant="subtitle1">
        {course.description}
      </Typography>
      <img src={course.imageLink} style={{ width: 150 }}></img>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Button
          style={{ margin: 3 }}
          variant="contained"
          onClick={() => {
            window.location = "/course/" + course._id;
          }}
        >
          Edit
        </Button>
        <Button
          style={{ margin: 3 }}
          variant="contained"
          onClick={() => {
            // navigate("/course/" + course._id);
          }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default ShowCourses;
