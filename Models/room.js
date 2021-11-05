const { forEach } = require('async');
//const { Timestamp } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
    {
        department:{type:String, required:[true, 'Department is required']},
        author: {type: Schema.Types.ObjectId,ref:'User'},
        course:{type:String, required:[true, 'Course is required']},
        topic:{type:String, required:[true, 'Topic is required']},
        date:{type:String, required:[true, 'Date is required']}, 
        startTime: {type: String, required:[true, 'StartTime is required']}, 
        endTime:{type: String, required:[true, 'StartTime is required']}, 
        imageURL:{type:String, required:[true, 'Image URL is required']}, 
        location:{type:String, required:[true, 'Location is required']},
        roomType:{type:String, required:[true, 'Type of room is required']}, 
        content:{type:String, required:[true, 'Description is required'],
                minLength: [10, 'The details should have atleast 10 characters']}, 
    },
    {   timestamps:true }
);
module.exports=mongoose.model('Room',roomSchema);

exports.getRooms = () => rooms;

exports.find= ()=> rooms; 

exports.findById= function fetchRoomById(id){
    let roomfound;
    for(const[key,value] of Object.entries(rooms)){
        value.map(room=>{
            if(room.id===id){
                roomfound = room;
            }
        });
        if(roomfound!==undefined) break;
    }
    return roomfound;
};


exports.updateById = function updateDetail(newDetail){
    let status = "notUpdated";
    let UpdatedAt =0;
    rooms.forEach(room=>{
        room.details.forEach(detail=>{
            if(detail.id===newDetail.id && detail.department.toLowerCase()==newDetail.department.toLowerCase())
            {
                detail.host=newDetail.host;
                detail.course=newDetail.course;
                detail.topic=newDetail.topic;
                detail.date=newDetail.date;
                detail.startTime=newDetail.startTime;
                detail.endTime=newDetail.endTime;
                detail.imageUrl=newDetail.imageUrl;
                detail.location=newDetail.location;
                detail.roomType=newDetail.roomType;
                detail.content=newDetail.content;
                status="Updated";
                UpdatedAt = 1;
            }
        });
    });
    if(status==="notUpdated"){
        rooms.forEach(room=>{
            if(room.department.toLowerCase()===newDetail.department.toLowerCase()){
                room.details.push(newDetail);
                status="Updated";
                UpdatedAt = 2;
            }
        });
        if(UpdatedAt===0){
            let department=newDetail.department;
            let details=[newDetail];
            let room={department,details};
            rooms.push(room);
            status="Updated";
            rooms.forEach(room=>{
                room.details.forEach(detail=>{
                    if(detail.id===newDetail.id && detail.department.toLowerCase()!=newDetail.department.toLowerCase())
                    {   
                        index=room.details.findIndex(detail=>detail.id===newDetail.id);  
                        console.log("index"+index);
                        if(index !== -1){
                            room.details.splice(index,1);
                        }
                    }
                });
            });
        }
    }
    if(UpdatedAt === 2){
        rooms.forEach(room=>{
            room.details.forEach(detail=>{
                if(detail.id===newDetail.id && detail.department.toLowerCase()!=newDetail.department.toLowerCase())
                {   
                    index=room.details.findIndex(detail=>detail.id===newDetail.id);        
                    if(index !== -1){
                        room.details.splice(index,1);
                    }
                }
            });
        });
    }
    rooms.forEach(clearRoom=>{
        if(clearRoom.details.length===0)
        {
            index2=rooms.findIndex(room=>room.department===clearRoom.department);
            if(index2 !== -1){rooms.splice(index2,1)};
            status='deleted';
        }
    });
    if(status="Updated"){
        return true;    
    }else{
        return false;
    }
};


exports.deleteById = function(id,department){
    let index,index2;
    let status="notDeleted"
    rooms.forEach(room=>{
        if(room.department.toLowerCase()===department.toLowerCase())
        {
            index=room.details.findIndex(detail=>detail.id===id);
            if(index !== -1){
                room.details.splice(index,1);
                status="deleted";
            }
        }
    });
    rooms.forEach(clearRoom=>{
        if(clearRoom.details.length===0)
        {
            index2=rooms.findIndex(room=>room.department===clearRoom.department);
            if(index2 !== -1){rooms.splice(index2,1)};
            status='deleted';
        }
    });
    if(status==="deleted"){
        return true;
    }else{
        return false;
    }
};
