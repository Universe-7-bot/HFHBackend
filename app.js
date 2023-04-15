const express = require("express");
const app = express();
const User = require("./model/user");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("connected with database");
}).catch((err) => {
    console.log(err);
})

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    // res.send("hello");
    res.render("signup");
})

app.post("/signup", async (req, res) => {
    let { name, email, password, state, district } = req.body;
    if (!name || !email || !password || !state || !district) {
        return res.json({ message: "Please enter all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ message: "User already exists", code: 409 });
    }

    email = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    let tempUser = new User({
        name, email, password: hashedPassword, state, district
    })

    let savedUser = await tempUser.save();
    return res.json({ savedUser });
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "Invalid credentials", code: 401 });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.json({ message: "Invalid credentials", code: 401 });
    }
    res.json({ message: "Login successful" });
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.listen(PORT, (err) => {
    err ? console.log(err) : console.log("server is running on PORT: " + PORT);
})