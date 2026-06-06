const express = require("express");

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

// MongoDB Connection

mongoose.connect("mongodb://127.0.0.1:27017/authDB")

.then(() => console.log("MongoDB Connected"))

.catch(err => console.log(err));

// User Schema

const userSchema = new mongoose.Schema({

    username: String,

    password: String
});

const User = mongoose.model("User", userSchema);

// Register API

app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const hashedPassword =
    await bcrypt.hash(password, 10);

    const newUser = new User({

        username,

        password: hashedPassword
    });

    await newUser.save();

    res.json({

        message: "User Registered Successfully"
    });
});

// Login API

app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if(!user){

        return res.json({

            message: "User Not Found"
        });
    }

    const isMatch =
    await bcrypt.compare(password, user.password);

    if(isMatch){

        res.json({

            message: "Login Successful"
        });
    }

    else{

        res.json({

            message: "Invalid Password"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});