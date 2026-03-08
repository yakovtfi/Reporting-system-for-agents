export const requireRole = (roles) => {
    return(req, res, next) => {
        if(!req.user){
            res.status(401).json({message: "Missing user"});
            return;
        }
        if(!roles.includes(req.user.role)){
        res.status(403).json({ message: "Forbidden" });
        return;
        }
        next();
    }
}