// import { CardHeader, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { courseState } from "../atoms/course";
import {
  isCourseLoading,
  courseTitle,
  coursePrice,
  courseImage,
  courseDetails,
} from "../selectors/course";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Course() {
  let { courseId } = useParams();
  const setCourse = useSetRecoilState(courseState);
  const courseLoading = useRecoilValue(isCourseLoading);

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
        // console.log(data);
        setCourse({ course: data, isLoading: false });
      });
    });
  }, [courseId]);

  if (courseLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>Loading....</p>
      </div>
    );
  }

  return (
    <div>
      <GrayTopper />
      <Grid container>
        <Grid item lg={8} md={12} sm={12} xs={12}>
          <UpdateCard />
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <CourseDisplay></CourseDisplay>
        </Grid>
      </Grid>
    </div>
  );
}
function GrayTopper() {
  const title = useRecoilValue(courseTitle);
  console.log(title);
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
function UpdateCard() {
  const course = useRecoilValue(courseDetails);
  console.log(course);
  const setCourse = useSetRecoilState(courseState);

  let { courseId } = useParams();
  // console.log(course.title);
  const [title, setTitle] = React.useState(course.title);
  const [description, setDescription] = React.useState(course.description);
  const [price, setPrice] = React.useState(course.price);
  const [image, setImage] = React.useState(course.imageLink);
  // console.log(course.imageLink);

  const handleUpdate = (
    title,
    description,
    price,
    image,
    setCourse,
    courseId
  ) => {
    console.log("at handle update ", title);
    console.log("tarun", localStorage.getItem("token"));
    // let { courseId } = useParams();
    fetch("http://localhost:3000/admin/courses/" + courseId, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        description: description,
        imageLink: image,
        price: price,
      }),
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
          let updatedCourse = {
            _id: courseId,
            title: title,
            description: description,
            imageLink: image,
            price: price,
          };
          console.log("course id is ", updatedCourse._id);
          console.log("Course Updated sucessfully ", updatedCourse);
          setCourse({ course: updatedCourse, isLoading: false });
        });
      })
      .catch((error) => {
        console.error("Error in Updating the course");
      });
  };
  // console.log("tarun new courese is ", newCourse);
  return (
    <div style={{ display: "flex", justifyContent: "left" }}>
      <Card
        style={{
          margin: 120,
          width: 400,
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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              variant="outlined"
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
            <TextField
              onChange={(e) => {
                setImage(e.target.value);
              }}
              label="Image"
              variant="outlined"
              value={image}
              fullWidth
            />
            <br />
            <br />
            <Button
              // style={{ display: "flex", justifyContent: "left" }}
              variant="contained"
              color="primary"
              onClick={() =>
                handleUpdate(
                  title,
                  description,
                  price,
                  image,
                  setCourse,
                  courseId
                )
              }
            >
              Update
            </Button>
            {/* </Card> */}
          </div>
        </div>
      </Card>
    </div>
  );
}

function CourseDisplay() {
  // const course = useRecoilValue(courseDetails);
  const title = useRecoilValue(courseTitle);
  const price = useRecoilValue(coursePrice);
  const imageLink = useRecoilValue(courseImage);
  console.log(title);
  console.log(imageLink);
  // console.log("tarun at other compoment ", course);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "left",
        width: 250,
        paddingTop: 80,
        paddingLeft: 50,
      }}
    >
      <Card>
        <Typography
          variant="h6"
          style={{ display: "flex", justifyContent: "center", padding: 10 }}
        >
          {title}
        </Typography>
        <CardContent>
          <CardMedia
            component="img"
            height="250"
            style={{ borderRadius: "50%" }}
            image={imageLink}
            alt="course image"
          />
          <Typography>
            <h5> Rs {price}</h5>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Course;
