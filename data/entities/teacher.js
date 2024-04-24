const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    _id: { type: Number, required: [true, "staff number required"], unique: true },
    username: { type: String, required: [true, "username required"] },
    firstName: { type: String, required: [true, "first name required"] },
    lastName: { type: String, required: [true, "last name required"] },
    email: { type: String, required: [true, "email required"] },
    password: { type: String, required: [true, "password required"] },
    isCoordinator: { type: Number, required: [true, "is coordinator required"] }
});

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);