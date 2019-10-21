const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors =require('cors');

//BECAUSE IT WAS GIVING DEPRECATION WARNING LINKS IN TWITTER
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const participantsRoute = require('./routes/participants');
const adminRoute = require('./routes/admin');

require('dotenv/config');

//connecting to a database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
    console.log('Connected to the database')
});

//middlewares
// app.use(express.json());
app.use(bodyParser.json());
// app.use((req, res, next) => {
//     //doesn't send response just adjusts it
//     res.header("Access-Control-Allow-Origin", ""); // to give access to any origin
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
//     );
//     if (req.method === "OPTIONS") {
//       res.header(
//         "Access-Control-Allow-Methods",
//         "PUT, POST, PATCH, DELETE, GET"
//       ); //to give access to all the methods provided
//       return res.status(200).json({});
//     }
//     // this.app.use('/', (req, res) => {
//     //   res.send('working')
//     // })
//     next(); //so that other routes can take over
// })
app.use(cors());

//Routes Middlewares
app.use('/api/user', authRoute);
app.use('/api/post',postRoute);
app.use('/api/participants',participantsRoute);
app.use('/api/admin',adminRoute)


//starting server
app.listen(3001, () => console.log('server is up and running'));

