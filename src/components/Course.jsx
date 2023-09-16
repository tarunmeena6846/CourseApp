// import { CardHeader, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Course() {
  let { courseId } = useParams();
  const [course, setCourse] = useState(null);
  console.log(courseId);
  useEffect(() => {
    fetch("http://localhost:3000/admin/courses/" + courseId, {
      method: "GET",
      headers: {
        "content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((resp) => {
      if (!resp.ok) {
        throw new Error("Network response is not ok ");
      }
      resp.json().then((data) => {
        console.log("data from the server ", data);
        setCourse(data);
      });
    });
  }, [courseId]);
  if (!course) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>Loading....</p>
      </div>
    );
  }

  return (
    <div>
      <GrayTopper title={course.title} />
      <Grid container>
        <Grid item lg={8} md={12} sm={12} xs={12}>
          <UpdateCard course={course} setCourse={setCourse} />
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <CourseDisplay course={course}></CourseDisplay>
        </Grid>
      </Grid>
    </div>
  );
}
function UpdateCard({ course, setCourse }) {
  console.log("tarun at update card", course.title);
  const [title, setTitle] = React.useState(course.title);
  const [description, setDescription] = React.useState(course.description);
  const [price, setPrice] = React.useState(course.price);
  const [image, setImage] = React.useState(course.imageLink);
  return (
    <div style={{ display: "flex", justifyContent: "left" }}>
      <Card
        style={{
          margin: 120,
          width: 400,
          // display: "flex",
          // justifyContent: "left",
          // minHeight: 200,
          // marginTop: 30,
          // borderRadius: 20,
          // marginRight: 50,
          // // paddingBottom: 5,
          zIndex: 1,
        }}
      >
        <div style={{ padding: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              padding: 5,
            }}
          >
            <TextField
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              variant="outlined"
              value={title}
              fullWidth
            />
            <br />
            <TextField
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              variant="outlined"
              value={description}
              fullWidth
            />
            <br />
            <TextField
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              variant="outlined"
              value={price}
              fullWidth
            />
            <br />
            {/* <TextField
                onChange={(e) => {
                  SetImage(e.target.value);
                }}
                label="Image"
                variant="outlined"
                type={"image"}
                fullWidth
              /> */}
            <TextField
              onChange={(e) => {
                setImage(e.target.value);
              }}
              label="Image"
              variant="outlined"
              type={"price"}
              fullWidth
            />
            <br />
            <br />
            {/* </Card> */}
          </div>
        </div>
      </Card>
    </div>
  );
}
function GrayTopper({ title }) {
  return (
    <div
      style={{
        height: 180,
        background: "#212121",
        top: 0,
        zIndex: 0,
        marginBottom: -160,
      }}
    >
      <div style={{ padding: 50 }}>
        <Typography
          style={{ color: "white", fontWeight: 200 }}
          variant="h4"
          textAlign={"center"}
        >
          {title}
        </Typography>
      </div>
    </div>
  );
}
function CourseDisplay({ course }) {
  console.log("tarun at other compoment ", course);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "left",
        // marginTop: 0,
        width: "100%",
      }}
    >
      <Card
        style={{
          margin: 120,
          width: 250,
          // minHeight: 200,
          marginTop: 30,
          borderRadius: 20,
          // marginRight: 50,
          // paddingBottom: 5,
          zIndex: 0,
        }}
      >
        <Typography
          variant="h6"
          style={{ display: "flex", justifyContent: "center", padding: 10 }}
        >
          {course.title}
        </Typography>
        <CardContent>
          <CardMedia
            component="img"
            height="250"
            style={{ borderRadius: "50%" }}
            image={course.imageLink}
            alt="course image"
          />
          {/* <CardContent> */}
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ padding: 5 }}
          >
            {course.description}
          </Typography>
          <Typography variant="h6">
            {course.price}
            Rs
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Course;
