import {body} from 'express-validator';

export const createTaskValidation = [
    body('title', 'Enter task title').isString().trim().isLength({min: 3}),
    body('description', 'Enter task description').isString().trim().isLength({min: 5}),
    body('status', 'Task status should be "todo", "done" or "in progress"').optional().isIn(['todo', 'done', 'in progress']),
    body('dueDate', 'Incorrect date format').optional().isISO8601().toDate(),
]
export const updateTaskValidation = [
    body('title', 'Enter task title').optional().isString().trim().isLength({min: 3}),
    body('description', 'Enter task description').optional().isString().trim().isLength({min: 5}),
    body('status', 'Task status should be "todo", "done" or "in progress"').optional().isIn(['todo', 'done', 'in progress']),
    body('dueDate', 'Incorrect date format').optional().isISO8601().toDate(),
]
export const statusValidation = [
    body('status', 'Task status should be "todo", "done" or "in progress"').optional().isIn(['todo', 'done', 'in progress']),
]