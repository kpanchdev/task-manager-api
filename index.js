import express from 'express';
import dotenv from 'dotenv';
import * as UserController from './controllers/UserController.js';
import * as TaskController from './controllers/TaskController.js';
import mongoose from "mongoose";
import checkAuth from "./utils/checkAuth.js";
import {createTaskValidation, statusValidation, updateTaskValidation} from "./validations/task.js";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";
import checkAuthor from "./utils/checkAuthor.js";
import {loginUser, registerUser} from "./validations/user.js";
import helmet from 'helmet';
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI.toString()
).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
});

const app = express();

app.use(helmet());

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || '*', // на проде поставь точный домен фронта
}))

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
});

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many login attempts. Try again later.",
});

app.use(limiter);

app.set('trust proxy', 1);

app.post('/register', ...registerUser, handleValidationsErrors, UserController.register);
app.post('/login', loginLimiter, ...loginUser, handleValidationsErrors, UserController.login);
app.get('/me', checkAuth, UserController.getMe);

app.post('/tasks', checkAuth, ...createTaskValidation, handleValidationsErrors, TaskController.create);

app.get('/tasks', TaskController.getAll);

app.get('/tasks/my', checkAuth, TaskController.getMy);

app.get('/tasks/:id', TaskController.getOne);

app.patch('/tasks/:id', checkAuth, checkAuthor, ...updateTaskValidation, handleValidationsErrors, TaskController.update);

app.delete('/tasks/:id', checkAuth, checkAuthor, TaskController.remove);

app.patch('/tasks/:id/status', checkAuth, checkAuthor, ...statusValidation, handleValidationsErrors, TaskController.updateStatus);

app.listen(process.env.PORT || 4444, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log(`Server is running`);
});
