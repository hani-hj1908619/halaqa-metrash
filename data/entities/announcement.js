const mongoose = require("mongoose")

const AnnouncementSchema = mongoose.Schema({
    _id: {type: Number, required: true},
    title: {type: String, required: true},
    msg: {type: String, required: true},
    date: {type: Date, required: true},
    image: {type: String, required: false}
})

export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema)