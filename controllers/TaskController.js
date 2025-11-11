import Task from '../models/Task.js';
import mongoose from 'mongoose';
import task from "../models/Task.js";
import {parse} from "dotenv";

export const create = async (req, res) => {
    try{
        const {title, description, dueDate} = req.body;
        const userId = req.userId

        const task = new Task({
            title: title,
            description: description,
            dueDate: dueDate,
            user: userId
        })

        const doc = await task.save();

        res.status(200).json({
            message: 'Task created successfully.',
            doc,
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong',
        })
    }
}

export const getAll = async (req, res) => {
    try{
        const {q, status, sort, notOverdue} = req.query;

        const page = parseInt(req.query.page) && parseInt(req.query.page) >= 1 ? req.query.page : 1;

        const limit = parseInt(req.query.limit) && parseInt(req.query.limit) >= 1 ? req.query.limit : 2;

        const skip = (page - 1) * limit;

        const filter = {}

        const now = new Date();

        if (notOverdue === 'true') {
            filter.dueDate = {$gte: now };
        }

        if (status){
            filter.status = status;
        }

        if (q){
            filter.$or = [
                {title: new RegExp(q, 'i')},
                {description: new RegExp(q, 'i')}
            ];
        }

        let sortObj = { createdAt: sort === 'asc' ? 1 : -1 };

        if (sort === 'dueSoon'){
            filter.dueDate = {$gte: now };
            sortObj = { dueDate: 1 };
        }

        const totalTasksCount = await Task.countDocuments(filter);

        const tasks = await Task.find(filter).sort(sortObj).skip(skip).limit(limit).populate('user', 'name').exec();;

        res.status(200).json({
            tasks,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalTasksCount / limit),
            totalTasks: totalTasksCount,
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong',
        })
    }
}
export const getMy = async (req, res) => {
    try{
        const userId = req.userId

        if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
            res.status(400).send({
                message: 'Invalid user id'
            })
        }

        const {q, status, sort, notOverdue} = req.query;

        const filter = { user: userId };

        const page = parseInt(req.query.page) && parseInt(req.query.page) >= 1 ? req.query.page : 1;

        const limit = parseInt(req.query.limit) && parseInt(req.query.limit) >= 1 ? req.query.limit : 2;

        const skip = (page - 1) * limit;

        const now = new Date();

        if (notOverdue === 'true') {
            filter.dueDate = { $gte: now };
        }

        if (status){
            filter.status = status;
        }

        if (q){
            filter.$or = [
                {title: new RegExp(q, 'i')},
                {description: new RegExp(q, 'i')}
            ];
        }

        let sortObj = { createdAt: sort === 'asc' ? 1 : -1 };

        if (sort === 'dueSoon'){
            filter.dueDate = {$gte: now };
            sortObj = { dueDate: 1 };
        }

        const totalTasksCount = await Task.countDocuments(filter);

        const myTasks = await Task.find(filter).sort(sortObj).skip(skip).limit(limit).populate('user', 'name').exec();

        res.status(200).json({
            myTasks,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalTasksCount / limit),
            totalTasks: totalTasksCount,
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong',
        })
    }
}

export const getOne = async (req, res) => {
    const taskId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(taskId)){
        return res.status(404).send({
            message: 'No task found'
        })
    }

    const task = await Task.findOne({_id: taskId}).populate('user', 'name').exec();

    if(!task){
        return res.status(404).send({
            message: 'No task found'
        })
    }

    res.status(200).json({
        task
    })

}

export const update = async (req, res) => {
    try{
        const taskId = req.params.id;

        if (!req.body) {
            return res.status(200).json({
                message: "No changes sent" });
        }

        const {title, description, dueDate, status} = req.body;

        const task = await Task.findOneAndUpdate({
            _id: taskId,
        },{
            title: title,
            description: description,
            dueDate: dueDate,
            status: status
        },{
            new: true,
        });

        if (!task) {
            return res.status(404).send({
                message: 'Task not found.',
            })
        }


        res.status(200).json({
            message: 'Task updated successfully.',
            task,
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong',
        })
    }
}
export const updateStatus = async (req, res) => {
    try{
        const taskId = req.params.id;

        if (!req.body || !req.body.status) {
            return res.status(200).json({
                message: "No changes sent" });
        }

        const newStatus = req.body.status;

        const result = await Task.updateOne({
            _id: taskId,
        },{
            status: newStatus
        });

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Task not found" });
        }

        if (result.modifiedCount === 0) {
            return res.status(200).send({ message: "Task already has this status" });
        }

        res.status(200).json({
            message: 'Status updated successfully.',
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong',
        })
    }
}

export const remove = async (req, res) => {
    try{
        const taskId = req.params.id;

        const result = await Task.deleteOne({
            _id: taskId,
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: 'Task not found',
            })
        }

        res.status(200).json({
            message: 'Task deleted successfully.',
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong',
        })
    }
}