import mongoose from "mongoose";

    const TaskSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        description: String,
        status: {
            type: String,
            enum: ['todo', 'in progress', 'done'],
            default: 'todo',
        },
        dueDate: Date,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }

    },
        {
            timestamps: true,
        });

    TaskSchema.index({ user: 1 });

    //TaskSchema.index({ title: 'text', description: 'text' });

    export default mongoose.model('Task', TaskSchema);