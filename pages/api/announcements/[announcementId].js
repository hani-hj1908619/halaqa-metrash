import dbConnect from 'utils/dbConnect';
import Announcement from "data/entities/announcement"

export default async function handler(req, res) {
    const { method } = req
    const { announcementId } = req.query
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let announcement = await Announcement.findOne({ _id: announcementId });
                if (!announcement) {
                    res.json({ message: "cannot find announcement" })
                }
                else
                    res.json(announcement);
            } catch (error) {
                res.json(error)
            }
            break
        case 'DELETE':
            try {
                let announcement = await Announcement.deleteOne({ _id: announcementId });
                if (!announcement) {
                    res.json({ message: "cannot find announcement" })
                }
                else
                    res.json(announcement);
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}