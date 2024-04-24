import dbConnect from 'utils/dbConnect'
import Surah from "data/entities/surah"

export default async function handler(req, res) {
    const { method } = req
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let surahs = await Surah.find({});
                res.json(surahs);
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}