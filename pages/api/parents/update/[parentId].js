import dbConnect from 'utils/dbConnect';
import Student from 'data/entities/student';
import Joi from "joi"

export default async function handler(req, res) {
    const { method } = req
    const { parentId } = req.query
    const childId = parseInt(req.query.childId)
    await dbConnect()

    const childSchema = Joi.object().keys({
        _id: Joi.number().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        dob: Joi.date().required(),
        gender: Joi.string().required(),
        schoolGrade: Joi.string().required(),
        teacherId: Joi.number().required(),
        active: Joi.boolean().required()
    });

    switch (method) {
        case 'PUT':
            try {
                const result = childSchema.validate(req.body);
                if (result.error) {
                    console.log(result.error.message);
                    return res.json({
                        error: true,
                        status: 400,
                        message: result.error.message,
                    });
                }

                const updatedStudent = await Student.findOneAndUpdate(
                    {
                        _id: parseInt(parentId),
                    },
                    { $set: { "students.$[e1]": result.value } },
                    {
                        arrayFilters: [
                            { "e1._id": childId },
                        ],
                    }
                );
                res.json(updatedStudent)
            } catch (error) {
                res.json(error)
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}