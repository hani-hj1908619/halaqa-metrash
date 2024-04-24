const mongoose = require("mongoose");

const ChildSchema = new mongoose.Schema({
    _id: { type: Number },
    firstName: { type: String, required: [true, "first name required"] },
    lastName: { type: String, required: [true, "last name required"] },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["M", "F"] },
    schoolGrade: { type: String, required: true },
    teacherId: { type: Number, ref: "Teacher" },
    active: { type: Boolean, required: true }
})

const StudentSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    firstName: { type: String, required: [true, "first name required"] },
    lastName: { type: String, required: [true, "last name required"] },
    mobile: { type: String, required: true },
    email: { type: String, required: [true, "email required"] },
    username: { type: String, required: [true, "username required"] },
    password: { type: String, required: [true, "password required"] },
    students: [ChildSchema]
});

export default mongoose.models.Student || mongoose.model("Student", StudentSchema)