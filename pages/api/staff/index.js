import dbConnect from 'utils/dbConnect';
import Teacher from "data/entities/teacher"
import fs from "fs-extra"

export default async function handler(req, res) {
    const { method } = req
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let teachers = await Teacher.find({});
                if (teachers.length == 0) {
                    await init(req, res)
                }
                else
                    res.json(teachers);
            } catch (error) {
                res.json(error)
            }
            break
        case 'POST':
            try {
                const newTeacher = await Teacher.create(req.body)
                res.json(newTeacher)
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}

async function init(req, res) {

    try {
        let teachers
        const data = await fs.readJson("./data/teacher.json");
        const waiting = await Teacher.insertMany(data)
        if (waiting.acknowledged) { //if insert operation was done.
            teachers = await Teacher.find({});
        }
        res.json(teachers || { message: "unable to get" })
    } catch (e) {
        console.error(e);
    }
}
