import dbConnect from 'utils/dbConnect'
import Student from 'data/entities/student'

export default async function handler(req, res) {
    const { method } = req
    const { email } = req.query
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let parent = await Student.findOne({ email });
                if (!parent) {
                    res.status(400).json({})
                }
                else
                    res.json(parent);
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}