const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./connection/dbConnect');
const mongoSanitize = require('express-mongo-sanitize');

//load config
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();
global.__basedir = __dirname + "/..";


//Branch Route
const BranchRoute = require('./routes/BranchRoute');

const ToDoRoute = require('./routes/ToDORoute');


const lookupapifieldRoute = require('./routes/LookupAPIRouteRoute');





//User route
const userRoute = require('./routes/UserRoute');







const app = express();

app.use(express.json());

//Sanitize Data
app.use(mongoSanitize());

//Set Security Header

app.use(helmet());

//Prevent xss attach
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 mins
  max: 300,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());







// Enable CORS
app.use(cors());



app.use('/api/v1/branch', BranchRoute);
app.use('/api/v1/lookupapifield', lookupapifieldRoute);

app.use('/api/v1/todo', ToDoRoute);

app.use('/api/v1/user', userRoute);



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
 // process.exit(1);
//   var exec = require('child_process').exec;
//  const { execSync } = require('child_process')
//   exec("rs", function () {
//     console.log(`Server restart in ${process.env.NODE_ENV} mode on port ${PORT}`)
//     console.log(promise)
//     //process.kill();
//    // process.exit(1);
//   });
  //execSync('nodemon');
  // Close server & exit process
  // server.close(() => process.exit(1));
});
process.on('uncaughtException', (error)  => {
   
 // console.log('Oh my god, something terrible happened: ',  error);
 //var exec = require('child_process').exec;
// const { execSync } = require('child_process')
  // exec("rs", function () {
  //   console.log(`Server restart in ${process.env.NODE_ENV} mode on port ${PORT}`)
  //  // console.log(promise)
  //   process.kill();
  //   process.exit(1);
  // });
 // process.exit(1); // exit application 
 //execSync('nodemon');
 console.log("Restart Server");
 //console.log(error);
})
