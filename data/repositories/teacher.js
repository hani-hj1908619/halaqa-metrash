import Teacher from "data/entities/teacher";
import fs from "fs-extra";

class TeacherRepo {

    constructor() {
        if (!TeacherRepo._instance) {
            TeacherRepo._instance = this;
        }

        return TeacherRepo._instance;
    }

    async addTeacher(teacher) {
        return await Teacher.create(teacher);
    }

    async getTeacher() {
        return await Teacher.find({});
    }

    async getTeacher(teacherId) {
        return await Teacher.findOne({ _id: teacherId });
    }

    async updateTeacher(updatedTeacher) {
        return await Teacher.findByIdAndUpdate(updatedTeacher.teacherId, updatedTeacher);
    }

    async deleteTeacher(teacherId) {
        return await Teacher.deleteOne({ _id: teacherId });
    }

    async deleteAllTeachers() {
        return await Teacher.deleteMany({});
    }

    async init() {
        const flag = await Teacher.count({});
        console.log(flag)
        if (!flag) {
            const data = await fs.readJson('../teacher.json');
            const inserting = await Teacher.insertMany(data)
            console.log(inserting.acknowledged)
        }
    }
}

export default TeacherRepo