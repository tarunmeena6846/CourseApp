import React, { useEffect } from "react";
import { Card, FormControlLabel, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { userState } from "../atoms/user";

// import { AppBar } from "@mui/material";
function ShowCourses() {
  const [courses, setCourses] = React.useState([]);
  const setUserEmail = useSetRecoilState(userState);
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
          console.log("tarun meena");

          setCourses(data);
        });
      })
      .catch((error) => {
        console.log("tarun meena");
        setUserEmail({
          isLoading: false,
          userEmail: null,
        });
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
  // let { courseId } = useParams();
  // const navigate = useNavigate();

  const handleDelete = (courseId) => {
    fetch("http://localhost:3000/admin/courses/" + courseId, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Error in response from the server ");
        }
        resp.json().then((data) => {
          alert("Course Deleted");
          window.location = "/courses";
        });
      })
      .catch((error) => {
        console.error("Error in Deleting  the course", error);
      });
  };

  return (
    <Card
      style={{
        margin: 10,
        width: 200,
        minHeight: 150,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* {course._id} */}
      <Typography textAlign={"center"} variant="h5">
        {course.title}
      </Typography>
      <Typography textAlign={"center"} variant="subtitle1">
        {course.description}
      </Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={course.imageLink}
          style={{ width: 170, height: 170 }}
          alt="Course"
        ></img>
      </div>
      {/* <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}> */}
      <div
        style={{
          display: "flex",
          // flexDirection: "column",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Button
          style={{ margin: 3, marginLeft: 20 }}
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
          onClick={() => handleDelete(course._id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default ShowCourses;
