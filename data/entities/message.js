const mongoose = require("mongoose")

const MessageSchema = mongoose.Schema({
    _id: {type: Number, required: true},
    studentId: {type: Number, required: true, ref: "Student"},
    date: {type: Date, required: true},
    message: {type: String, required: false},
    image: {type: String, required: false}
})

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)
