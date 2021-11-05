const rooms = require('../Models/room');

exports.isGuest = (req,res,next)=>{
    if(!req.session.user){
        return next();
    }else{
        req.flash('error','You have already logged in !');
        return res.redirect('/users/profile');
    }
}

exports.isLoggedin = (req,res,next)=>{
    if(req.session.user){
        return next();
    }else{
        req.flash('error','You must login first !');
        return res.redirect('/users/login');
    }
}

exports.isAuthor = (req,res,next)=>{
    let id = req.params.id;
    rooms.findById(id)
    .then(room=>{
        if(room.author == req.session.user){
            return next();
        }else{
            let err = new Error('Unauthorised to access the resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err=>next(err));
}


exports.isNotRoomAuthor = (req,res,next)=>{
    let id = req.params.id;
    rooms.findById(id)
    .then(room=>{
        if(room.author != req.session.user){
            return next();
        }else{
            let err = new Error('Unauthorised to access the resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err=>next(err));
}

exports.isRoomAuthor = (req,res,next)=>{
    let id = req.params.id;
    rooms.findById(id)
    .then(room=>{
        if(room.author === req.session.user){
            return next();
        }else{
            let err = new Error('Unauthorised to access the resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err=>next(err));
}