// code to initialise all the collections should go here
// this can then be called upon signing in the application or before it

import fs from "fs-extra"
import Announcement from "data/entities/announcement"
import Student from "data/entities/student"
import Surah from "data/entities/surah"
import Task from "data/entities/task"
import Teacher from "data/entities/teacher"
import Message from "data/entities/message"
import dbConnect from "utils/dbConnect"

async function init(req, res, flags) {
    if (flags[0] == 1) {
        try {
            const data = await fs.readJson("./data/surah.json");
            await Surah.insertMany(data)
        } catch (err) {
            console.log(err)
        }
    }
    if (flags[2] == 1) {
        try {
            const data = await fs.readJson("./data/announcements.json");
            await Announcement.insertMany(data)
        } catch (err) {
            console.log(err)
        }
    }
    if (flags[3] == 1) {
        try {
            const data = await fs.readJson("./data/student.json");
            await Student.insertMany(data)
        } catch (err) {
            console.log(err)
        }
    }
    if (flags[4] == 1) {
        try {
            const data = await fs.readJson("./data/task.json");
            await Task.insertMany(data)
        } catch (err) {
            console.log(err)
        }
    }
    if (flags[5] == 1) {
        try {
            const data = await fs.readJson("./data/messages.json");
            await Message.insertMany(data)
        } catch (err) {
            console.log(err)
        }
    }

    res.json({ message: "inits are done" })

}

export default async function handler(req, res) {
    const { method } = req
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                let flags = []
                let surahs = await Surah.count({});
                let teachers = await Teacher.find({})
                let announcements = await Announcement.count({})
                let students = await Student.count({})
                let tasks = await Task.count({})
                let messages = await Message.count({})

                if (surahs == 0) {
                    flags[0] = 1
                }
                if (teachers.length == 0) {
                    flags[1] = 1
                }
                if (announcements == 0) {
                    flags[2] = 1
                }
                if (students == 0) {
                    flags[3] = 1
                }
                if (tasks == 0) {
                    flags[4] = 1
                }
                if (messages == 0) {
                    flags[5] = 1
                }

                await init(req, res, flags)

            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}