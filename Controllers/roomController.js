const model = require('../Models/room');
const user = require('../Models/user');
const rsvp = require('../Models/rsvp');
const {DateTime} = require('luxon');
const {isLoggedin} = require('../middlewares/auth');
const {isAuthor} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');


exports.index = (req,res,next)=>{
    model.find()
    .then(rooms=>{
            if(rooms.length){
                var departmentsList = GetAllDepartments(rooms)
            }
            res.render('../views/room/connections',{rooms,departmentsList});
    })
    .catch(err=>next(err));
};

GetAllDepartments = function(rooms){
    var departmentsList = undefined;
    rooms.forEach(room=>{
        let departmentName = room.department;
        if(departmentsList == undefined){
            departmentsList = [];
            departmentsList.push(departmentName);
        }else if(departmentsList.findIndex(name => name.toLowerCase() === departmentName.toLowerCase()) === -1){
            departmentsList.push(departmentName);
        };
    })
    return departmentsList;
}

// Get / Get a form to create a room
exports.new = (req,res)=>{
    
    res.render('../views/room/new');
    //res.send('send a new form');
};

exports.create = (req,res,next) =>{
    let room = new model(req.body);
    room.author=req.session.user;
    
    room.save()
    .then(room=>{
        let newrsvp = new rsvp({roomId:room._id});
        newrsvp.save().then(rsvp=>{
            req.flash('success','You have successfully created a room');
            res.redirect('/rooms');
        })
        .catch(err=>next(err))
    })
    .catch(err=> {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        req.flash('error',err.message.split(","));
        res.redirect('back');
    });
}

exports.show = (req,res,next)=>{
    let id = req.params.id;
    let attendance = 0;
    if(!(req.params.id).match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid format of room id');
        err.status = 400;
        next(err);
    }
    
    rsvp.findOne({roomId:id})
    .then(result=>{
        attendance = result.yes.length;
        model.findById(id).populate('author',user)
        .then(room=>{
            if(room){
                res.render('../views/room/showdetail',{room,attendance});
            }else{
                let err = new Error('Invalid Room id');
                err.status = 404;
                next(err);
            }
        })
        .catch(err=>{
            err= new Error ('Cannot find Room details with id: '+id);
            err.status = 404
            res.render('error', {error: err})
        });
    })
    .catch(err=>{
        console.log(err);
        next(err)
    })    
};

// Edit a room with an ID

exports.edit = (req,res,next)=>{
    let id = req.params.id;
    if(!(req.params.id).match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid format of room id to edit');
        err.status = 400;
        next(err);
    }
    model.findById(id)
    .then(room=>{
       // room.date = room.date.toFormat
        if(room){
            res.render('../views/room/edit',{room});
        }else{
            let err = new Error('Invalid Room id to edit');
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        err = new Error('Cannot find detail to edit with id: '+ id);
        err.status = 404;
        res.status(err.status);
        res.render('error', {error: err});
    });
};

exports.update=(req,res,next)=>{
    let room = req.body;
    if(!(req.params.id).match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid format of Room id');
        err.status = 400;
        next(err);
    };
    room.author = req.session.user;
    model.findByIdAndUpdate(req.params.id,room,{useFindAndModify: false, runValidators: true})
    .then(room=>{
        if(room){
            req.flash('success','You have successfully updated the room details.');
            res.redirect('/rooms/'+room.id)
        }else{
            let err = new Error("Cannot find a room with id " + req.params.id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        req.flash('error',err.message);
        res.redirect('back');
    });
};

exports.rsvp = (req,res,next) =>{
    let room = req.params.id.toString();
    let userId = req.session.user.toString();
    if(!req.body){
        let err = new Error("RSVP must be 'yes', 'no' or 'maybe'");
        err.status =400;
        next(err); 
    }else if(req.body.rsvp.toLowerCase() === "yes"){
        rsvp.updateOne({roomId:room},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$push:{"yes":userId}})
        .then(result=>{
                req.flash('success','You have successfully RSVPed this room.');
                res.redirect('/users/profile');
            // }).catch(err=>next(err))
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }else if(req.body.rsvp.toLowerCase() === "no"){
        rsvp.updateOne({roomId:room},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$push:{"no":userId}})
        .then(result=>{
            console.log(result)
                req.flash('success','You have successfully RSVPed this room.');
                res.redirect('/users/profile');
            // }).catch(err=>next(err))
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }else if(req.body.rsvp.toLowerCase() === "maybe"){
        rsvp.updateOne({roomId:room},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
        })
        .catch(err=>{next(err)});

        rsvp.updateOne({roomId:room},{$push:{"maybe":userId}})
        .then(result=>{
                req.flash('success','You have successfully RSVPed this room.');
                res.redirect('/users/profile');
            // }).catch(err=>next(err))
        })
        .catch(err=>{
            console.log(err);
            next(err)
        })
    }else {
        let err = new Error("RSVP must be 'yes', 'no' or 'maybe'");
        err.status =400;
        next(err); 
    }
}

exports.rsvpDelete = (req,res,next)=>{
    let room = req.params.id.toString();
    let userId = req.session.user.toString();
    if(!req.body){
        let err = new Error("RSVP must be only 'yes', 'no' or 'maybe'");
        err.status = 400;
        next(err); 
    }else if(req.body.rsvp === "yes"){
        rsvp.updateOne({roomId:room},{$pull:{"yes":userId}})
        .then(result=>{
            console.log(result);
            req.flash('success','RSVP was deleted successfully!');
            res.redirect('/users/profile');
        })
        .catch(err=>{next(err)});
    }else if(req.body.rsvp === "no"){
        rsvp.updateOne({roomId:room},{$pull:{"no":userId}})
        .then(result=>{
            console.log(result);
            req.flash('success','RSVP was deleted successfully!');
            res.redirect('/users/profile');
        })
    .catch(err=>{next(err)});
    }else if(req.body.rsvp === "maybe"){
        rsvp.updateOne({roomId:room},{$pull:{"maybe":userId}})
        .then(result=>{
            console.log(result);
            req.flash('success','RSVP was deleted successfully!');
            res.redirect('/users/profile');
        })
        .catch(err=>{next(err)});
    }else {
        let err = new Error("RSVP must be either 'yes', 'no' or 'maybe'");
        err.status = 400;
        next(err); 
    }
}


// Delete a room identified by ID
exports.delete = (req,res,next)=>{
    if(!(req.params.id).match(/^[0-9a-fA-F]{24}$/))
    {
        let err = new Error('Invalid format of room id to edit');
        err.status = 400;
        next(err);
    }
    model.findByIdAndDelete(req.params.id, {useFindAndModify: false})
    .then(room=> {
        if(room){
            rsvp.findOneAndDelete({roomId:req.params.id})
            .then(result=>{
                req.flash('success','You have successfully deleted the room entry.');
                res.redirect('/rooms');
            })
            .catch(err=>next(err));
        } else{
            let err = new Error("Cannot find a room with id to Delete" + req.params.id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};