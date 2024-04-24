import dbConnect from 'utils/dbConnect'
import Surah from "data/entities/surah"

export default async function handler(req, res) {
    const { method } = req
    const { id } = req.query
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let surah = await Surah.findOne({ id });
                if (!surah) {
                    res.json({ message: "cannot find surah" })
                }
                else
                    res.json(surah);
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}