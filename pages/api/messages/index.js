import Message from "data/entities/message"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let messages = await Message.find({});
                res.json(messages);
            } catch (error) {
                res.json(error)
            }
            break
        case 'POST':
            try {
                let response = await Message.create(req.body);
                res.json(response);
            } catch (error) {
                res.json(error)
            }
            break
        case 'PUT':
            try {
                let response = await Message.findByIdAndUpdate(req.body._id, req.body);
                res.json(response);
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}