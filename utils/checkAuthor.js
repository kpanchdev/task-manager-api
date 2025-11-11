import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

export default async (req, res, next) => {
    try{
        const userId = req.userId;

        const taskId = req.params.id;

        if(!taskId || !mongoose.Types.ObjectId.isValid(taskId)){
            return res.status(400).send({
                message: 'Invalid task id'
            })
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(401).json({
                message: 'Task not found'
            })
        }

        if(task.user.toString() !== userId.toString()) {
            return res.status(403).json({
            message: 'Not allowed'
            })
        }

        next();
    }catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Authority error'});
    }
}
