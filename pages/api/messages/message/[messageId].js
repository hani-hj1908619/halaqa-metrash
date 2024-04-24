import Message from "data/entities/message"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
    const { method } = req
    const {messageId} = req.query

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const messages = await Message.findOne({_id: messageId})
                res.json(messages)
            } catch (error) {
                res.json(error)
            }
            break
        case 'DELETE':
            try {
                const messages = await Message.deleteOne({_id: messageId})
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