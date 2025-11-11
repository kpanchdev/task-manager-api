import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export default async (req, res, next) => {
    try{
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: 'Not authorized',
            });
        }

        req.userId = user._id

        next();
    }catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Token is not valid'});
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({message: 'Token is not valid'});
        }

        console.error(err);
        return res.status(500).json({message: 'Authentication error'});
    }
}

