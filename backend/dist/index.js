"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
dotenv.config();
const secretKey = process.env.JWT_SECRET;
const mongodbUrl = process.env.MONGODB_URI;
console.log(secretKey);
if (!mongodbUrl || !secretKey) {
    throw new Error("Missing environment variables");
}
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    purchasedCourse: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Course" }],
});
const courseSchema = new mongoose_1.default.Schema({
    // id: Number,
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
});
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const user = mongoose_1.default.model("user", userSchema);
const Course = mongoose_1.default.model("Course", courseSchema);
const admin = mongoose_1.default.model("admin", adminSchema);
mongoose_1.default
    .connect(mongodbUrl, { dbName: "test" })
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
function detokenizeAdmin(req, res, next) {
    // const headers = req.headers as any;
    const authHeader = req.headers.authorization;
    console.log("tarun header ", authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        let user = jsonwebtoken_1.default.verify(token, secretKey);
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
        }
        else {
            res.status(403).send("Unauthorised");
        }
    }
}
function detokenizeUser(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log(token);
        let user = jsonwebtoken_1.default.verify(token, secretKey);
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
        }
        else {
            res.status(403).send("Unauthorised");
        }
    }
}
// Admin routes
app.post("/admin/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in admin signup", req.body.username);
    const bIsAdminPresent = yield admin.findOne({
        username: req.body.username,
        password: req.body.password,
    });
    console.log("tarun" + bIsAdminPresent);
    if (!bIsAdminPresent) {
        const obj = { username: req.body.username, password: req.body.password };
        console.log(obj);
        const newAdmin = new admin(obj);
        newAdmin.save();
        let token = jsonwebtoken_1.default.sign({
            username: req.body.username,
            role: "admin",
        }, secretKey, { expiresIn: "1h" });
        res.status(200).json({ content: "Admin created successfully", token });
    }
    else {
        res.status(401).send("Admin already registered");
    }
}));
app.get("/admin/me", detokenizeAdmin, (req, res) => {
    if (!req.user) {
        return res.sendStatus(403);
    }
    console.log("tarun", req.user.username);
    if (req.user.username) {
        res.status(201).json({
            username: req.user.username,
        });
    }
    else {
        res.status(401).send("Unauthorised");
    }
});
// TODO add the below logic to a common place for the autentcation
app.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bIsAdminPresent = yield admin.findOne({
        username: req.headers.username,
        password: req.headers.password,
    });
    console.log("tarun in login", bIsAdminPresent);
    if (bIsAdminPresent) {
        const token = jsonwebtoken_1.default.sign({ username: req.headers.username, role: "admin" }, secretKey, { expiresIn: "1h" });
        res.status(200).send({ content: "Login successfully", token });
    }
    else {
        res.status(401).send("unauthorised");
    }
}));
app.post("/admin/courses", detokenizeAdmin, (req, res) => {
    const newCourse = new Course(req.body);
    newCourse.save();
    console.log("tarun", newCourse);
    res
        .status(201)
        .send({ message: "Course created successfully", courseId: newCourse.id });
});
app.put("/admin/courses/:courseId", detokenizeAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const courseId = mongoose.Types.ObjectId(req.params.courseId);
    console.log(req.params.courseId);
    console.log(req.body);
    const newCourse = yield Course.findByIdAndUpdate(req.params.courseId, req.body
    // {
    //   new: true,
    // }
    );
    console.log(newCourse);
    if (newCourse) {
        res.status(201).json(newCourse);
    }
    else {
        res.status(404).send("No course found with the provided ID");
    }
}));
app.get("/admin/courses", detokenizeAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to get all courses
    const courses = yield Course.find({});
    console.log("tarun", courses);
    res.status(201).json(courses);
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(201).json({msg: "hello world"});
}));
// User routes
app.post("/users/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPresent = yield user.findOne({
        username: req.body.username,
        password: req.body.password,
    });
    console.log("tarun" + userPresent);
    if (!userPresent) {
        const obj = { username: req.body.username, password: req.body.password };
        console.log(obj);
        const newUser = new user(obj);
        newUser.save();
        let token = jsonwebtoken_1.default.sign({
            username: req.body.username,
            role: "user",
        }, secretKey, { expiresIn: "1h" });
        res.status(200).json({ content: "User created successfully", token });
    }
    else {
        res.status(401).send("User already registered");
    }
}));
app.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bIsUserPresent = yield user.findOne({
        username: req.headers.username,
        password: req.headers.password,
    });
    if (bIsUserPresent) {
        const token = jsonwebtoken_1.default.sign({ username: req.headers.username, role: "user" }, secretKey, { expiresIn: "1h" });
        res.status(200).send({ content: "Login successfully", token });
    }
    else {
        res.status(401).send("unauthorised");
    }
}));
app.get("/users/courses", detokenizeUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = req.body;
    const courses = yield Course.find({ published: true });
    res.status(201).json(courses);
}));
app.post("/users/courses/:courseId", detokenizeUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to purchase a course
    console.log("tarun course id for purchase is " + req.params.courseId);
    const course = yield Course.findById(req.params.courseId);
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
        const userInDB = yield user.findOne({ username: req.user.username });
        if (userInDB) {
            const purchased = userInDB.purchasedCourse;
            console.log(purchased);
            purchased.push(course._id);
            userInDB.purchasedCourse = purchased;
            userInDB.save();
            res.status(201).send({ message: "Purchased Sucessfully" });
        }
        else {
            console.log("user is not present in db");
        }
    }
    else {
        return res.status(400).send({ message: "Course is not published" });
    }
}));
app.get("/users/purchasedCourses", detokenizeUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.sendStatus(403);
    }
    const userInDB = yield user.findOne({ username: req.user.username });
    console.log(userInDB);
    if (!userInDB) {
        return res.sendStatus(403);
    }
    const userCourses = yield Course.find({ _id: userInDB.purchasedCourse });
    res.status(201).json(userCourses);
}));
app.get("/admin/courses/:courseId", detokenizeUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to purchase a course
    console.log("tarun course id for purchase is " + req.params.courseId);
    const course = yield Course.findById(req.params.courseId);
    console.log(course);
    if (course) {
        res.status(201).json(course);
    }
    else {
        return res.status(400).send({ message: "Course not found" });
    }
}));
app.delete("/admin/courses/:courseId", detokenizeUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to purchase a course
    console.log("tarun course id for delete is " + req.params.courseId);
    const course = yield Course.findByIdAndDelete(req.params.courseId);
    console.log(course);
    if (course) {
        res.status(201).json(course);
    }
    else {
        return res.status(400).send({ message: "Course not found" });
    }
}));
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
