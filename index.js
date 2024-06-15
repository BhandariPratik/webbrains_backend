require('dotenv').config();
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js')
const path = require('path');

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/v1',routes)

//database connection & server 
mongoose.connect(process.env.END_POINT)
    .then((res) => {
        console.log('database connection Successfully')
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on PORT ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('Database Connection Err', err)
    })