require("dotenv").config();
const express = require("express"); // import express
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require('path');

// import routes
const events = require("./routes/events");
const users = require("./routes/users");
const categorys = require("./routes/categorys");
const bookmarks = require("./routes/bookmarks");
const comments = require("./routes/comments");
const login = require('./routes/login');

const errorHandler = require("./middlewares/errorHandler");

const app = express();

// enable req.body (json and urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- CORS setting
const corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Enable req.body (form-data)
app.use(fileUpload());

app.use(express.static('public'))

// make routes
app.use("/user", users);
app.use('/login', login);
app.use("/event", events);
app.use("/category", categorys);
app.use("/comment", comments);
app.use("/bookmark", bookmarks);
app.use('/avatar', express.static(__dirname + "/public" + "/images"))

app.use(errorHandler);

// run the server
const port = process.env.PORT || 3000; // define port
app.listen(port, () => console.log(`Server running on port ${port}...`));
