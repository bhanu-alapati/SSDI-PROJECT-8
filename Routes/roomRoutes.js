const express = require('express');
const controller = require ('../Controllers/roomController');
const router = express.Router();
const {isLoggedin} = require('../middlewares/auth');
const {isAuthor} = require('../middlewares/auth');
const {isNotRoomAuthor} = require('../middlewares/auth');
const {isRoomAuthor} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');
const {validateRoom,validateRsvp,validateResult} = require('../middlewares/validator');
router.get('/',controller.index);

// Get / Get a form to create a room
router.get('/new',isLoggedin, controller.new);

//Get a existing room with ID.
router.get('/:id',validateId, controller.show);

//POST a new room
router.post('/',isLoggedin,validateRoom,validateResult, controller.create);


// Edit a room with an ID

router.get('/:id/edit',isLoggedin, validateId, isAuthor, controller.edit);
router.put('/:id',isLoggedin, validateId,  isAuthor, validateRoom,validateResult,controller.update);

//RSVP Connections
router.post('/:id/rsvp',isLoggedin, validateId, validateRsvp, isNotRoomAuthor, controller.rsvp);
router.delete('/:id/rsvp',isLoggedin, validateId,validateRsvp,isRoomAuthor, controller.rsvpDelete);


// Update a room identified by ID
router.delete('/:id', isLoggedin, validateId, isAuthor, controller.delete);

module.exports=router;