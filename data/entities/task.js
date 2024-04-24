const mongoose = require("mongoose")
import TASK_TYPE from "enums/enums"

const TaskSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true,
    },
    studentId: {
        type: Number,
        required: true,
        ref: "Student",
    },
    teacherId: {
        type: Number,
        required: true,
        ref: "Teacher",
    },
    surahId: {
        type: Number,
        required: true,
        ref: "Surah",
    },
    fromAya: { type: Number, required: true },
    toAya: { type: Number, required: true },
    type: { type: String, required: true, enum: Object.values(TASK_TYPE) },
    dueDate: { type: Date, required: true },
    completedDate: { type: Date, required: false },
    masteryLevel: { type: String, required: false },
    comment: { type: String, required: false }
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);