import dbConnect from 'utils/dbConnect';
import Student from "data/entities/student"

export default async function handler(req, res) {
    const { method } = req
    const { username } = req.query
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let students = await Student.findOne({ username });
                if (!students) {
                    res.status(400).json({})
                }
                else
                    res.json(students);
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}