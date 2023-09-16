import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Card, FormControlLabel, Typography } from "@mui/material";
import { Checkbox } from "@mui/material";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [isChecked, setIsChecked] = React.useState(false);

  console.log("tarun", title);
  console.log(description);
  const addCourse = () => {
    console.log("tarun", localStorage.getItem("token"));
    fetch("http://localhost:3000/admin/courses", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
        imageLink: "",
        price: price,
        published: isChecked,
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
          console.log("Course created sucessfully ", data);
        });
      })
      .catch((error) => {
        console.error("Error in creating the course");
      });
  };
  return (
    <div>
      <div
        style={{ paddingTop: 50, display: "flex", justifyContent: "center" }}
      >
        <Typography variant={"h6"}>Create Course</Typography>
      </div>
      <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
        <Card variant="outlined" style={{ width: 400, padding: 20 }}>
          <TextField
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            label="Title"
            variant="outlined"
            type={"title"}
            fullWidth
          />
          <br />
          <br />
          <TextField
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            label="Description"
            variant="outlined"
            type={"description"}
            fullWidth
          />
          <br /> <br />
          <TextField
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            label="Price"
            variant="outlined"
            type={"price"}
            fullWidth
          />
          <br />
          <br />
          <TextField
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            label="Price"
            variant="outlined"
            type={"price"}
            fullWidth
          />
          <br />
          <br />
          <div style={{ display: "flex", justifyContent: "right" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(!isChecked)}
                  name="Published"
                  color="primary"
                ></Checkbox>
              }
              label="Published"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={addCourse}>
              Create
            </Button>
          </div>
        </Card>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* Already a user? <a href="/login">Login</a> */}
      </div>
    </div>
  );
}
export default CreateCourse;
