function authuser(req, res, next){
    if(req.user == null){
        res.status(403)
        return res.send("u need to login")
    }
    next()
}




module.exports= authuser