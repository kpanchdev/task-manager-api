import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const doc = new User({
            email: email,
            passwordHash: hash,
            name: name,
        })

        await doc.save();

        const token = jwt.sign({
            id: doc._id,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        })

        const {passwordHash, ...userData} = doc._doc;

        res.status(200).json({userData, token});
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong :(',
        });
    }

}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(401).json({
                message: 'Email or password is incorrect',
            })
        }

        const name = user.name

        const isValidPass = bcrypt.compareSync(password, user.passwordHash);

        if (!isValidPass) {
            return res.status(401).json({
                message: 'Email or password is incorrect',
            })
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        })

        res.status(200).json({
            token,
            name
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong',
        })
    }
}

export const getMe = async (req, res) => {
    try{
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
            })
        }

        const {passwordHash, ...userData} = user._doc;

        res.status(200).json({
            userData,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong',
        })
    }
}
