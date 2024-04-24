const mongoose = require("mongoose");

const SurahSchema = mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    englishName: { type: String, required: true, unique: true },
    ayaCount: { type: Number, required: true },
    type: { type: String, required: true }
});

export default mongoose.models.Surah || mongoose.model("Surah", SurahSchema);