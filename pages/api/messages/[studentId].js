import Message from "data/entities/message"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
    const { method } = req
    let { studentId, startDate, endDate } = req.query

    await dbConnect()
    switch (method) {
        case 'GET':
            try {
                const messages = await Message.find(
                    {
                        studentId: studentId,
                        date: {
                            $gte: (new Date(startDate)).toISOString(),
                            $lte: (new Date(endDate)).toISOString()
                        }
                    }
                )
                res.json(messages)
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}