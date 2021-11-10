require('dotenv').config();
const express = require('express'); // import express
// const fileUpload = require('express-fileupload');

// import routes
const events = require('./routes/events');
const users = require('./routes/users');
const categorys = require('./routes/categorys');
const speakers = require('./routes/speakers');
const bookmarks = require('./routes/bookmarks')
const comments = require('./routes/comments');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// enable req.body (json and urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable req.body (form-data)
// app.use(fileUpload());

app.use(express.static('public'));

// make routes
app.use('/event', events);
app.use('/user', users);
app.use('/category', categorys);
app.use('/speaker', speakers);
app.use('/bookmark', bookmarks);
app.use('/comment', comments);

app.use(errorHandler);

// run the server
const port = process.env.port || 3000;  // define port
app.listen(port, () => console.log(`Server running on port ${port}...`));