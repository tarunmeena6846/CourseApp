import express, { NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import cors from "cors";
import { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(cors());

const secretKey = "mysecretkey";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseSchema = new mongoose.Schema({
  // id: Number,
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const user = mongoose.model("user", userSchema);
const Course = mongoose.model("Course", courseSchema);
const admin = mongoose.model("admin", adminSchema);

mongoose
  .connect(
    "mongodb+srv://tarunmeena6846:Tuesday6%5E@cluster0.f6tatpb.mongodb.net/",
    { dbName: "test" }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.error("Error connecting to MongoDB:", err);
  });

interface customRequest extends Request {
  user?: JwtPayload;
}
function detokenizeAdmin(
  req: customRequest,
  res: Response,
  next: NextFunction
) {
  // const headers = req.headers as any;
  const authHeader = req.headers.authorization;
  console.log("tarun header ", authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let user = jwt.verify(token, secretKey);
    if (!user) {
      return res.sendStatus(403);
    }
    if (typeof user === "string") {
      return res.sendStatus(403);
    }
    if (user.role === "admin") {
      console.log("tarun at detoken" + user.username);
      // req.user = user;
      req.user = user;

      next();
    } else {
      res.status(403).send("Unauthorised");
    }
  }
}
function detokenizeUser(req: customRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    let user = jwt.verify(token, secretKey);
    console.log(user);
    if (!user) {
      return res.sendStatus(403);
    }
    if (typeof user === "string") {
      return res.sendStatus(403);
    }
    if (user.role === "admin" || user.role === "user") {
      console.log("tarun at detoken" + user.username);
      req.user = user;
      next();
    } else {
      res.status(403).send("Unauthorised");
    }
  }
}
// Admin routes
app.post("/admin/signup", async (req, res) => {
  console.log("in admin signup", req.body.username);
  const bIsAdminPresent = await admin.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  console.log("tarun" + bIsAdminPresent);
  if (!bIsAdminPresent) {
    const obj = { username: req.body.username, password: req.body.password };
    console.log(obj);
    const newAdmin = new admin(obj);
    newAdmin.save();
    let token = jwt.sign(
      {
        username: req.body.username,
        role: "admin",
      },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).json({ content: "Admin created successfully", token });
  } else {
    res.status(401).send("Admin already registered");
  }
});
app.get("/admin/me", detokenizeAdmin, (req: customRequest, res: Response) => {
  if (!req.user) {
    return res.sendStatus(403);
  }
  console.log("tarun", req.user.username);
  if (req.user.username) {
    res.status(201).json({
      username: req.user.username,
    });
  } else {
    res.status(401).send("Unauthorised");
  }
});
// TODO add the below logic to a common place for the autentcation
app.post("/admin/login", async (req, res) => {
  const bIsAdminPresent = await admin.findOne({
    username: req.headers.username,
    password: req.headers.password,
  });
  console.log("tarun in login", bIsAdminPresent);
  if (bIsAdminPresent) {
    const token = jwt.sign(
      { username: req.headers.username, role: "admin" },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).send({ content: "Login successfully", token });
  } else {
    res.status(401).send("unauthorised");
  }
});

app.post("/admin/courses", detokenizeAdmin, (req, res) => {
  const newCourse = new Course(req.body);
  newCourse.save();
  console.log("tarun", newCourse);
  res
    .status(201)
    .send({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", detokenizeAdmin, async (req, res) => {
  // const courseId = mongoose.Types.ObjectId(req.params.courseId);
  console.log(req.params.courseId);
  console.log(req.body);
  const newCourse = await Course.findByIdAndUpdate(
    req.params.courseId,
    req.body
    // {
    //   new: true,
    // }
  );

  console.log(newCourse);
  if (newCourse) {
    res.status(201).json(newCourse);
  } else {
    res.status(404).send("No course found with the provided ID");
  }
});

app.get("/admin/courses", detokenizeAdmin, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  console.log("tarun", courses);
  res.status(201).json(courses);
});

// User routes
app.post("/users/signup", async (req, res) => {
  const userPresent = await user.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  console.log("tarun" + userPresent);
  if (!userPresent) {
    const obj = { username: req.body.username, password: req.body.password };
    console.log(obj);
    const newUser = new user(obj);
    newUser.save();
    let token = jwt.sign(
      {
        username: req.body.username,
        role: "user",
      },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).json({ content: "User created successfully", token });
  } else {
    res.status(401).send("User already registered");
  }
});

app.post("/users/login", async (req, res) => {
  const bIsUserPresent = await user.findOne({
    username: req.headers.username,
    password: req.headers.password,
  });

  if (bIsUserPresent) {
    const token = jwt.sign(
      { username: req.headers.username, role: "user" },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(200).send({ content: "Login successfully", token });
  } else {
    res.status(401).send("unauthorised");
  }
});

app.get("/users/courses", detokenizeUser, async (req, res) => {
  // const user = req.body;
  const courses = await Course.find({ published: true });
  res.status(201).json(courses);
});

app.post(
  "/users/courses/:courseId",
  detokenizeUser,
  async (req: customRequest, res: Response) => {
    // logic to purchase a course

    console.log("tarun course id for purchase is " + req.params.courseId);
    const course = await Course.findById(req.params.courseId);
    console.log(course);
    if (!course) {
      return res.sendStatus(403);
    }
    if (course.published) {
      // const user = req.user;
      // console.log(user);
      if (!req.user) {
        return res.sendStatus(403);
      }
      const userInDB = await user.findOne({ username: req.user.username });
      if (userInDB) {
        const purchased = userInDB.purchasedCourse;
        console.log(purchased);
        purchased.push(course._id);
        userInDB.purchasedCourse = purchased;
        userInDB.save();
        res.status(201).send({ message: "Purchased Sucessfully" });
      } else {
        console.log("user is not present in db");
      }
    } else {
      return res.status(400).send({ message: "Course is not published" });
    }
  }
);

app.get(
  "/users/purchasedCourses",
  detokenizeUser,
  async (req: customRequest, res: Response) => {
    if (!req.user) {
      return res.sendStatus(403);
    }
    const userInDB = await user.findOne({ username: req.user.username });
    console.log(userInDB);
    if (!userInDB) {
      return res.sendStatus(403);
    }
    const userCourses = await Course.find({ _id: userInDB.purchasedCourse });
    res.status(201).json(userCourses);
  }
);
app.get("/admin/courses/:courseId", detokenizeUser, async (req, res) => {
  // logic to purchase a course

  console.log("tarun course id for purchase is " + req.params.courseId);
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    res.status(201).json(course);
  } else {
    return res.status(400).send({ message: "Course not found" });
  }
});

app.delete("/admin/courses/:courseId", detokenizeUser, async (req, res) => {
  // logic to purchase a course

  console.log("tarun course id for delete is " + req.params.courseId);
  const course = await Course.findByIdAndDelete(req.params.courseId);
  console.log(course);
  if (course) {
    res.status(201).json(course);
  } else {
    return res.status(400).send({ message: "Course not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
