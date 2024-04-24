import Task from "data/entities/task"
import Student from "data/entities/student"
import dbConnect from "utils/dbConnect"

export default async function handler(req, res) {
    const { method } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const { type, id } = req.query

                if (type === 'parent') {
                    let students = await Student.aggregate([
                        {
                            '$match': {
                                '_id': 12
                            }
                        }, {
                            '$unwind': {
                                'path': '$students'
                            }
                        }, {
                            '$replaceRoot': {
                                'newRoot': '$students'
                            }
                        }
                    ])
                    students = students.map(s => s._id)

                    let tasks = await Task.find({ studentId: { '$in': students } })
                    res.status(200).json(tasks)
                }
                else if (type === 'coordinator') {
                    let tasks = await Task.find({})
                    res.status(200).json(tasks)
                }
                else if (type === 'teacher') {
                    let tasks = await Task.find({ teacherId: id })
                    res.status(200).json(tasks)
                }
                else
                    res.status(200).json([])

            } catch (error) {
                res.status(500).json(error)
            }
            break
        case 'POST':
            try {
                const task = req.body
                const tasks = await Task.find({})
                task._id = tasks[tasks.length - 1]._id + 1
                let response = await Task.create(task)
                res.status(200).json(response)
            } catch (error) {
                res.status(500).json(error)
            }
            break
        case 'PATCH':
            try {
                let response = await Task.findByIdAndUpdate(req.body._id, req.body)
                res.status(200).json(response)
            } catch (error) {
                res.status(500).json(error)
            }
            break
        case 'DELETE':
            try {
                if (!req.body._id) res.status(400).send()
                let response = await Task.deleteOne({ _id: req.body._id })
                res.status(200).json(response)
            } catch (error) {
                res.status(500).json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}