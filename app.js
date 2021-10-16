// Require Modules
const express = require('express');
const morgan = require('morgan');
const router = require('./Routes/roomRoutes');
const methodOverride = require('method-override');
const mongoose = require("mongoose");

const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore  = require('connect-mongo');
const flash = require('connect-flash');

// Create App
const app = express();

// Configure App
let port = 3000;
let host = 'localhost'; 
app.set('view engine','ejs');

//Use Mongoose to connect to mongoDB server.
mongoose.connect('mongodb://localhost:27017/demos',{useNewUrlParser: true ,useUnifiedTopology: true})
.then(()=>{
    app.listen(port, host, () => {
    console.log('Server is running on port : ' + port);       
    });
})
.catch(err=>console.log(err.message));

// Mount Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
//mount middlware
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/demos'}),
        cookie: {maxAge: 60*60*1000}
        })
);

app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.userfirstName = req.session.userfirstName||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

// set up routes
app.get('/',(req,res)=>{
    res.render('index');
});

//send About Page
app.get('/contact',(req,res)=>{
    res.render('contact');
});

//send Contact page
app.get('/about',(req,res)=>{
    res.render('about');
});

// set up the routes
app.use('/rooms', router);

app.use('/users', userRoutes);

// redirect to error
app.use((err,req,res,next )=>{
    console.log(err.stack);
    if(!err.status){
       err.status=500;
       err.message = ("Internal Server Error"); 
    }
    res.status(err.status);
    res.render('error', {error: err});
});



app.use((req,res,next)=>{
    let err= new Error('The server cannot Locate '+ req.url);
    err.status=404;
    res.status(err.status);
    res.render('error', {error: err});
});
