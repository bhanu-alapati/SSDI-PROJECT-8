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