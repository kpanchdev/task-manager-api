import {body} from 'express-validator';

export const registerUser = [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter more than 5 chars').isString().trim().isLength({min: 5}),
    body('name', 'Enter name').isString().trim().isLength({min: 2}),
]

export const loginUser = [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter password').exists(),
]