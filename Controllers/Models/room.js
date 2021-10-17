const { forEach } = require('async');
const {DateTime} = require('luxon');
//const { Timestamp } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
    {
        department:{type:String, required:[true, 'Department is required'],
                                minLength:[3,'Department must be 3 or more characters']},
        author: {type: Schema.Types.ObjectId,ref:'User'},
        course:{type:String, required:[true, 'Course is required'],
                            minLength:[3,'Course must be 3 or more characters']},
        topic:{type:String, required:[true, 'Topic is required'],
                            minLength:[3,'Topic must be 3 or more characters']},
        date:{type:String, required:[true, 'Date is required'],
                            minimum:[DateTime.now().toFormat("yyyy-LL-dd"),"Date must be greater than today's date"]}, 
        startTime: {type: String, required:[true, 'Start Time is required']}, 
        endTime:{type: String, required:[true, 'End Time is required']}, 
        imageURL:{type:String, required:[true, 'Image URL is required']}, 
        location:{type:String, required:[true, 'Location is required']},
        roomType:{type:String, required:[true, 'Type of room is required']}, 
        content:{type:String, required:[true, 'Description is required'],
                minLength: [10, 'The details should have atleast 10 characters']}, 

    },
    {   timestamps:true }
);
module.exports=mongoose.model('Room',roomSchema);

