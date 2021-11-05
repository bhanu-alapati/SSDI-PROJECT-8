const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const {DateTime} = require('luxon');
var todayDate = DateTime.now().toFormat("yyyy-LL-dd");

exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if(!(req.params.id).match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid ObjectId Type Value');
        err.status = 400;
        return next(err);
    }else{
        return next();
    }
}

exports.validateSignup =
[
    body('firstName','First Name cannot be empty').notEmpty().trim().escape(),
    body('lastName','First Name cannot be empty').notEmpty().trim().escape(),
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password','Password be minimum of 8 charatcers and maximum of 64 characters').isLength({min:8, max:64})

];

exports.validateLogin = 
[
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password','Password be minimum of 8 charatcers and maximum of 64 characters').isLength({min:8, max:64})
];

exports.validateRoom= 
[
    body('department','Department cannot be empty').notEmpty().trim().escape(),
    body('department','Department must be atleast 3 characters.').isLength({min:3}),
    body('course','Course cannot be empty').notEmpty().trim().escape(),
    body('course','Course must be atleast 3 characters.').isLength({min:3}),
    body('topic','Topic cannot be empty').notEmpty().trim().escape(),
    body('topic','Topic must be atleast 3 characters.').isLength({min:3}),
    body('date','Date cannot be empty').notEmpty().trim().escape(),
    body('date','Date must be in a valid format').isDate(),
    body('date',"Date must be greater than today's date").isAfter(todayDate),
    body('startTime','StartTime cannot be empty').notEmpty().trim().escape(),
    body('endTime','EndTime cannot be empty').notEmpty().trim().escape(),
    body('endTime','EndTime cannot be empty').trim().custom((value,{req})=>{
        if(req.body.startTime>=req.body.endTime){
            throw new Error("End Time should be after start Time");
        }else{
            return true;
        }
    }),
    body('imageURL','Image URL cannot be empty').notEmpty(),
    body('location','Location cannot be empty').notEmpty().trim().escape(),
    body('roomType','Room type cannot be empty').notEmpty().trim().escape(),
    body('content','Content cannot be empty').notEmpty().trim().escape(),
    body('content','Content must be minimum of 10 characters').isLength({min:10})
]  

exports.validateRsvp = (req,res,next)=>{
    console.log(req.body.rsvp.toLowerCase());
    if((req.body.rsvp.toLowerCase() === "yes") || (req.body.rsvp.toLowerCase() === "no") || (req.body.rsvp.toLowerCase() === "maybe"))
    {
        return next();
    }else{
        let err = new Error("RSVP must be 'yes', 'no' or 'maybe'");
        err.status =400;
        next(err); 
    }
}


exports.validateResult = (req,res,next)=>{
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error',error.msg);
        });
        res.redirect('back');
    }else{
        return next();
    }
}