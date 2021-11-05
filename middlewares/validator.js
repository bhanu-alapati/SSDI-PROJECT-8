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