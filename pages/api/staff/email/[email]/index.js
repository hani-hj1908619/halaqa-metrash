import dbConnect from 'utils/dbConnect'
import Teacher from 'data/entities/teacher'

export default async function handler(req, res) {
    const { method } = req
    const { email } = req.query
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let staff = await Teacher.findOne({ email });
                if (!staff) {
                    res.status(400).json({})
                }
                else
                    res.json(staff);
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}