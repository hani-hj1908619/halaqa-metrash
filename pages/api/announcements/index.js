import Announcement from "data/entities/announcement";
import dbConnect from "utils/dbConnect";

export default async function handler(req, res) {
    const body = req.body
    const { method } = req
    const { startDate, endDate } = req.query

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let announcements
                if (startDate || endDate)
                    announcements = await Announcement.find({
                        date: {
                            $gte: (new Date(startDate)).toISOString(),
                            $lte: (new Date(endDate)).toISOString()
                        }
                    });
                else announcements = await Announcement.find({});
                res.status(200).json(announcements);
            } catch (error) {
                res.json(error)
            }
            break
        case 'POST':
            try {
                let response = await Announcement.create(req.body);
                res.json(response);
            } catch (error) {
                res.json(error)
            }
            break
        case 'PUT':
            try {
                let response = await Announcement.findByIdAndUpdate(req.body._id, req.body);
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