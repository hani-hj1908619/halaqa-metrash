import dbConnect from 'utils/dbConnect';
import Student from 'data/entities/student';

export default async function handler(req, res) {
    const { method } = req
    const { parentonly, type } = req.query
    let id = req.query.id
    let childId = req.query.childId

    await dbConnect()

    switch (method) {
        case 'GET':
            let students = []
            if (type === 'parent') {
                if (childId == undefined || !childId) {
                    try {
                        id = parseInt(id)
                        let parent = await Student.findOne({ _id: id }).populate("students.teacherId");
                        res.status(200).json(parent.students);
                    } catch (error) {
                        res.status(500).json(error)
                    }
                } else if (childId) {
                    try {
                        id = parseInt(id)
                        childId = parseInt(childId)
                        const student = await Student.findOne({ _id: id }).select({ students: { $elemMatch: { _id: childId } } })
                        res.status(200).json(student)
                    } catch (error) {
                        res.status(500).json(error)
                    }
                }
            } else if (type === 'coordinator') {
                try {
                    students = await Student.find({}).populate("students.teacherId").select("students")
                    res.status(200).json(students)
                } catch (error) {
                    res.status(500).json(error)
                }
            } else if (type === 'teacher') {
                try {
                    if (id) id = parseInt(id)
                    const agg = await Student.aggregate([
                        {
                            '$unwind': {
                                'path': '$students'
                            }
                        }, {
                            '$replaceRoot': {
                                'newRoot': '$students'
                            }
                        }, {
                            '$match': {
                                'teacherId': id
                            }
                        }
                    ], function (err, students) {
                        if (err)
                            res.status(500).json(err)
                        else if (students.length > 0)
                            res.status(200).json(students)
                        else res.status(200).json([])
                    });
                } catch (error) {
                    res.status(500).json(error)
                }
            } else {
                try {
                    if (parentonly) {
                        students = await Student.find({}, "-students")
                    } else {
                        students = await Student.find({})
                    }
                    res.status(200).json(students)
                } catch (error) {
                    res.status(500).json(error)
                }
            }
            break
        case 'POST':
            try {
                let parent = req.body.parentForm
                let studentObj = req.body.studentForm
                studentObj._id = parseInt(studentObj._id)
                parent.students = [{ ...studentObj }]
                const add = await Student.create(parent)
                res.status(200).json({ add })
            } catch (e) {
                res.status(500).error(e)
            }
            break
        case 'PUT':
            try {
                let studentObj = req.body.studentForm
                studentObj._id = parseInt(studentObj._id)
                const { _id } = req.body.parentForm
                Student.findOneAndUpdate(
                    { _id },
                    { $push: { students: studentObj } },
                    function (error, success) {
                        if (error) {
                            res.status(500).json({ error })
                        } else {
                            res.status(200).json({ message: "success" });
                        }
                    });
            } catch (e) {
                res.status(500).json({ error: e })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}