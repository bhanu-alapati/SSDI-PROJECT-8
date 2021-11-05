const User = require('../Models/user');
const roomsModel = require('../Models/room');
const model = require('../Models/user');
const rsvp = require('../Models/rsvp');

exports.newUser = (req,res)=>{
    res.render('./users/new')
};

exports.create = (req,res,next)=>{
    let user = new User(req.body);
    user.save()
    .then(()=>{
        req.flash('success','You have successfully created a new account');
        res.redirect('/users/login')
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error',err.message);
            return res.redirect('/users/new');
        }
        if (err.code = 11000){
            req.flash('error','Email address has been used');
            return res.redirect('/users/new');
        }
        next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req,res)=>{
    res.render('./users/login');
};

exports.validatelogin = (req,res,next) =>{
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
        }else{
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id; // Storing User id in session object.
                    req.session.userfirstName = user.firstName; // Storing FirstName in session Object.
                    req.flash('success','You have successfully logged in');
                    res.redirect('/users/profile');
                }else{
                    req.flash('error','Wrong Password');
                    res.redirect('/users/login');
                }
            })
        }
    })
    .catch(err=>{
        next(err);
    })
};

exports.logout = (req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            return next(err);
        }else{
            res.redirect('/');
        }
    });
}

exports.profile = (req,res,next) =>{
    let id = req.session.user;

    Promise.all([roomsModel.find(),rsvp.find()])
    .then(results=>{
        let [allRooms,rsvps] = results;
        let roomsYes = [];
        let roomsNo = [];
        let roomsMaybe = [];
        rsvps.forEach(rsvp=>{
            rsvp.yes.forEach(rn=>{
                if(rn==id)
                {
                    allRooms.forEach(room=>{
                        if(room._id==rsvp.roomId)
                        {roomsYes.push(room);}
                    })
                }
            })
            rsvp.no.forEach(rn=>{
                if(rn==id)
                {
                    allRooms.forEach(room=>{
                        if(room._id==rsvp.roomId)
                        {roomsNo.push(room);}
                    })
                }
            })
            rsvp.maybe.forEach(rn=>{
                if(rn==id)
                {
                    allRooms.forEach(room=>{
                        if(room._id==rsvp.roomId)
                        {roomsMaybe.push(room);}
                    })
                }
            })
        })
        
        Promise.all([model.findById(id),roomsModel.find({author:id})])
        .then(results=>{
        const [user,rooms] = results;
        res.render('./users/profile', {user,rooms,roomsYes,roomsNo,roomsMaybe});
        }) 
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
    
}